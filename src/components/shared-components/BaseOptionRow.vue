<template>
    <div class='flexContainer'>
        <div>
            <p
                class='explanator'
                v-if='title'
            >
                {{ title }}
            </p>
        </div>
        <div>
            <base-button
                class='rowButton'
                v-for='option in options'
                :key='option.id'
                :selected='isSelected(option.id)'
                @click='select(option.id)'
            >
                {{ option.text }}
            </base-button>
        </div>
    </div>
</template>

<script>
import BaseButton from './BaseButton';

export default {
    name: 'BaseOptionsRow',
    components: {
        'base-button': BaseButton,
    },
    data() {
        return {
            selected: null,
        };
    },
    props: {
        options: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
        value: {
            type: String,
            required: false,
            default: null,
        },
    },
    methods: {
        isSelected(selectedValue) {
            return selectedValue === this.selected;
        },
        select(id) {
            this.selected = id;
            this.$emit('input', id);
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.selected = val;
            },
        },
    },
};
</script>

<style scoped>
.flexContainer {
    display: flex;
    flex-flow: column nowrap;
}

.explanator {
    margin: 0 0 4px 8px;
    font-size: 18px;
    float: left;
}

.rowButton:first-child {
    -moz-border-radius-topleft: 4px;
    -moz-border-radius-bottomleft: 4px;

    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.rowButton:last-child {
    -moz-border-radius-topright: 4px;
    -moz-border-radius-bottomright: 4px;

    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-right: 1px solid gainsboro;
}

.rowButton {
    width: auto;
    min-width: 80px;
    border: none;
    border-top: 1px solid gainsboro;
    border-left: 1px solid gainsboro;
    border-bottom: 1px solid gainsboro;
    border-radius: 0px;
    background-color: white;
}

:host {
    background-color: #f0f0f0;
}
</style>
