/// <reference types="node" />
import Pool from "./pool";
import LinkQueueMap from '../queue';
import * as EventEmitter from 'events';
declare class Spider {
    _pool: Pool;
    protected _fristTask: boolean;
    _roll: NodeJS.Timer | null;
    _mq: LinkQueueMap;
    readonly events: EventEmitter;
    constructor(size: number, taskPath: string);
    runTask(taskName: string, data?: object): this;
    nextTask(): void;
    rollTask(): void;
    exit(): void;
}
export default Spider;
//# sourceMappingURL=index.d.ts.map