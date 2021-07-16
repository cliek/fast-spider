const { Signale } = require('signale');

const options = {
    stream: process.stdout,
    scope: 'custom',
    types: {
        error: {
          badge: '!!',
          label: 'fatal error'
        },
        success: {
          badge: '++',
          label: 'huge success'
        }
    }
}

export default new Signale(options);
