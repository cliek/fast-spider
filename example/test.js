import { Spider } from '../lib'

const spider = new Spider({
    ThreadsNum: 1,
    interval: 100,
    taskPath: 'example/task/index',
    schedule: '0 */1 * * * *',
    pipe: {
        enabled: true,
        type: 'json',
        dirPath: 'example/file'
    }
});

spider.start({
    taskName: "A",
    num: 10
});