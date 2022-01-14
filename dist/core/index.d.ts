/// <reference types="node" />
import LinkQueueMap from '../queue';
import * as EventEmitter from 'events';
declare class Spider {
    _pool: any;
    protected _mq: LinkQueueMap;
    readonly _events: EventEmitter;
    constructor(size: number, taskPath: string);
    runTask(taskName: string, data?: object): this;
    nextTask(): void;
    exit(): void;
}
export default Spider;
//# sourceMappingURL=index.d.ts.map