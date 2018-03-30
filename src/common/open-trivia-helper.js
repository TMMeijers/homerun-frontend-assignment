import queryString from 'query-string';
import he from 'he';

/**
 * Decode HTML entities for each question in the array.
 */
function decodeQuestions(questions) {
    return questions.map((q) => {
        const copy = Object.assign({}, q);
        copy.incorrect_answers = q.incorrect_answers.map(a => he.decode(a));
        copy.correct_answer = he.decode(q.correct_answer);
        copy.question = he.decode(q.question);
        return copy;
    });
}

/**
 * Checks response codes from opentrivia db. See https://opentdb.com/api_config.php
 */
function handleQuestionsResponse(body) {
    switch (body.response_code) {
    case 0:
        return { err: null, questions: decodeQuestions(body.results) };
    default:
        return { err: 'Error fetching questions from OpenTriviaDB' };
    }
}


export function getCategories() {
    return fetch('https://opentdb.com/api_category.php');
}

/**
 * Requests a set of questions based on passed parameters.
 * On succesful responses these are parsed and returned.
 * Else an 'err' is returned containing a user message.
 */
export function getQuestions({ maxQuestions, difficulty = 'medium', category = '' }) {
    const query = queryString.stringify({ amount: maxQuestions, difficulty, category });
    return fetch(`https://opentdb.com/api.php?${query}`)
        .then(res => res.json())
        .then(handleQuestionsResponse);
}

