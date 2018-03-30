<template>
    <div class='container'>
        <div class='instruction standardMargins'>
            <h3>Welcome to Trivia Run,</h3>
            <p>The perfect pub-quiz simulator, able to generate
            arbitrary questions to your hearts content!<br>
            <i>"No friends needed!" ~ the developer</i></p>
        </div>

        <base-input
            ref='nameInput'
            class='standardMargins'
            v-model.lazy='playerName'
            :title='"Give us a name"'
            :placeholder='"Something witty"'
        />

        <base-option-row
            id='difficultyPicker'
            class='slightlyRounded standardMargins'
            :options='availableDifficulties'
            :title='"Select your difficulty"'
            v-model='selectedDifficulty'
        />

        <div
            id='playButtons'
            class='standardMargins'
        >
            <base-button
                id='startButton'
                @click='initQuiz'
            >
                <h3>Play</h3>
            </base-button>
            <div class='spacer'/>
            <base-button
                id='instructionButton'
                @click='showInstruction = !showInstruction'
            >
                <h2>?</h2>
            </base-button>
        </div>

        <div
            v-expand='showInstruction'
            class='expand instruction'
        >
            <div class='standarMargins'>
                <p>Hi there {{ playerName || "mysterious person" }},</p>
                <p>
                    The goal of this game is to gather arbitrary knowledge and impress
                    yourself by beating your previous highscores!
                </p>
                <p>
                    You will receive <b>10 questions</b>, which are affected by the diffulty
                    you have selected.
                </p>
                <p>
                    The difficulty will also affect your timelimit per question. For
                    example, <b>{{ difficulty }}</b> gives you <b>{{ timelimit }} seconds</b>.
                </p>
                <p>
                    Your scores is affected by the difficulty and time remaining.
                    Higher difficulty and faster answer net you more points. But be careful,
                    <b>wrong answers subtracts points</b>.
                </p>
                <p>
                    Lastly, you can use <b>hotkeys</b> to answer questions. <b>1-9</b>
                    to <b>answer</b> and <b>S</b> to <b>skip</b> a question (and go to the
                    next question if you're impatient).
                </p>
                <p>Good luck!</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';

import { SET_DIFFICULTY, SET_PLAYER_NAME } from '../../store/mutation-types';
import { LOAD_QUIZ } from '../../store/action-types';

import BaseInput from './BaseInput';
import BaseOptionRow from '../shared-components/BaseOptionRow';
import BaseButton from '../shared-components/BaseButton';

export default {
    name: 'Home',
    components: {
        'base-input': BaseInput,
        'base-option-row': BaseOptionRow,
        'base-button': BaseButton,
    },
    mounted() {
        this.focusNameInput();
    },
    data() {
        return {
            title: 'Welcome to Triviarun',
            showInstruction: false,
        };
    },
    computed: {
        playerName: {
            get() {
                return this.$store.state.playerName;
            },
            set(newName) {
                this.$store.commit(SET_PLAYER_NAME, { playerName: newName });
            },
        },
        selectedDifficulty: {
            get() {
                return this.$store.state.difficulty;
            },
            set(newDifficulty) {
                this[SET_DIFFICULTY]({ difficulty: newDifficulty });
            },
        },
        ...mapState([
            'difficulty',
            'availableDifficulties',
        ]),
        ...mapGetters([
            'timelimit',
        ]),
    },
    methods: {
        capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),
        focusNameInput() {
            if (!this.playerName) {
                this.$refs.nameInput.focus();
            }
        },
        initQuiz() {
            if (!this.playerName) {
                this.focusNameInput();
                return;
            }
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
        ...mapMutations([
            SET_DIFFICULTY,
            SET_PLAYER_NAME,
        ]),
    },
};
</script>

<style scoped>
.instruction {
    text-align: left;
    width: 60%;
    min-width: 240px;
}

.instruction h3 {
    margin-left: 16px;
}

.instruction p {
    font-size: 16px;
}

.container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
}

#playButtons {
    margin: 16px 0px;
    height: 40px;
    display: flex;
    width: 240px;
    flex-direction: row;
}

#instructionButton {
    width: 72px;
    height: inherit;
}

#startButton {
    width: 152px;
    height: inherit;
    background-color: green;
    color: #f0f0f0;
    font-size: 24px;
}

#startButton:hover {
    background-color: darkgreen;
}

#difficultyPicker {
    margin-top: 8px;
}

.expand-transition {
    transition-property: height;
    transition-duration: .4s; // Durations can be changed without touching JS
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); // Timing functions also!

    height: auto;
    padding: 10px;
    background-color: #eee;
    overflow: hidden;
}

.expand-enter, .expand-leave {
    height: 0;
    padding: 0 10px;
    opacity: 0;
}
</style>
