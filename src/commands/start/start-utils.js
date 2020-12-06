const fs = require('fs');
const path = require('path');
const { GAME_EVENTS_NAMES } = require('../../modules/game-engine');
const { checkLogFileExist, createLogFilenameWithExtension } = require('../../utils');
const {
    LOGS_DEFAULT_EOL,
    LOGS_DIR_PATH,
    LOGS_RECORDS_HEADERS_MAP,
    LOGS_VALUES_DELIMETER,
} = require('../../constants');

const createLogRecord = ({ inputtedValue, secretValue = '', status, date = new Date().toISOString() }) => {
    const logData = { date, inputtedValue, secretValue, status };
    const mappedLogRecord = LOGS_RECORDS_HEADERS_MAP.reduce((acc, itemName) => {
        if (itemName in logData) {
            acc.push(logData[itemName]);
        }
        return acc;
    }, []);

    return `${mappedLogRecord.join(LOGS_VALUES_DELIMETER)}${LOGS_DEFAULT_EOL}`;
};

const saveLogRecord = async (logFileName, logRecord) => {
    const fileNameWithExtention = createLogFilenameWithExtension(logFileName);
    const filePath = path.join(LOGS_DIR_PATH, fileNameWithExtention);
    const logFileIsExist = await checkLogFileExist(fileNameWithExtention);

    if (!logFileIsExist) {
        fs.appendFile(filePath, `${LOGS_RECORDS_HEADERS_MAP.join(LOGS_VALUES_DELIMETER)}${LOGS_DEFAULT_EOL}`, 'UTF8', err => {
            if (err) {
                throw err;
            }
        })
    }

    fs.appendFile(filePath, logRecord, 'UTF8', err => {
        if (err) {
            throw err;
        }
    })
};

const createEventHandlerCreator = (eventName, eventCallback) => logFileName => (inputtedValue, secretValue) => {
    const logRecord = createLogRecord({ inputtedValue, secretValue, status: eventName });
    saveLogRecord(logFileName, logRecord);
    eventCallback(inputtedValue, secretValue);
};

const createWinEventHandler = createEventHandlerCreator(GAME_EVENTS_NAMES.WIN, (_, secretValue) => {
    process.stdout.write(`You are win! Correct answer is: ${secretValue}!\n`);
});

const createLostEventHandler = createEventHandlerCreator(GAME_EVENTS_NAMES.LOST, (_, secretValue) => {
    process.stdout.write(`You are lost... Correct answer is: ${secretValue}\n`);
});

const createErrorEventHandler = createEventHandlerCreator(GAME_EVENTS_NAMES.ERROR, () => {
    process.stdout.write(`Please, input correct value.\n`);
});

module.exports = {
    createErrorEventHandler,
    createLostEventHandler,
    createWinEventHandler,
};
