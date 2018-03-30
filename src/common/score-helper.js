/**
 * Based on sortorder returns the two fields of the scores.
 * Swapping the order just requires swapping the fields.
 */
function getScoreFields(scoreA, scoreB, order, field) {
    const a = scoreA[field];
    const b = scoreB[field];
    return order === 'ascending' ?
        {
            fieldA: a,
            fieldB: b,
        } :
        {
            fieldA: b,
            fieldB: a,
        };
}

export function difficultySort(order, field) {
    return (a, b) => {
        const { fieldA, fieldB } = getScoreFields(a, b, order, field);
        if (fieldA === fieldB) {
            return 0;
        } else if (fieldA === 'easy') {
            return 1;
        } else if (fieldB === 'easy') {
            return -1;
        } else if (fieldA === 'medium') {
            return 1;
        }
        return -1;
    };
}

export function alphaSort(order, field) {
    return (a, b) => {
        const { fieldA, fieldB } = getScoreFields(a, b, order, field);
        if (fieldA > fieldB) {
            return 1;
        }
        if (fieldA < fieldB) {
            return -1;
        }
        return 0;
    };
}

export function numberSort(order, field) {
    return (a, b) => {
        const { fieldA, fieldB } = getScoreFields(a, b, order, field);
        return field === 'score' ? fieldA - fieldB : fieldB - fieldA;
    };
}

export function getQuestionScore(correct, timeRemaining, timelimit) {
    // No guessing! Easy -5, medium -10, hard -15
    if (!correct) {
        return -5 * (30 / timelimit);
    }
    // Easy +10, Medium +20, hard: 30.
    const base = 40 - timelimit;
    // Multiplier based on timeleft (between 1 and 2)
    const multiplier = 1 + (timeRemaining / timelimit);
    return Math.round(base * multiplier);
}
