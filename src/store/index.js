import Vue from 'vue';
import Vuex from 'vuex';

import persist from './persist';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

export const state = {
    // Persistent state
    playerName: '',
    difficulty: 'medium',
    scores: [],
    // Non persistent
    recentScore: null,
    availableDifficulties: [{
        id: 'easy',
        text: 'Easy',
    },
    {
        id: 'medium',
        text: 'Medium',
    },
    {
        id: 'hard',
        text: 'Hard',
    }],
    maxQuestions: 10,
    currentQuestion: -1,
    questions: [],
};

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
export const getters = {
    question: (state) => {
        if (state.currentQuestion === -1 || state.currentQuestion === state.maxQuestions) {
            return null;
        }
        return state.questions[state.currentQuestion];
    },

    scores: state => state.scores,

    timelimit: (state) => {
        switch (state.difficulty) {
        case 'easy':
            return 30;
        case 'medium':
            return 20;
        case 'hard':
            return 10;
        default:
            return 20;
        }
    },
};

const strict = process.env.NODE_ENV !== 'production';
// Restoring persistent state requires a mutation when in strict mode.
// Handle it here and do not expose it in the public mutation-types
const extendedMutations = strict ?
    { ...mutations, RESTORE_MUTATION: persist.RESTORE_MUTATION } :
    { ...mutations };

export default new Vuex.Store({
    state,
    getters,
    mutations: extendedMutations,
    actions,
    strict,
    plugins: [persist.plugin],
});
