import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/home/Home';
import Quiz from '../components/quiz/Quiz';
import Score from '../components/score/Score';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Start',
            component: Home,
            alias: '/home',
        },
        {
            path: '/quiz',
            component: Quiz,
            meta: {
                disableNavigation: true,
            },
        },
        {
            path: '/score',
            name: 'Scores',
            component: Score,
        },
        {
            path: '*',
            component: Home,
        },
    ],
});
