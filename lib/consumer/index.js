import { v1 as uuidv1 } from "uuid"
import T from '../task'
import { addQM, popQM, removeQM, sizeQM } from "../queue"
import { Cluster } from "../utils/cluster"
class Consumer {
    
    constructor (){
        this.timeouttor = null;
        this.intervaltor = null;
        this.defultOption = {};
        this.tasks = T.getTasks();
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
            this.syncMode(taskName,arg || {});
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
        Cluster({
            number: this.defultOption.cluster
        },this.syncNext.bind(this))
    }

    syncNext(t, a){
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

    syncInterval(){
        this.intervaltor = setInterval(() => {
            if(sizeQM() == 0){
                console.info('current queue is empty,after 5s process exit;');
                if(!this.timeouttor){
                    this.timeouttor = setTimeout(()=>{
                        if(this.intervaltor) clearInterval(this.intervaltor);
                        process.exit(1);
                    }, 5000);
                }
            }else{
                if(this.timeouttor) clearTimeout(this.timeouttor);
                const { data }  = popQM();
                if(data){
                    const { taskName, ...arg } = data;
                    if(taskName) {
                        if(!taskName || !this.tasks[taskName]) throw Error ("tasks["+ taskName +"] Not Found!");
                        this.tasks[taskName](this.syncNext.bind(this), arg);
                    }else{
                        console.error('taskName is null');
                    }
                }else{
                    console.error('data is null');
                }
            }
        }, this.defultOption.interval);
    }
}

export default new Consumer();