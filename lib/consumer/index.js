import T from '../task'
import { addQM, popQM, removeQM, sizeQM } from "../queue"

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
            this.syncNext();
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
        if(typeof a !== 'object') throw Error ("sync mode next params type object required!");
        return new Promise((resolve, reject) => {
            addQM(+new Date(), {
                taskName: t,
                ...a
            });
        })
    }

    syncNext(){
        this.intervaltor = setInterval(() => {
            if(sizeQM() == 0){
                console.info('current queue is empty,after 60s process exit;');
                this.timeouttor = setTimeout(()=>{
                    if(this.intervaltor) clearInterval(this.intervaltor);
                    process.exit(1);
                }, 60000)
            }else{
                if(this.timeouttor) clearTimeout(this.timeouttor);
                const { taskName, ...arg } = popQM().data;
                this.tasks[taskName](this.syncMode.bind(this), arg);
            }
        }, this.defultOption.interval);
    }
}

export default new Consumer();