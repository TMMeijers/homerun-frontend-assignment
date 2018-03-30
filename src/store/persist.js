import VuexPersist from 'vuex-persist';

/**
 * Mock a (local) DB by storing values we want to persist in LS.
 */
export default new VuexPersist({
    key: 'vuex',
    strictMode: process.env.NODE_ENV !== 'production',
    storage: window.localStorage,
    reducer: (state) => {
        return {
            playerName: state.playerName,
            difficulty: state.difficulty,
            scores: state.scores,
        };
    },
});

