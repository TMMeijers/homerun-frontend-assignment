<template>
    <div>
        <div>
            <p
                class='explanator'
                v-if='title'
            >
                {{ title }}
            </p>
        </div>
        <input
            ref='inputField'
            class='inputField slightlyRounded'
            type='textfield'
            v-model.trim='inputValue'
            :placeholder='placeholder'
        >
    </div>
</template>

<script>
export default {
    name: 'BaseInput',
    data() {
        return {
            inputValue: '',
        };
    },
    props: {
        placeholder: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
    },
    methods: {
        focus() {
            this.$refs.inputField.focus();
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.inputValue = val;
            },
        },
        inputValue(value) {
            this.$emit('input', value);
        },
    },
};
</script>

<style scoped>
.explanator {
    margin: 0 0 4px 8px;
    font-size: 18px;
    float: left;
}

.inputField {
    height: 40px;
    width: 240px;
    padding: 5px 10px;
    margin: 2px;
    border: 1px solid gainsboro;
    background-color: white;
}

input:focus {
    border: 1px solid grey;
}

</style>
