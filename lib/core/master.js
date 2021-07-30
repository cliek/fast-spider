const path = require('path');
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
            console.log('threads ' + (index+1) + ' start online running');
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
                    console.log('addQueueError:' + value)
                    break;
            }
        })
        Threads[index].on('exit', async function(exitCode){
            if(exitCode === 0){
                RunningThreads = Threads.filter(i => i.threadId !== -1)
                const _threadsNum = RunningThreads.length
                console.log('The remaining ' + _threadsNum +' threads are running');
                if(_threadsNum == 0){
                    console.log('all queueList and threads completion， process exit!')
                    if(Write && !Write.fristWrite) await Write.appendFile(']')
                    process.exit();
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
            console.log(err);
        })
        Threads[index].on('messageerror', function(error){
            console.log(error);
        })
    }

    const addListQueueMap = function(obj){
		if(typeof obj !== 'object') throw Error ("sync mode next params type object required!");
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
                    if(!size()) console.log('queueList is null');
                    console.log(`${ DelayTimeExit / 1000 }s after process exit!`)
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