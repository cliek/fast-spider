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

export default new Signale(options);
