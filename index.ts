import { DynamicThreadPool, ThreadWorker } from 'poolifier';

function myFunction (data: any) {
    // console.log(t);
    return { ok: 1, data: {data} }
}

const Thread = new ThreadWorker(myFunction, { maxInactiveTime: 30000, async: true });

export default Thread