const path = require('path');

const LOGS_DIR_NAME = 'logs';
const LOGS_DIR_PATH = path.resolve(__dirname, LOGS_DIR_NAME);
const LOGS_DEFAULT_EXTENSION = '.csv';
const LOGS_DEFAULT_EOL = '\n';
const LOGS_VALUES_DELIMETER = ';';
const LOGS_RECORDS_HEADERS = {
    DATE: 'date',
    INPUTTED_VALUE: 'inputtedValue',
    SECRET_VALUE: 'secretValue',
    STATUS: 'status',
};
const LOGS_RECORDS_HEADERS_MAP = [
    LOGS_RECORDS_HEADERS.STATUS,
    LOGS_RECORDS_HEADERS.INPUTTED_VALUE,
    LOGS_RECORDS_HEADERS.SECRET_VALUE,
    LOGS_RECORDS_HEADERS.DATE,
];

const COMMANDS_NAMES = {
    START: 'start',
    STATS: 'stats',
};

module.exports = {
    COMMANDS_NAMES,
    LOGS_DEFAULT_EOL,
    LOGS_DEFAULT_EXTENSION,
    LOGS_DIR_PATH,
    LOGS_RECORDS_HEADERS_MAP,
    LOGS_VALUES_DELIMETER,
};