import signale from 'signale'

const { Signale } = signale;

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

export default new Signale(options);
