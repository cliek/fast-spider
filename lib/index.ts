import Task from './task';
import Queue from './queue';
import Pool from './core';
Task.addTask('aa', ()=> {});
Queue.addQueue('aa', {a:1})
Pool.execute({a:'test', task: Queue.getQueue()}).then(res => {
    console.log(res);
})
export {
    Task,
    Queue,
    Pool
}
