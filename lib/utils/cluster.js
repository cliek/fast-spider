import cluster from "cluster";
import OS from "os";
import logs from "./logs";
let numCPUs = OS.cpus().length;
let killNum = 0;

export const Cluster = function(cfg, masterFn, processFn) {
	let Workers = null;
	let config = Object.assign({
		number: true
	}, cfg);
	// 判断是否是主进程
	if (cluster.isMaster) {
		numCPUs =  typeof config.number == 'number' ? config.number : typeof config.number == 'boolean'? config.number ? numCPUs : 1 : 1;
		for (let i = 0; i < numCPUs; i++) {
			// 启动子进程
			Workers = cluster.fork();
		}
		masterFn(Workers, cluster);
		// 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件
		cluster.on("exit", function (worker, code, signal) {
			console.log("进程" + worker.process.pid + "结束");
			killNum++
			if(killNum == numCPUs){
				logs.success('all child process dropped out, master quit');
				process.exit();
			}
		});

		// 当主进程收到信息时，执行一些操作，这里是主进程收到子进程消息便将子进程关闭
		// cluster.on("message", function (worker, message, handle) {
		// 	switch(message.type){
		// 		case 'add':
					
		// 			break;
		// 		case 'exit':
		// 			worker.kill();
		// 			break;
		// 		default:
		// 			logs.log(message)
		// 	}
		// });

	} else {
		// 监听主进程发来的变量信息，并执行相关操作
		process.on("message", (message) => {
			// 做些什么
			switch(message.type){
				case 'message':
					processFn(message.data, process)
					break;
				case 'done':
					process.send({
						type: "exit"
					})
					break;
				default:
					logs.log(message)
			}
			
			// 子进程中，发送消息给主进程
			// process.send({ data: "结束" });
		});
	}
}