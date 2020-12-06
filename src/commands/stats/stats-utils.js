const fs = require('fs');
const { GAME_EVENTS_NAMES } = require('../../modules/game-engine');
const {
    LOGS_DEFAULT_EOL,
    LOGS_VALUES_DELIMETER,
} = require('../../constants');
const { SIGNS_AFTER_DOT_IN_STATISTICS } = require('./stats-constants');

const getLogFileStatistics = (filePath) => (
    new Promise((done, fail) => {
        const readableStream = fs.createReadStream(filePath, 'UTF8');
    
        const logFileStatistic = {
            errorCounter: 0,
            lostCounter: 0,
            mainCounter: 0,
            winCounter: 0,
        };

        let prevChunkLastLine = null;
        
        readableStream.on('data', chunk => {
            const chunkLines = chunk.split(LOGS_DEFAULT_EOL)
            const [firstLine] = chunkLines.splice(0, 1);
            const [lastLine] = chunkLines.splice(chunkLines.length - 1, 1);
    
            const prevChunkLastLineExist = typeof prevChunkLastLine === 'string' && prevChunkLastLine.length !== 0;

            if (prevChunkLastLineExist) {
                chunkLines.push(
                    `${prevChunkLastLine}${firstLine}`,
                );
            }
    
            chunkLines.forEach(line => {
                const [status] = line.split(LOGS_VALUES_DELIMETER);
                logFileStatistic.mainCounter++;

                switch(status) {
                    case GAME_EVENTS_NAMES.WIN: {
                        logFileStatistic.winCounter++;
                        break;
                    }
                    case GAME_EVENTS_NAMES.LOST: {
                        logFileStatistic.lostCounter++;
                        break;
                    }
                    case GAME_EVENTS_NAMES.ERROR: {
                        logFileStatistic.errorCounter++;
                        break;
                    }
                }
            });
    
            prevChunkFirstLine = firstLine;
            prevChunkLastLine = lastLine;
        });

        readableStream.on('close', () => done(logFileStatistic));

        readableStream.on('error', error => fail(error));
    })
);

const prepareStatisticsToShow = (logFileStatistics) => [
    `Общее количество партий: ${logFileStatistics.mainCounter}`,
    `Кол-во побед: ${logFileStatistics.winCounter}`,
    `Кол-во проигрышей: ${logFileStatistics.lostCounter}`,
    `Кол-во ошибок: ${logFileStatistics.errorCounter}`,
    `Процент побед: ${(logFileStatistics.winCounter / logFileStatistics.mainCounter * 100).toFixed(SIGNS_AFTER_DOT_IN_STATISTICS)}%`,
    `Процент проигрышей: ${(logFileStatistics.lostCounter / logFileStatistics.mainCounter * 100).toFixed(SIGNS_AFTER_DOT_IN_STATISTICS)}%`,
    `Процент ошибок: ${(logFileStatistics.errorCounter / logFileStatistics.mainCounter * 100).toFixed(SIGNS_AFTER_DOT_IN_STATISTICS)}%`,
].join('\n');

module.exports = {
    getLogFileStatistics,
    prepareStatisticsToShow,
};