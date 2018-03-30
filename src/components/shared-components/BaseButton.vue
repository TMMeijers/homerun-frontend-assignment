<template>
    <button
        :disabled='disabled'
        class='slightlyRounded'
        :class='{selected: selected}'
        @click='click'
    >
        <span :class='{selected: selected}'>
            <slot/>
        </span>
    </button>
</template>

<script>
export default {
    name: 'BaseButton',
    props: {
        selected: {
            type: Boolean,
            required: false,
            default: false,
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
button {
    border: 1px solid gainsboro;
    background-color: white;
    width: 80px;
    height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

button[disabled] {
    color: grey;
}

button:hover:not([disabled]) {
    background-color: gainsboro;
}

button:active:not([disabled]) {
    border: 1px solid darkgrey;
}

span.selected {
    text-decoration: underline;
}
</style>
