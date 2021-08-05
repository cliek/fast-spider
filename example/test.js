import { Spider } from '../lib'

const spider = new Spider({
    ThreadsNum: 2,
    interval: 500,
    taskPath: 'example/task/index',
    // schedule: '*/15 * * * * *',
    pipe: {
        enabled: true,
        type: 'json',
        dirPath: 'example/file'
    }
});

spider.start({
    taskName: "doubanTop50"
});