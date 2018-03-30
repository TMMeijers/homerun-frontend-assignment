<template>
    <base-button
        class='answerContainer'
        @click='click'
        :disabled='disabled'
    >
        <div class='answer'>
            <div
                v-if='number'
                class='number'>
                {{ number }}.
            </div>
            <slot/>
        </div>
    </base-button>
</template>

<script>
import BaseButton from '../shared-components/BaseButton';

export default {
    name: 'QuizAnswerButton',
    components: {
        'base-button': BaseButton,
    },
    props: {
        number: {
            type: Number,
            required: false,
            default: null,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    methods: {
        click(e) {
            this.$emit('click', e);
        },
    },
};
</script>

<style scoped>
.answerContainer {
    padding: 4px 24px;
    width: 100%;
    height: auto;
    min-height: 80px;

    font-size: 18px;

    overflow: clip;
    white-space: normal;
    text-overflow: normal;
}

.answer {
    display: flex;
    flex-flow: row nowrap;

}

.number {
    margin-right: 16px;
}
</style>
