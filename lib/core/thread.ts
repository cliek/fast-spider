import { Worker, WorkerOptions } from 'worker_threads';

class Thread {
    readonly threadId: number;
    state: String;
    worker: Worker;

    constructor(filePath: string, WorkerOptions?: WorkerOptions){
        this.worker = new Worker(filePath, WorkerOptions);
        this.threadId = this.worker.threadId;
        this.state = "IDLE";
    }

    setState(state: String) {
        this.state = state;
    }

    run(task: object) {
        this.worker.postMessage(task);
        this.state = 'BUSY';
    }

}

export default Thread;