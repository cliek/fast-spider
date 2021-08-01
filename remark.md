### 一款基于node的多线程爬虫工具，只需要简单配置即可使用，内置集成了superagent，cheerio以及可自定义注入module模块，结果数据可生成csv、json等文件。
-----------------

+ 可配置的task任务，即使生产者也是消费者
+ 基于node多线程实现异步处理task任务
+ 内置superagent、cheerio，可自定义集成或替换内置工具
+ 内置实现QueueList链表，可以自定义集成redis、mongodb等工具
+ 集成定时执行
+ 集成日志系统
+ 可输出结果csv json文件

[![Wv1Buj.png](https://z3.ax1x.com/2021/07/31/Wv1Buj.png)](#)

## 快速开始

### 安装

使用npm进行安装
```
npm install XXX --save
```
使用yarn进行安装
```
yarn add XXX
```

### 目录结构
请手动创建文件夹，如下：
```
|-- task
    |-- index.js
|-- index.js
|-- modules (可选)
|-- plugin (可选)
|-- config.js (可选)
```
### 简单示例
#### 数字接力 (了解任务数据传递)
```
/* task/index.js */
const { Task } = require('fast-spider');
const task = new Task();
task.addTask("A", function({ params }, next){
    let num = params.num || 1;
    next("B", {
        num
    })
});
task.addTask("B", function({ params }, next){
    let num = params.num + 1
    next("C", {
        num
    })
});
task.addTask("C", function({ params }, next){
    let num = params.num + 1
    next("D", {
        num
    })
});
task.addTask("D", function({ params }, next){
    let num = params.num + 1
    next("E", {
        num
    })
});
task.addTask("E", function({ params }, next){
    console.log(params.num)
});
// 一定要导出,这一步非常重要
module.exports = task;

/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider();
/* 指定执行第一个任务'A' */
spider.start({
    taskName: "A"
});
// 不传递参数情况下，任务'E'中输入
// result E --> 4
/* 指定执行第一个任务'A', 并传递参数num:10 */
spider.start({
    taskName: "A",
    num: 10
});
// 传参情况下，num默认是从10开始累加传递
// result E --> 13
```
#### 通过request获取网页示例
```
/* task/index.js */
const { Task } = require('fast-spider');
const task = new Task();
task.addTask("A", function({ request, cheerio }, next){
    request.get('http://www.baidu.com').end((err, res)=>{
        if (res.ok) {
            let $ = cheerio.load(res.text)
            next("B", {
                title: $('title').text()
            })
        } else {
            console.log('Oh no! error ' + res.text);
        }
    })
});

task.addTask("B", function({ params }, next){
    console.log(params.title);
});
// 导出task这步非常关键
module.exports = task;

/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider();
/* 指定执行第一个任务 'A' */
spider.start({
    taskName: "A"
});
// result --> 百度一下，你就知道！
```

### Task模块-新建任务  
#### addTaks(_taskName, callback)
_taskName: String

任务名称,用于命名每个任务名称（如示例中用"A","B","C"）

callback: Function
回调函数，用于当前任务需要执行的逻辑块

callback(modules, next) 回调方法可用参数（这里是重点）

modules: Function || Object

参数 `params`: 用于任务之间传递参数 

内置模块 `modules`

`superagent`: 一个轻量的Ajax API，服务器端（Node.js）客户端（浏览器端）均可使用,SuperAgent具有学习曲线低、使用简单、可读性好的特点。

重要说明：内置集成时仅仅名称修改为 `request` 便于使用者的可读性，并不是使用的node自带模块`requuse`模块，使用方法与`superagent`API一致。

`cheerio`： 为服务器特别定制的，快速、灵活、实施的jQuery核心实现获取html节点工具

#### 关于modules
当前可通过config导入自定义模块，比如用户需要使用到readis、mysql、MongoDB等工具均可扩展，且极其简单，具体自定义模块可[点击这里](#自定义module模块)查看示例


next: IArguments

next(taskName: String, params?: Object, isWrite?: Boolean)

`taskName` 需要执行的下一个任务名

`params` 传递给下一个任务是携带的参数

`isWrite` 当前数据是否需要写入到文件，如果为 `true`, 则需要保证params值有效，同时传递给下一个任务作为参数，并同时写入到文件中。

next(params: Object)

如果只传递一个Object类型时，默认将当前数据是写入到文件。一般来说，使用这种传参方式都是最后一个任务需要将结果写入到文件时才执行的方法，这个方法是内置的，你也可不写入到文件，直接写入到数据库也是可以的，只需要参照[点击这里](#自定义module模块)查看示例，便可以在modules中注入方法，存储到指定位置。

