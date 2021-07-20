const cluster = require('cluster');
const OS = require("os");
const { v1:uuidv1 } = require("uuid")
const { addQM, popQM, sizeQM  } = require("../queue/index")
const path = require("path");
const config = require(path.resolve(process.cwd(),"config.js")).default;
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
	let T = null;
	numCPUs =  typeof config.clusterNum == 'number' ? config.clusterNum : typeof config.clusterNum == 'boolean'? config.clusterNum ? numCPUs : 1 : 1;

	for (let index = 0; index < numCPUs; index++) {
		masters[index] = cluster.fork();
	}

	const fristTasksStart = () => {
		T = setInterval(() => {
			let maxS = Object.keys(cluster.workers).length
			masters = masters.filter(is => is.state == "online");
			if(maxS && sizeQM()){
				const { data } = popQM();
				masters[rollIndex % maxS].send({type: 'task', data});
			}else{
				if(!masters.length) console.error('children_process all killed！')
				if(!sizeQM()) console.error('queueList is empty!')
				masters[rollIndex % maxS].send({type: 'exit'});
			}
			rollIndex ++
		}, 3000);
		addListQueueMap(config.startTask)
	}

	const addListQueueMap = (obj) => {
		if(typeof obj !== 'object') throw Error ("sync mode next params type object required!");
		if(Object.hasOwnProperty('id')){
			const { id , ...arg}  = obj;
			addQM(id,arg);
		}else{
			addQM(uuidv1(), obj);
		}
	}
	fristTasksStart()
	cluster.on('message', (worker, message, handle) => {
		console.log(message , worker.process.pid );
		switch(message.type){
			case "add":
				addListQueueMap(message.data)
				break;
			case "exit":
				process.exit(0);
				break;
			default:
				console.log(data)
				break;  
		}
	});

	cluster.on('exit', (worker, code, signal) => {
		console.log(`child process exited with code ${worker.process.pid}`);
		killNum++
		if(killNum == numCPUs){
			clearInterval(T);
			rollIndex = 0;
			console.info('all child process dropped out, master quit');
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