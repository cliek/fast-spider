import Comsumer from '../lib/core'

const C = new Comsumer({
    ThreadsNum: 1,
    interval: 100,
    taskPath: 'example/task/index',
    pipe: {
        disabled: false,
        type: 'json',
        dirPath: 'example/file'
    }
});

C.start({
    taskName: "A",
    num: 10
});