import Thread from "./thread";
import * as readline from "readline";
import { DataType } from "../queue";
import * as EventEmitter from "events";

declare type allThreadsType = {
    [k:string]: Thread
}

declare type ResultType = {
    nextName: string,
    data: DataType
}

export declare type ReturnResType = {
    threadId: string,
    type: string,
    result: ResultType
}

class Pool {
    protected poolSize: number;
    protected workerPath: string;
    protected workerData: object | string;
    public allThreads: allThreadsType;
    public events: EventEmitter;

    constructor(size: number, workerPath: string, workerData?: object | string){
        this.allThreads = {};
        this.poolSize = size;
        this.workerPath = workerPath;
        this.workerData = workerData;
        this.events = new EventEmitter();
        this.startMultipleThread();
    }

    startMultipleThread(): this {
        for (let index = 0; index < this.poolSize; index++) {
            const _worker = new Thread(this.workerPath,{
                workerData: this.workerData
            });
            this.allThreads[String(_worker.threadId)] = _worker;
            _worker.worker.on("message",(res: ReturnResType) => {
                const { type } = res;
                if(type === 'done'){
                    _worker.setState("IDLE");
                }else if(type === 'error'){
                    _worker.setState("IDLE");
                }
                this.events.emit('message',{ threadId: _worker.threadId, ...res});
            });
            _worker.worker.on("exit",(exitCode: number) => {
                if(exitCode === 0){
                    this.poolSize --;
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`Thread exits with ${ this.poolSize } remaining!\n`);
                }else {
                    throw new Error( _worker.worker.threadId + "process exit error");
                }
            })
        }
        return this;
    }

    findAvailableThread():string | boolean {
        for (const key in this.allThreads) {
            if(this.allThreads[key].state === 'IDLE'){
                return key;
            }
        }
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('allThread is busy!\n');
        return false;
    }

    exec(treadId: string, task: object){
        this.allThreads[treadId].run(task);
    }

    destroy(){
        for (const key in this.allThreads) {
            this.allThreads[key].worker.postMessage({
                type: "exit"
            })
        }
    }

}

export default Pool;