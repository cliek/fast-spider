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
    let Threads = {};
    let T = null; 
    let AvailableIds = [];
    let RunningThreads = 0;
    let DelayTimetor = null;
    let DelayTimeExit = 10000;
    const Write = config.pipe && config.pipe.enabled && new Pipe(config.pipe);
    for (let index = 0; index < config.ThreadsNum; index++) {
        const _worker = new Worker(path.resolve(__dirname, './threads.js'),{
            workerData: {
                taskPath: config.taskPath,
                modules: config.modules,
                plugins: config.plugins
            }
        });
        Threads[_worker.threadId] = _worker;
        AvailableIds.push(_worker.threadId);
        // addListener
        _worker.on('online', function(wk){
            logLine.await('threads ' + (index+1) + ' start online running');
            RunningThreads ++
            if(RunningThreads === 1){
                startTask();
            }
        })
        _worker.on('message', function(value){
            switch (value.type) {
                case 'add':
                    addListQueueMap(value.data);
                    break;
                case 'pipe':
                    if(Write) Write.write(value.data);
                    break;
                case 'done':
                    AvailableIds.push(value.data);
                    break;
                case 'exit':
                    process.exit();
                    break;
                default:
                    logs.info('addQueueError:' + value)
                    break;
            }
        })
        _worker.on('exit', async function(exitCode){
            RunningThreads--
            if(exitCode === 0){
                if(RunningThreads == 0){
                    if(Write && !Write.fristWrite) await Write.appendFile(']')
                    if(!config.schedule){
                        logs.success('all queueList and threads completion, process exit!');
                        process.exit();
                    }else{
                        logs.info('The current scheduled task is enabled and will continue after' + JSON.stringify(config.schedule));
                        if(T) clearInterval(T);
                        Threads.length = 0;
                        RunningThreads = 0;
                    }
                }else{
                    logLine.await('The remaining ' + RunningThreads +' threads are running');
                }
            }else{
                // The child thread exits unexpectedly
                const _worker = new Worker(path.resolve(__dirname, './threads.js'),{
                    workerData: {
                        taskPath: config.taskPath
                    }
                });
                Threads[_worker.threadId] = _worker;
                AvailableIds.push(_worker.threadId);
            }
        })
        _worker.on('error', function(err){
            logs.error(err);
        })
        _worker.on('messageerror', function(error){
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
        T = setInterval(async() => {
            if(AvailableIds.length === 0) return logs.await('The thread is busy, please wait...');
            const queueSize = await size();
            if(queueSize){
                const { data } = await pop();
                const threadId = AvailableIds.shift();
                if(!threadId) return console.log(AvailableIds.length === 0)
                Threads[threadId].postMessage({
                    type: 'task', 
                    data: {
                        threadId,
                        ...data
                    }
                });
                if(DelayTimetor) {
                    clearTimeout(DelayTimetor)
                    DelayTimetor = null
                };
            }else{
                if(!DelayTimetor){
                    if(!RunningThreads) console.error('The number of child processes is empty');
                    if(!await size()) logLine.await('The queueList data is empty');
                    logs.info(`threads completion ${ DelayTimeExit / 1000 }s after process exit!`)
                    DelayTimetor = setTimeout(()=>{
                        AvailableIds.map(id => {
                            Threads[id].postMessage({
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