/// <reference types="node" />
import Thread from "./thread";
import { DataType } from "../queue";
import * as EventEmitter from "events";
declare type allThreadsType = {
    [k: string]: Thread;
};
export declare type ResultType = {
    nextName: string;
    data: DataType;
};
export declare type ReturnResType = {
    threadId: string;
    type: string;
    result: ResultType;
};
declare class Pool {
    protected poolSize: number;
    protected workerPath: string;
    protected workerData: object | string;
    allThreads: allThreadsType;
    events: EventEmitter;
    constructor(size: number, workerPath: string, workerData?: object | string);
    startMultipleThread(): this;
    findAvailableThread(): string | boolean;
    exec(treadId: string, task: object): void;
    destroy(): void;
}
export default Pool;
//# sourceMappingURL=pool.d.ts.map