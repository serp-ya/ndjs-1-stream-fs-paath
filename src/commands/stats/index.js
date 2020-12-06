const path = require('path');
const { checkLogFileExist, createLogFilenameWithExtension } = require('../../utils');
const {
    COMMANDS_NAMES,
    LOGS_DIR_PATH,
} = require('../../constants');
const { getLogFileStatistics, prepareStatisticsToShow } = require('./stats-utils');

const command = COMMANDS_NAMES.STATS;
const describe = 'Get game statsics by filename';
const handler = async ({ name: fileName }) => {
    if (!fileName) {
        throw new Error('Argument "name" is required');
    }
    const fileNameWithExtention = createLogFilenameWithExtension(fileName);
    const logFileIsExist = await checkLogFileExist(fileNameWithExtention);

    if (!logFileIsExist) {
        process.stdout.write(`File with name ${fileName} does\'t exist`);
        process.exit(1);
        return;
    }

    const filePath = path.join(LOGS_DIR_PATH, fileNameWithExtention);
    const logFileStatistics = await getLogFileStatistics(filePath);
    const formattedLogFileStatistics = prepareStatisticsToShow(logFileStatistics);

    process.stdout.write(formattedLogFileStatistics)
    process.exit(0);
};

module.exports = {
    [command]: {
        command,
        describe,
        handler,
    },
};