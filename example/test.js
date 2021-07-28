import Comsumer from '../lib/core'

const C = new Comsumer({
    ThreadsNum: 1,
    interval: 100,
    taskPath: 'example/task/index'
});

C.start({
    taskName: "A",
    num: 10
});