const fs = require('fs');
const { Signale } = require('signale');
const Time = new Date().toLocaleDateString().replace(/\//g, '-');
try {
  if(!fs.existsSync(path.join(process.cwd(), 'logs'))) fs.mkdirSync(path.join(process.cwd(), 'logs'))
} catch (error) {
  console.log(error)
}
const writeStream = fs.createWriteStream('logs/'+Time+'.log', {
  flags: 'a',
  encoding: 'utf8',
  autoClose: true
});
const writeStreamError = fs.createWriteStream('logs/'+Time+'-error.log', {
  flags: 'a',
  encoding: 'utf8',
  autoClose: true
});
const options = {
    types: {
        log: {
          label: 'log'
        },
        error: {
          badge: '!!',
          label: 'error',
          stream: writeStreamError
        },
        success: {
          badge: '++',
          label: 'success'
        },
        note: {
          stream: writeStream
        }
    }
}
exports.logs = new Signale(options);
exports.logLine = new Signale({interactive: true, scope: 'wait'});