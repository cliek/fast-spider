import { StaticPool, isTimeoutError } from 'node-worker-threads-pool';
import LinkQueueMap, { DataType } from '../queue';
import { resolve } from 'path';
import * as EventEmitter from 'events';

declare type resultType = {
    nextName: string,
    data: DataType
}

declare type ReturnResType = {
    type: string,
    result: resultType
}

class Spider {

    public _pool: any;
    protected _mq: LinkQueueMap;
    readonly _events: EventEmitter;

    constructor(size: number, taskPath: string) {
        this._mq = new LinkQueueMap();
        this._pool = new StaticPool({
            size: size,
            task: resolve(__dirname, 'worker.js'),
            workerData: {
                taskPath
            }
        });
        this._events = new EventEmitter();
    }

    runTask(taskName: string, data?: object):this {
        this._pool.exec({
            taskName,
            data
        }, 60000).then((res: ReturnResType) => {
            const { type, result } = res;
            switch(type){
                case 'queue':
                    this._mq.addQueue({
                        nextName: result.nextName,
                        params: result.data
                    });
                    this._events.emit('next', result);
                    break;
                case 'done':
                    this._events.emit('data', res);
                    break;
                case 'error':
                    this._events.emit('error', res);
                    break;
            }
        }).catch((err: Error) => {
            if(isTimeoutError(err)) return this._events.emit('TimeoutError', err);
            this._events.emit('error', err);
        })
        return this;
    }

    nextTask() {
        const _params = this._mq.popQueue();
        if(_params){
            const { nextName, params } = _params.data;
            this.runTask(nextName, params);
        }else{
            this.exit();
        }
    }

    rollTask() {
        
    }

    exit():void {
        this._pool.destroy();
    }

}

export default Spider;
