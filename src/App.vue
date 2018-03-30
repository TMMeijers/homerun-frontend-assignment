<template>
    <v-app>
        <navigation-bar/>
        <div id='appContainer'>
            <div class='mainContent'>
                <router-view/>
            </div>
        </div>
    </v-app>
</template>

<script>
import NavigationBar from './components/navigation-bar/NavigationBar';

export default {
    name: 'App',
    components: {
        'navigation-bar': NavigationBar,
    },
    data() {
        return {

        };
    },
    computed: {
        hideNavBar() {
            return this.$route.meta.hideNavBar;
        },
    },
};
</script>

<style>
.mainContent {
    background-color: #f0f0f0;
    width: 80%;
    min-width: 350px;
    max-width: 800px;
    min-height: 400px;

    margin: 0 auto;
    padding: 8px 24px;
    border-radius: 8px;
    margin-top: 100px;
    margin-bottom: 100px;

    box-shadow: 1px 1px 4px 1px black;
}

#appContainer {
    position: relative;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #004a7c;
    color: rgba(0,0,0,.87);
    font-size: 18px;
    text-align: center;
    border-sizing: border-box;

    display: flex;
    flex-flow: column nowrap;
}
</style>
