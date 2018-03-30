import * as A from './action-types';
import * as M from './mutation-types';

import * as openTriviaHelper from '../common/open-trivia-helper';

export default {
    [A.LOAD_QUIZ]({ commit, state }) {
        return new Promise((resolve, reject) => {
            openTriviaHelper.getQuestions(state)
                .then(({ err, questions }) => {
                    if (err) {
                        return reject(err);
                    }
                    commit(M.RESET_CURRENT_QUESTION);
                    commit(M.RESET_RECENT_SCORE);
                    commit(M.SET_QUESTIONS, { questions });
                    return resolve();
                });
        });
    },
};
