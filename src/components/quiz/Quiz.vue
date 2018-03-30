<template>
    <div v-if='question'>
        <div
            id='metaInfo'
            class='standardMargins'
        >
            <div class='infoBlock'>
                Question<br>
                {{ currentQuestion + 1 }}/{{ maxQuestions }}
            </div>
            <div class='infoBlock'>
                Score<br>
                {{ score }}
            </div>
            <div class='infoBlock'>
                <span v-if='timeRemaining != null'>Timer</span><br>
                {{ timeRemaining }}
            </div>
            <div class='infoBlock'>
                Difficulty<br>
                {{ difficulty }}
            </div>
        </div>

        <div class='questionTextArea standardMargins'>
            <h4 id='questionText'>
                {{ question.question }}
            </h4>

            <h4 id='answerText'>
                <span v-if='!!answerText'>
                    {{ answerText }}
                </span>
            </h4>
        </div>

        <div id='answerContainer standardMargins'>
            <quiz-answer-button
                v-for='(answer, i) in answers'
                :key='i'
                :number='i + 1'
                :disabled='!!answerText'
                class='answerButton'
                @click='onAnswer(answer)'
            >{{ answer }}</quiz-answer-button>

            <quiz-answer-button
                class='skipButton'
                :disabled='!!answerText'
                @click='onSkip'
            >
                <h4 class='skipText'>Skip</h4>
            </quiz-answer-button>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import { INCREMENT_CURRENT_QUESTION, SUBMIT_SCORE } from '../../store/mutation-types';

import { getQuestionScore } from '../../common/score-helper';

import QuizAnswerButton from './QuizAnswerButton';

export default {
    name: 'Quiz',
    components: {
        'quiz-answer-button': QuizAnswerButton,
    },
    mounted() {
        // Render everything before we start the quiz
        this.$nextTick(() => {
            this[INCREMENT_CURRENT_QUESTION]();
        });
        window.addEventListener('keyup', this.checkHotkey);
    },
    destroyed() {
        // Clear out the timer
        clearInterval(this.timerHandle);
        clearTimeout(this.answerTimeout);
        window.removeEventListener('keyup', this.checkHotkey);
    },
    data() {
        return {
            score: 0,
            timeRemaining: null,
            timerHandle: null,
            answerTimeout: null,
            answerText: '',
        };
    },
    computed: {
        correctAnswer() {
            return this.question.correct_answer;
        },
        incorrectAnswers() {
            return this.question.incorrect_answers;
        },
        randomAnswerIndex() {
            // Static indices for boolean answers
            if (this.correctAnswer === 'True') {
                return 0;
            } else if (this.correctAnswer === 'False') {
                return 1;
            }
            return Math.floor(Math.random() * this.incorrectAnswers.length);
        },
        answers() {
            // Splice would be nice but it would modify the computed prop and the original data.
            // Just slice 'm at the generated index
            return [
                ...this.incorrectAnswers.slice(0, this.randomAnswerIndex),
                this.correctAnswer,
                ...this.incorrectAnswers.slice(this.randomAnswerIndex),
            ];
        },
        ...mapState([
            'currentQuestion',
            'maxQuestions',
            'difficulty',
        ]),
        ...mapGetters([
            'question',
            'timelimit',
        ]),
    },
    methods: {
        /**
         * Event handler for pressing one of the answer buttons.
         * Clears out the previous timer, (hopefully) increments score
         * and increments question index.
         */
        onAnswer(answer) {
            clearInterval(this.timerHandle);
            const correct = answer === this.question.correct_answer;
            this.score += getQuestionScore(correct, this.timeRemaining, this.timelimit);
            this.showAnswerAndContinue(correct ? 'correct' : 'incorrect');
        },
        showAnswerAndContinue(answerValid) {
            this.answerText = this.getAnswerText(answerValid);
            this.answerTimeout = setTimeout(() => {
                this.hideAnswerAndContinue();
            }, 2000);
        },
        /**
         * Event handler for pressing the skip button.
         */
        onSkip() {
            clearInterval(this.timerHandle);
            this.showAnswerAndContinue('skip');
        },
        initTimer() {
            // Reset timeremaining and start a new timer
            this.timeRemaining = this.timelimit;
            this.timerHandle = setInterval(() => {
                // Decrement, on 0 clear the timer and request the next question
                this.timeRemaining -= 1;
                if (this.timeRemaining === 0) {
                    clearInterval(this.timerHandle);
                    this.timeRemaining = null;
                    this.showAnswerAndContinue('none');
                }
            }, 1000);
        },
        hideAnswerAndContinue() {
            // clear timeout if it was set
            clearTimeout(this.answerTimeout);
            this.answerText = '';
            this[INCREMENT_CURRENT_QUESTION]();
        },
        submitAndContinue() {
            this[SUBMIT_SCORE]({ score: this.score });
            this.$router.push('score');
        },
        /**
         * Returns the text giving the state of your answer. answerValid can be
         * one of 'correct', 'incorrect', 'none' or 'skip'.
         */
        getAnswerText(answerValid) {
            switch (answerValid) {
            case 'incorrect':
                return `Wrong, the correct answer is: ${this.correctAnswer}`;
            case 'skip':
                return `Skipped the question. Should have been: ${this.correctAnswer}`;
            case 'none':
                return `No answer given. Correct is: ${this.correctAnswer}`;
            case 'correct':
                return 'That is correct!';
            default:
                return 'Invalid answer';
            }
        },
        handleHotkeyS() {
            if (!this.answerText && !this.question) {
                return;
            }
            // Go to next question
            if (this.answerText) {
                this.hideAnswerAndContinue();
                return;
            }
            // Skip this question
            this.onSkip();
        },
        checkHotkey(event) {
            // S/s
            if (event.which === 83) {
                this.handleHotkeyS();
                return;
            }
            // If showing answer, no question or if not 1 - 9
            if (this.answerText || !this.question || (event.which < 49 || event.which > 57)) {
                return;
            }

            // Check out if an answer corresponds to this hotkey
            const answer = this.answers[event.which - 49];
            if (!answer) {
                return;
            }
            this.onAnswer(answer);
        },
        ...mapMutations([
            INCREMENT_CURRENT_QUESTION,
            SUBMIT_SCORE,
        ]),
    },
    watch: {
        /**
         * Watch the set question. Used to progress into the end of the quiz
         * when no new question is set or set the timer for the next question.
         */
        question: {
            immediate: true,
            handler(newQ) {
                if (!newQ) {
                    if (this.currentQuestion === -1) {
                        // Will be initialised
                        return;
                    }
                    if (this.currentQuestion < this.maxQuestions - 1) {
                        // reload protection
                        this.$router.push('Home');
                        return;
                    }
                    // Done
                    this.submitAndContinue();
                    return;
                }
                this.initTimer();
            },
        },
    },
};
</script>

<style scoped>
#metaInfo {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    margin: 24px 0;
    font-size: 16px;
    color: dimgrey;
}

.infoBlock {
    min-width: 100px;
    margin: 4px 8px;
}

.questionTextArea {
    height: calc(200px - 8vw);
    min-height: 120px;
    margin: 0 16px;
}

#questionText {
    text-align: left;
    margin-bottom: 24px;
}

#answerText {
    text-align: left;
}

.answerButton {
    margin: 4px 0;
    background-color: white;

}

.skipButton {
    margin-top: 20px;
    margin-bottom: 16px;
    background-color: firebrick;
}

.skipButton[disabled] {
    color: darkred;
}

.skipButton:hover:not([disabled]) {
    background-color: darkred !important;
}

.skipText {
    margin-left: 32px;
    text-align: center;
}
</style>
