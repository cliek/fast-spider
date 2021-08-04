const { logs, logLine } = require('../lib/utils/logs');

logs.note('note')

logLine.await('note')

logLine.await('note2')

logs.error('error')