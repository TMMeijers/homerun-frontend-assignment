<template>
    <div class='container'>
        <h3 class='standardMargins scoreTitle'>Highscores</h3>

        <div
            class='recentScore standardMargins'
            v-if='recentScore'
        >
            <p>
                You scored {{ recentScore.score }} on
                {{ recentScore.difficulty }} difficulty.<br>
                {{ resultText }} {{ recentScore.playerName }}!
            </p>
            <div class='buttonContainer'>
                <base-button
                    id='startButton'
                    @click='replayQuiz'
                >
                    <h3 id='playText'>Play again</h3>
                </base-button>
            </div>
            <p>or checkout the highscores</p>
        </div>

        <base-option-row
            class='sortOptions slightlyRounded standardMargins'
            v-if='scores.length > 0'
            :options='sortMethods'
            :value='sortField'
            @input='setSortField'
        />

        <div
            v-if='scores.length > 0'
            class='standardMargins'
        >
            <score-table
                :scores='sortedScores'
                :winning-timestamp='recentScore ? recentScore.timestamp : null'
            />
        </div>
        <h4 v-else>No scores yet, go play! =(</h4>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { LOAD_QUIZ } from '../../store/action-types';

import BaseOptionRow from '../shared-components/BaseOptionRow';
import BaseButton from '../shared-components/BaseButton';
import ScoreTable from './ScoreTable';

import { difficultySort, alphaSort, numberSort } from '../../common/score-helper';

export default {
    name: 'Score',
    components: {
        'base-option-row': BaseOptionRow,
        'base-button': BaseButton,
        'score-table': ScoreTable,
    },
    data() {
        return {
            debounce: false,
            sortedScores: [],
            sortField: 'score',
            sortOrder: 'descending',
            sortMethods: [{
                id: 'score',
                text: 'Score',
            },
            {
                id: 'playerName',
                text: 'Name',
            },
            {
                id: 'difficulty',
                text: 'Difficulty',
            },
            {
                id: 'timestamp',
                text: 'Date',
            }],
        };
    },
    computed: {
        compareFunc() {
            // Based on sorting field and comparator return sorting cb
            switch (this.sortField) {
            case 'difficulty':
                return difficultySort(this.sortOrder, this.sortField);
            case 'playerName':
                return alphaSort(this.sortOrder, this.sortField);
            default:
                return numberSort(this.sortOrder, this.sortField);
            }
        },
        resultText() {
            if (!this.recentScore) {
                return '';
            }
            return this.scores.find(s => s.timestamp === this.recentScore.timestamp) ?
                'Congratuations' :
                'No highscore for you';
        },
        ...mapState([
            'scores',
            'recentScore',
        ]),
    },
    watch: {
        compareFunc: {
            immediate: true,
            handler() {
                this.sortScores();
            },
        },
        scores: {
            immediate: true,
            handler(scores) {
                if (!scores) {
                    return;
                }
                // Assign a copy so we won't modify original data
                this.sortedScores = scores.slice();
                this.sortScores();
            },
        },
    },
    methods: {
        sortScores() {
            // Do modify this prop so we preserve part of the previous sorting orders
            this.sortedScores.sort(this.compareFunc);
        },
        parseTimestamp(ts) {
            return new Date(ts).toDateString();
        },
        setSortField(field) {
            if (this.sortField === field) {
                this.sortOrder = this.sortOrder === 'descending'
                    ? 'ascending'
                    : 'descending';
                return;
            }
            this.sortField = field;
        },
        replayQuiz() {
            if (this.debounce) {
                return;
            }
            this.debounce = true;
            this.$store.dispatch(LOAD_QUIZ)
                .then(() => this.$router.push('quiz'))
                .finally(() => {
                    this.debounce = false;
                });
        },
    },
};
</script>

<style scoped>
.recentScore {
    margin-top: 16px;
    text-align: left;
}

.buttonContainer {
    display: flex;
    margin-bottom: 16px;
    justify-content: center;
}

.sortOptions {
    margin-bottom: 24px;
}

.container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    text-align: left;
    justify-content: flex-start;
}

#startButton {
    width: 160px;
    height: 40px;
    background-color: green;
    color: #f0f0f0;
    font-size: 16px;
}

#startButton:hover {
    background-color: darkgreen;
}
</style>
