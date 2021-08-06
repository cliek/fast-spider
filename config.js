module.exports = {
    // spider mode || 'async' | 'flow'
    mode: 'async', 
    // 当前分发给子线程任务的频率
    interval: 1000,
    // 自定义task文件路径，默认是项目根目录下task目录
    // taskPath: 'task/index',
    // 自定义链表路径，如果需要自己实现链表，请指定该路径，否则请忽略
    // queuePath: '',
    // 使用子线程个数，不指定或者false默认1个线程，如果为true则根据当前计算机自动计算
    ThreadsNum: 3,
    // 定时执行，如果为false或不指定将立即执行，如果需要定时执行请参考 https://github.com/node-schedule/node-schedule 中配置即可
    // schedule: false,
    // 公共函数注入，在回调函数中modules.plugins.XXX 使用
    plugins: [],
    // 第三方或自定义模块注入，在回调函数中modules.XXX 使用
    modules: [],
    // 文件写入配置，enabled为false为关闭，true为开启，可配置当前文件生成目录、文件名、文件类型（csv|json）等
    pipe: {
        enabled: true,
        type: 'json',
        dirPath: 'data',
        fileName: ''
    }
}