const path = require('path');
const { logs, logLine } = require('../utils/logs');
const { v1:uuidv1 } = require("uuid");
const { Worker } = require('worker_threads');
const Pipe = require('../utils/pipe');

exports.startThreads = function(config){
    if(!config.ThreadsNum || typeof config.ThreadsNum !== 'number'){
        throw 'ThreadsNum Type must number!'
    }
    const { add, pop, size } = require(config.queuePath);
    let Threads = [];
    let T = null; 
    let RollIndex = 0;
    let RunningThreads = 0;
    let DelayTimetor = null;
    let DelayTimeExit = 10000;
    const Write = config.pipe && config.pipe.enabled && new Pipe(config.pipe);
    for (let index = 0; index < config.ThreadsNum; index++) {
        RunningThreads ++
        Threads[index] = new Worker(path.resolve(__dirname, './threads.js'),{
            workerData: {
                taskPath: config.taskPath,
                modules: config.modules,
                plugins: config.plugins
            }
        });
        // addListener
        Threads[index].on('online', function(wk){
            logLine.await('threads ' + (index+1) + ' start online running');
            startTask();
        })
        Threads[index].on('message', function(value){
            switch (value.type) {
                case 'add':
                    addListQueueMap(value.data);
                    break;
                case 'pipe':
                    if(Write) Write.write(value.data)
                    break;
                default:
                    logs.log('addQueueError:' + value)
                    break;
            }
        })
        Threads[index].on('exit', async function(exitCode){
            if(exitCode === 0){
                RunningThreads = Threads.filter(i => i.threadId !== -1)
                const _threadsNum = RunningThreads.length
                logLine.await('The remaining ' + _threadsNum +' threads are running');
                if(_threadsNum == 0){
                    if(Write && !Write.fristWrite) await Write.appendFile(']')
                    if(!config.schedule){
                        logs.log('all queueList and threads completion， process exit!');
                        process.exit();
                    }else{
                        logs.info('The current scheduled task is enabled and will continue after' + JSON.stringify(config.schedule));
                    }
                }
            }else{
                // 子线程异常退出
                Threads[Threads.length] = new Worker(path.resolve(__dirname, './threads.js'),{
                    workerData: {
                        taskPath: config.taskPath
                    }
                });
                RunningThreads ++
            }
        })
        Threads[index].on('error', function(err){
            logs.error(err);
        })
        Threads[index].on('messageerror', function(error){
            logs.error(error);
        })
    }

    const addListQueueMap = function(obj){
		if(typeof obj !== 'object') throw Error ("async mode next params type object required!");
		if(Object.hasOwnProperty('id')){
			const { id , ...arg}  = obj;
			add(id,arg);
		}else{
			add(uuidv1(), obj);
		}
	}

    const startTask = function(){
        T = setInterval(() => {
            if(RollIndex > RunningThreads * 1000)  RollIndex = 0
            if(size() && RunningThreads){
                const { data } = pop();
                Threads[RollIndex % RunningThreads].postMessage({
                    type: 'task', 
                    data
                });
                RollIndex ++;
                if(DelayTimetor) {
                    clearTimeout(DelayTimetor)
                    DelayTimetor = null
                };
            }else{
                if(!DelayTimetor){
                    if(!RunningThreads) throw 'process_child num is null';
                    if(!size()) logLine.await('queueList is null');
                    logLine.log(`${ DelayTimeExit / 1000 }s after process exit!`)
                    DelayTimetor = setTimeout(()=>{
                        Threads.map(is => {
                            is.postMessage({
                                type: 'exit'
                            });
                        });
                    }, DelayTimeExit);
                }
            }
        }, config.interval);
        addListQueueMap(config.firstTask)
    }
}