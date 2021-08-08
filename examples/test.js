const { Spider } = require('../lib/index');

const spider = new Spider({
    ThreadsNum: 2,
    interval: 500,
    taskPath: 'task/index',
    queuePath: 'modules/redisQueue',
    // schedule: '*/15 * * * * *',
    pipe: {
        enabled: true,
        type: 'json',
        dirPath: 'file'
    }
});

spider.start({
    taskName: "A",
    num: 10
});