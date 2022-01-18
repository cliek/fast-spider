/// <reference types="node" />
import Pool from "./pool";
import LinkQueueMap from '../queue';
import * as EventEmitter from 'events';
declare type SpiderOptions = {
    isExit: boolean;
};
declare class Spider {
    readonly _pool: Pool;
    protected _fristTask: boolean;
    protected _thread_num: number;
    protected _roll: NodeJS.Timer | null;
    protected _roll_next: NodeJS.Timer | null;
    protected _option: SpiderOptions | null;
    _mq: LinkQueueMap;
    readonly events: EventEmitter;
    constructor(thread_num: number, taskPath: string, opt?: SpiderOptions);
    runTask(taskName: string, data?: object): this;
    nextTask(): void;
    rollTask(): void;
    exit(): void;
}
export default Spider;
//# sourceMappingURL=index.d.ts.map