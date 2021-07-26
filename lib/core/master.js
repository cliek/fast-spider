const path = require('path');
const { v1:uuidv1 } = require("uuid");
const { Worker } = require('worker_threads');

exports.startThreads = function(config){
    if(config.ThreadsNum && typeof config.ThreadsNum !== 'number'){
        throw 'ThreadsNum Type must number!'
    }
    const { add, pop, size } = require(config.queuePath);
    let Threads = [];
    let T = null; 
    let RollIndex = 0;
    let RunningThreads = 0;
    for (let index = 0; index < ThreadsNum; index++) {
        Threads[index] = new Worker(path.resolve(__dirname, './threads.js'),{
            workerData: {
                taskPath: config.taskPath
            }
        });
        // addListener
        Threads[index].on('online', function(wk){
            console.log('threads ' + (index+1) + ' start online runningThe');
            startTask()
        })
        Threads[index].on('message', function(value){
            console.log(value);
        })
        Threads[index].on('exit', function(exitCode){
            RunningThreads = Threads.filter(i => i.threadId !== -1)
            const _threadsNum = RunningThreads.length
            console.log('The remaining ' + _threadsNum +' threads are running');
            if(_threadsNum == 0){
                console.log('all queueList and threads completion， process exit!')
                process.exit();
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
        T = setInterval(function(){
            if(size() && RunningThreads){
                Threads.map(is => {
                    is.postMessage('向子线程发送数据');
                })
            }else{
                if(!RunningThreads) throw 'process_child num is null';
                if(!size()) console.log('queueList is null');
                setTimeout(()=>{
                    is.postMessage({
                        type: 'exit'
                    });
                },20000)
            }
        }, config.intetval);
        addListQueueMap(config.firstTask)
    }
}