<template>
    <v-toolbar
        dense
        fixed
        height='48px'
    >
        <v-spacer/>
        <v-toolbar-title>
            <h3>Trivia Run</h3>
        </v-toolbar-title>
        <v-spacer class='middleSpacer'/>
        <v-toolbar-items>
            <base-button
                @click.capture='navigate(route)'
                v-for='route in routeNames'
                class='slightlyRounded navButton'
                :key='route'
                :selected='currentRoute === route'
                :disabled='hideNavButtons'
            >
                <h4>{{ route }}</h4>
            </base-button>
        </v-toolbar-items>
        <v-spacer/>
    </v-toolbar>
</template>

<script>
import BaseButton from '../shared-components/BaseButton';

export default {
    name: 'NavigationBar',
    components: {
        'base-button': BaseButton,
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
        hideNavButtons() {
            return this.$route.meta.disableNavigation;
        },
        routeNames() {
            const routes = this.$router.options.routes;
            return routes.reduce((acc, r) => {
                if (r.name) {
                    acc.push(r.name);
                }
                return acc;
            }, []);
        },
    },
    methods: {
        navigate(routeName) {
            this.$router.push({ name: routeName });
        },
    },
};
</script>

<style scoped>
.navButton {
    background-color: inherit;
    width: 80px;
    height: inherit;
    border: none;
}

.navButton:active:not([disabled]) {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
}

.middleSpacer {
    max-width: 200px;
}
</style>

