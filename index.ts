import { DynamicPool } from 'node-worker-threads-pool';
const Pool = new DynamicPool(4);

export {
    Pool
}


// 动态线程上限事件
// Pool.emitter.on('FullPool', ()=>{
//     console.log('Pool is To achieve the maximum!')
// })

