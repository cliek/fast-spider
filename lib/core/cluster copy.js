import cluster from 'cluster';
import OS from "os";
import logs from "../utils/logs";
let numCPUs = OS.cpus().length;
let killNum = 0;
let rollIndex = 0;

cluster.setupPrimary({
	exec: 'children.js',
	cwd: __dirname,
	// silent: true
});

if (cluster.isPrimary) {
	let masters = [];
	numCPUs =  2

	for (let index = 0; index < numCPUs; index++) {
		masters[index] = cluster.fork();
	}

	const T = setInterval(() => {
		let maxS = Object.keys(cluster.workers).length
		masters = masters.filter(is => is.state == "online");
		if(maxS){
			masters[rollIndex % maxS].send({type: 'exit'});
		}else{
			clearInterval(T);
			rollIndex = 0;
		}
		rollIndex ++
	}, 3000);

	cluster.on('message', (worker, message, handle) => {
		console.log(message , worker.process.pid );
		// worker.kill();
	});

	cluster.on('exit', (worker, code, signal) => {
		console.log(`child process exited with code ${worker.process.pid}`);
		killNum++
		if(killNum == numCPUs){
			clearInterval(T);
			logs.success('all child process dropped out, master quit');
			process.exit();
		}
	});


	// for (const id in cluster.workers) {
	// 	cluster.workers[id].on('message', (message) => {
	// 		console.log(message);
	// 		switch(message.type){
	// 			case 'exit':
	// 				// cluster.workers.kill();
	// 				break;
	// 		}
	// 	});

	// 	cluster.workers[id].on('exit', (worker, code, signal) => {
	// 		console.log(`child process exited with code ${worker}`);
	// 		killNum++
	// 		if(killNum == numCPUs){
	// 			logs.success('all child process dropped out, master quit');
	// 			process.exit();
	// 		}
	// 	});

	// 	cluster.workers[id].on('error', (err) => {
	// 		// 如果控制器中止，则这将在 err 为 AbortError 的情况下被调用
	// 	});
	// }

} else {
	process.on('message', (data)=> {
		console.log(data);
		process.send({
			type: "exit"
		})
		process.exit(0);
		// process.kill();
		// setTimeout(()=>{
		//     process.kill(process.pid);
		//     // process.exit();
		// },5000)
	})
	process.on('error', (msg) => {
		console.log(msg);
	});
}