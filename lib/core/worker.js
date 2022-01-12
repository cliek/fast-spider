const { ThreadWorker } = require('poolifier');
// const { join } = require('path');
// const taskPath = join(process.cwd(), './tasks');
// require('../../examples/tasks/index')
// const allTasks = fs.readdirSync(taskPath).map(file => require(join(taskPath, file)));
// const t = require(join(taskPath, 'index'));

function myFunction (data) {
    // console.log(t);
    return { ok: 1, data: {data} }
}

exports.modules = new ThreadWorker(myFunction, { maxInactiveTime: 30000, async: true });