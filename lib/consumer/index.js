import { v1 as uuidv1 } from "uuid"
import T from '../task'
import { addQM, getQM, popQM, removeQM, sizeQM } from "../queue"
import { Cluster } from "../utils/cluster"
import logs from "../utils/logs";

class Consumer {
    
    constructor (){
        this.timeouttor = null;
        this.intervaltor = null;
        this.defultOption = {};
        this.tasks = T.getTasks();
        this.cluster = null;
    }

    config(cfg){
        this.defultOption = Object.assign({
            mode: 'flow',
            interval: 1000,
            cluster: true
        },cfg)
        return this;
    }

    start(taskName, arg){
        if(!Object.keys(this.tasks).length) throw Error ("tasks is not empty!");
        if(this.defultOption.mode === 'flow'){
            this.flowMode(taskName,arg)
        }else if(this.defultOption.mode === 'sync'){
            if(!arg || typeof arg !== 'object') throw Error ("sync mode next params type object required!");
            this.syncMode(taskName, arg || {});
            console.log(sizeQM() , '123')
            this.clusterProcess();
            console.log('sssaqs')
        }
    }

    flowMode(t, a){
        if(!this.tasks[t]) throw Error ("tasks["+ t +"] Not Found!");
        return new Promise((resolve, reject) => {
            resolve(this.tasks[t](this.flowNext.bind(this),a));
        })
    }

    flowNext(t, a){
        if(!t || !this.tasks[t]) throw Error ("tasks["+ t +"] Not Found!");
        return new Promise((resolve, reject) => {
            resolve(this.flowMode(t, a))
        })
    }

    syncMode(t, a){
        if(!t || !this.tasks[t]) throw Error ("tasks["+ t +"] Not Found!");
        this.addListQueueMap(Object.assign(a, {
            taskName: t
        }));
    }

    addListQueueMap(obj){
        if(typeof obj !== 'object') throw Error ("sync mode next params type object required!");
        if(Object.hasOwnProperty('id')){
            const { id , ...arg}  = obj;
            addQM(id,arg);
        }else{
            addQM(uuidv1(), obj);
        }
    }

    clusterProcess(){
        Cluster({
            number: this.defultOption.cluster
        },
            // 主进程执行函数
            this.syncInterval.bind(this),
            // 子进程处理的函数
            this.childrenProcess.bind(this)
        )
    }

    syncInterval(W, C){
        this.intervaltor = setInterval(() => {
            if(sizeQM() == 0){
                console.info('current queue is empty,after 5s process exit;');
                // W.send({
                //     type: "done"
                // })
            }else{
                if(this.timeouttor) clearTimeout(this.timeouttor);
                const { data }  = popQM();
                console.log(sizeQM())
                if(data){
                    // W.send({
                    //     type: "message",
                    //     data: data
                    // });
                }else{
                    console.error('data is null');
                }
            }
        }, this.defultOption.interval);
        C.on("message", function (worker, message, handle) {
			switch(message.type){
				case 'add':
					this.addListQueueMap(message.data)
					break;
				case 'exit':
					worker.kill();
					break;
				default:
					logs.log(message)
			}
		});
    }

    childrenProcess(data, children_process) {
        const { taskName, ...arg } = data;
        if(taskName) {
            if(!taskName || !this.tasks[taskName]) throw Error ("tasks["+ taskName +"] Not Found!");
            this.tasks[taskName]((t, a)=>{
                children_process.send({
                    type: "add",
                    data: Object.assign(a, { "taskName": t })
                })
            }, arg);
        }else{
            console.error('taskName is null');
        }
    }
}

export default new Consumer();