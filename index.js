import qm from './lib/queue/index'
// import './config'
// import { addTask, removeTask } from './lib/task'
qm.size()
// export default {
//     addTask,
//     removeTask
// }
for(let i = 1; i< 1000000; i ++){
    qm.add(String(i), i);
    if(i % 20 == 0){
        qm.pop(String(i));
    }
}
console.log();
