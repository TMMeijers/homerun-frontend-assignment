<template>
    <table
        id='highScoresTable'
        cellspacing=0
        cellpadding=0
    >
        <tr class='tableRowHead'>
            <th/>
            <th>Name</th>
            <th>Score</th>
            <th>Difficulty</th>
        </tr>
        <tr
            class='scoreEntry'
            :class='{winner: score.timestamp === winningTimestamp}'
            :key='score.timestamp'
            v-for='(score, index) in scores'
        >
            <td>{{ index + 1 }}</td>
            <td>{{ score.playerName }}</td>
            <td>{{ score.score }}</td>
            <td>{{ score.difficulty }}</td>
        </tr>
    </table>
</template>

<script>
export default {
    name: 'ScoreTable',
    props: {
        scores: {
            type: Array,
            required: false,
            default: () => [],
        },
        winningTimestamp: {
            type: Number,
            required: false,
            default: null,
        },
    },
};
</script>

<style scoped>
tr {
    margin: 0;
}

.scoreEntry:hover {
    background-color: gainsboro;
}

.scoreEntry.winner {
    font-weight: bold;
}

td {
    margin: 0 auto;
    width: 80px;
}


</style>
