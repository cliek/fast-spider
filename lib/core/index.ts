import Pool from "./pool";
import LinkQueueMap from '../queue';
import { resolve } from 'path';
import * as EventEmitter from 'events';

class Spider {
    public _pool: Pool;
    protected _fristTask: boolean;
    public _roll: NodeJS.Timer | null = null;
    public _mq: LinkQueueMap;
    readonly events: EventEmitter;

    constructor(size: number, taskPath: string) {
        this._mq = new LinkQueueMap();
        this.events = new EventEmitter();
        this._fristTask = true;
        this._pool = new Pool(size, resolve(__dirname, 'worker.js'),{
            taskPath
        });
        this._pool.events.on('message', (res: any) => {
            const { type, result } = res;
            switch(type){
                case 'queue':
                    this._mq.addQueue({
                        nextName: result.nextName,
                        params: result.data
                    });
                    this.events.emit('next', result);
                    if(this._fristTask){ 
                        this.rollTask();
                        this._fristTask = false;
                    }
                    break;
                case 'done':
                    this.events.emit('data', res);
                    if(this._fristTask){
                        this.exit();
                    }
                    break;
                case 'error':
                    this.events.emit('error', res);
                    break;
            }
        });
    }

    runTask(taskName: string, data?: object): this{
        this._pool.exec("1",{
            taskName,
            data
        })
        return this;
    }

    nextTask() {
        const tid = this._pool.findAvailableThread();
        if(typeof tid === 'string'){
            const _params = this._mq.popQueue();
            if(_params){
                const { nextName, params } = _params.data;
                this._pool.exec(tid, {taskName: nextName, data: params });
            }else{
                clearInterval(this._roll);
                this.exit();
                console.log('queueList is empty！');
            }
        }
        
    }

    rollTask() {
        this._roll = setInterval(this.nextTask.bind(this), 300);
    }

    exit():void {
        this._pool.destroy();
    }

}

export default Spider;
