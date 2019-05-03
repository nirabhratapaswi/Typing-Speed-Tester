const express = require('express'),
	router = express.Router(),
	randomWords = require('random-words');

function getRandomWords(number, as_string) {
	let word_array = randomWords(parseInt(number));
	if (as_string) {
		return word_array.join(' ')
	}
	return word_array;
}

/* GET home page. */
router.get('/', function(req, res, next) {
	list_of_words = getRandomWords(150, false);
	console.log();
	res.render('typing_test', { title: 'Typing Test', word_list: list_of_words });
});

module.exports = router;
