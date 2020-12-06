const {
    GameEngine,
    GAME_EVENTS_NAMES,
    NEED_TO_PLAY_AGAIN_ANSWERS,
} = require('../../modules/game-engine');
const { COMMANDS_NAMES } = require('../../constants');
const { readlineInterface } = require('../../utils');
const {
    createErrorEventHandler,
    createLostEventHandler,
    createWinEventHandler,
} = require('./start-utils');

const command = COMMANDS_NAMES.START;
const describe = 'Input you\'re profile filename and start the game';
const handler = ({ name: fileName }) => {
    if (!fileName) {
        throw new Error('Argument "name" is required');
    }
    const gameEngine = new GameEngine();
    process.stdout.write(gameEngine.greetingMessage);

    gameEngine.on(GAME_EVENTS_NAMES.WIN, createWinEventHandler(fileName));

    gameEngine.on(GAME_EVENTS_NAMES.LOST, createLostEventHandler(fileName));

    gameEngine.on(GAME_EVENTS_NAMES.ERROR, createErrorEventHandler(fileName));

    readlineInterface.on('line', inputedValue => {
        if (gameEngine.gameIsStopped) {
            switch(inputedValue.toLocaleLowerCase()) {
                case NEED_TO_PLAY_AGAIN_ANSWERS.YES.toLowerCase(): {
                    gameEngine.toggleGameIsStopped(false);
                    process.stdout.write(gameEngine.inputMessage);
                    break;
                }
                case NEED_TO_PLAY_AGAIN_ANSWERS.NO.toLowerCase(): {
                    process.exit(0);
                    break;
                }
                default: {
                    process.stdout.write(gameEngine.needToPlayAgainMessage);
                    break;
                }
            }
        } else {
            gameEngine.play(inputedValue);
            process.stdout.write(gameEngine.needToPlayAgainMessage);
        }
    });
};

module.exports = {
    [command]: {
        command,
        describe,
        handler,
    },
};