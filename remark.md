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
```
### 简单示例
`/* task/index.js */`
```
const Task = require('../../lib/task');
const T = new Task();
T.addTask("A", function({requst, cheerio }, next){
    requst.get('http://www.baidu.com').end((err, res)=>{
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

T.addTask("B", function({params}, next){
    next(params)
});

module.exports = T;
```