const { Signale } = require('signale');

const options = {
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

modules.export = new Signale(options);
