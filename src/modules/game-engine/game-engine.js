const EventEmmiter = require('events');
const { getRandomItem } = require('../../utils');
const {
    GAME_EVENTS_NAMES,
    NEED_TO_PLAY_AGAIN_ANSWERS,
    POSSABLY_VALUES,
} = require('./game-engine-constants');

class GameEngine extends EventEmmiter {
    constructor() {
        super();
        this.gameIsStopped = false;
    }

    get greetingMessage() {
        return `Game is started! ${this.inputMessage}`;
    }

    get inputMessage() {
        return `Input one of the values: ${POSSABLY_VALUES.join(', ')}\n`;
    }

    get needToPlayAgainMessage() {
        return `Need to play again? [${NEED_TO_PLAY_AGAIN_ANSWERS.YES}/${NEED_TO_PLAY_AGAIN_ANSWERS.NO}]\n`;
    }

    toggleGameIsStopped(newState) {
        this.gameIsStopped = newState === undefined
        ? !this.gameIsStopped
        : newState;
    }

    play(inputedValue) {
        const formattedValue = Number(inputedValue);
        const secretValue = getRandomItem(POSSABLY_VALUES);

        if (!isFinite(formattedValue)) {
            this.emit(GAME_EVENTS_NAMES.ERROR, inputedValue);

        } else if (formattedValue === secretValue) {
            this.emit(GAME_EVENTS_NAMES.WIN, formattedValue, secretValue);

        } else {
            this.emit(GAME_EVENTS_NAMES.LOST, formattedValue, secretValue);
        }

        this.toggleGameIsStopped(true);
    }
}

module.exports = {
    GameEngine,
};