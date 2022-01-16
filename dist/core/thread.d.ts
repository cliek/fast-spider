/// <reference types="node" />
import { Worker, WorkerOptions } from 'worker_threads';
declare class Thread {
    readonly threadId: number;
    state: String;
    worker: Worker;
    constructor(filePath: string, WorkerOptions?: WorkerOptions);
    setState(state: String): void;
    run(task: object): void;
}
export default Thread;
//# sourceMappingURL=thread.d.ts.map