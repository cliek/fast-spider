import { DynamicThreadPool } from 'poolifier';
import { join } from 'path';

const Pool = new DynamicThreadPool(1, 10, join(__dirname, './worker.js'), {
    errorHandler: (e) => {
        debugger
        console.error(e);
    },
    onlineHandler: () => {
        console.log('worker is online');
    }
});

export default Pool;

// 动态线程上限事件
// Pool.emitter.on('FullPool', ()=>{
//     console.log('Pool is To achieve the maximum!')
// })