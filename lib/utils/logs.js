const fs = require('fs');
const signale = require('signale');
const { Signale } = require('signale');
const Time = new Date().toLocaleDateString().replace(/\//g, '-');
// const stripAnsiStream = require('strip-ansi-stream');
signale.config({
  coloredInterpolation: true
});
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