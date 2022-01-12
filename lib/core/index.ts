import { DynamicPool } from 'node-worker-threads-pool';
// import { join } from 'path';
// const workksPath = join(__dirname, './worker.js');
const Pool = new DynamicPool(4);
Pool.exec({
    task: (n)=>(n+2),
    param: 2
}).then(res => {
    console.log(res)
})
export default Pool;
