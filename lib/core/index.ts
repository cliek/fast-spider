import { StaticPool, isTimeoutError } from 'node-worker-threads-pool';
import Queue from '../queue';
import Tasks, { TaskType } from '../task';
import { resolve } from 'path';
class Spider {

    public _pool: any;
    public _task: TaskType;

    constructor(size: number) {
        this._pool = new StaticPool({
            size: size,
            task: resolve(__dirname, 'worker.js')
        });
        this._pool.on('next', this.nextTask);
    }

    addTask(tasks: Tasks) {
        this._task = tasks.task;
        return this;
    }

    runTask(taskName: string, params?: object):void {
        this._pool.exec({
            param: params,
            timeout: 60000,
        }).then((res: any) => {
            if(res){
                // done
                debugger
                this._pool.emit('data', res);
            }else{
                // next
                debugger
                // addQueue
                this._pool.emit('next', res);
            }
        }).catch((err: Error) => {
            if(isTimeoutError(err)) return this._pool.emit('TimeoutError', err);
            this._pool.emit('error', err);
        })
    }

    nextTask() {
        const _params = Queue.popQueue();
        if(_params){
            const { taskName, params } = _params.data;
            this.runTask(taskName, params);
        }else{
            this.exit();
        }
    }

    exit():void {
        this._pool.destroy();
    }

}

export default Spider;
