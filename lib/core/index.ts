import Pool from "./pool";
import LinkQueueMap from '../queue';
import { resolve } from 'path';
import * as EventEmitter from 'events';
import * as os from 'os';

const CPUCoreNumbers = os.cpus().length;

declare type SpiderOptions = {
    isExit: boolean
}

class Spider {
    readonly _pool: Pool;
    protected _fristTask: boolean;
    protected _thread_num: number;
    protected _roll: NodeJS.Timer | null = null;
    protected _roll_next: NodeJS.Timer | null = null;
    protected _option: SpiderOptions | null;
    public _mq: LinkQueueMap;
    readonly events: EventEmitter;

    constructor(thread_num: number, taskPath: string, opt?: SpiderOptions) {
        this._mq = new LinkQueueMap();
        this._thread_num = !isNaN(thread_num) ? thread_num <= 0 ? CPUCoreNumbers : thread_num : CPUCoreNumbers;
        this._option = {
            isExit: true,
            ...opt
        };
        this.events = new EventEmitter();
        this._fristTask = true;
        this._pool = new Pool(this._thread_num, resolve(__dirname, 'worker.js'),{
            taskPath
        });
        this._pool.events.on('message', (res: any) => {
            const { type, result, nextTaskName } = res;
            switch(type){
                case 'queue':
                    this._mq.addQueue({
                        nextName: nextTaskName,
                        params: result
                    });
                    this.events.emit('next', result);
                    if(this._fristTask){ 
                        this.rollTask();
                        this._fristTask = false;
                    }
                    break;
                case 'done':
                    this.events.emit('data', res);
                    if(this._fristTask && this._option.isExit){
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
                if(this._roll_next) clearTimeout(this._roll_next);
            }else if (this._option?.isExit){
                if(!this._roll_next){
                    console.log('queueList is empty！');
                    this._roll_next = setTimeout(() => {
                        clearInterval(this._roll);
                        this.exit();
                    }, 5000);
                }
            }
        }
    }

    rollTask() {
        this._roll = setInterval(this.nextTask.bind(this), 300);
    }

    exit():void {
        this._pool.destroy();
        this.events.emit('exit');
    }

}

export default Spider;
