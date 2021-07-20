const { Signale } = require('signale');

const options = {
    stream: process.stdout,
    scope: 'custom',
    types: {
        error: {
          badge: '!!',
          label: 'error'
        },
        success: {
          badge: '++',
          label: 'success'
        }
    }
}

exports.logs = new Signale(options);
