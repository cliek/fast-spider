import cluster from "cluster";
import OS from "os";
let numCPUs = OS.cpus().length;

export const Cluster = function(config, fn) {
	const Config = Object.assign({
		number: true
	}, config)
	// 判断是否是主进程
	if (cluster.isMaster) {
		numCPUs =  typeof Config.number == 'number' ? Config.number : typeof Config.number == 'boolean'? numCPUs : 1;
		for (let i = 0; i < numCPUs; i++) {
			// 启动子进程
			cluster.fork();
		}
		// 当任何一个工作进程关闭的时候，cluster 模块都将会触发 'exit' 事件
		cluster.on("exit", function (worker, code, signal) {
			console.log("进程" + worker.process.pid + "结束");
		});
		
		// 当主进程收到信息时，执行一些操作，这里是主进程收到子进程消息便将子进程关闭
		cluster.on("message", function (worker, message, handle) {
			worker.kill();
		});
	} else {
		fn()
		// 监听主进程发来的变量信息，并执行相关操作
		process.on("message", (msg) => {
			// 做些什么
			// 子进程中，发送消息给主进程
			process.send({ data: "结束" });
		});
	}
}

