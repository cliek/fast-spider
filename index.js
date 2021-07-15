import { sizeQM } from './lib/queue'
import { addTask } from './lib/task'
import C from './lib/consumer'
// import './config'
// import { addTask, removeTask } from './lib/task'
// qm.size()
// export default {
//     addTask,
//     removeTask
// }

// example qm
// console.time('qm')
// for(let i = 1; i< 2000000; i ++){
//     qm.add(String(i), i);
//     if(i % 20 == 0){
//         qm.pop(String(i));
//     }
// }
// console.timeEnd('qm');

// example flow Tasks
// addTask('A', function(next, arg){
//     console.log("A", arg)
//     next('B', arg+8)
// })

// addTask('B', async function(next, arg){
//     console.log("B", arg)
//     for (let index = 0; index < new Array(arg).fill('x').length; index++) {
//         const r = await next('C', arg - index);
//         console.log(index)
//     }
// })

// addTask('C', function(next, arg){
//     return new Promise((resolve, reject) =>{
//         setTimeout(() => {
//             console.log("C", arg)
//             resolve(true)
//         }, arg);
//     })
//     // next()
// })

// C.start('A',1);

// example sync Tasks
addTask('A', function(next, arg){
    new Array(arg.num).fill('x').map((s,i)=>{
        next('B', {
            num: i+1
        })
    })
    console.log(sizeQM());
})

addTask('B', function(next, arg){
    console.log("b", arg)
})

addTask('C', function(next, arg){
    
})

C.config({
    interval: 3000,
    mode: "sync"
}).start('A',{
    num: 10
});