import Tasks, { TaskType } from '../task';
declare class Spider {
    _pool: any;
    _task: TaskType;
    constructor(size: number);
    addTask(tasks: Tasks): this;
    runTask(taskName: string, params?: object): void;
    nextTask(): void;
    exit(): void;
}
export default Spider;
//# sourceMappingURL=index.d.ts.map