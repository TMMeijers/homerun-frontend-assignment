import * as M from './mutation-types';

function constructScore(score, state) {
    return {
        score,
        playerName: state.playerName,
        difficulty: state.difficulty,
        timestamp: Date.now(),
    };
}

function getNewSortedScores(scores, newScore) {
    // If less than max highscores just push it
    if (scores.length < 25) {
        return scores.concat(newScore).sort((a, b) => a.score < b.score);
    }

    // If new score is a high score add, sort and throw away lowest
    if (scores.find(s => s.score < newScore.score)) {
        return scores.concat(newScore).sort((a, b) => a.score < b.score).slice(0, 25);
    }
    return scores;
}

export default {
    [M.SET_DIFFICULTY]: (state, { difficulty }) => {
        state.difficulty = difficulty;
    },
    [M.SET_PLAYER_NAME]: (state, { playerName }) => {
        state.playerName = playerName;
    },
    [M.SET_QUESTIONS]: (state, { questions }) => {
        state.questions = questions;
    },
    [M.RESET_CURRENT_QUESTION]: (state) => {
        state.currentQuestion = -1;
    },
    [M.INCREMENT_CURRENT_QUESTION]: (state) => {
        state.currentQuestion += 1;
    },
    [M.SUBMIT_SCORE]: (state, { score }) => {
        const newScore = constructScore(score, state);
        state.currentQuestion = -1;
        state.questions = [];
        state.recentScore = newScore;
        state.scores = getNewSortedScores(state.scores, newScore);
    },
    [M.RESET_RECENT_SCORE]: (state) => {
        state.recentScore = null;
    },
};
