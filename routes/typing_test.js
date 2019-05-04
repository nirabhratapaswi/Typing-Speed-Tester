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

function makeWord(length) {
   let result = '';
   let characters = 'abcdefghijklmnopqrstuvwxyz'; // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   let charactersLength = characters.length;
   for (let i = 0; i<length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function loadEasy(number) {
	return getRandomWords(number, false);
}

function loadHard(number) {
	let word_list = Array(number);
	for (let i=0; i<number; i++) {
    	word_list[i] = makeWord(Math.ceil(Math.random()*10));
    }
    return word_list;
}

/* GET easy page. */
router.get('/easy', function(req, res, next) {
	console.log();
	res.render('typing_test', { title: 'Easy Typing Test', word_list: loadEasy(150), mode: 'easy' });
});

/* GET hard page. */
router.get('/hard', function(req, res, next) {
	console.log();
	res.render('typing_test', { title: 'Hard Typing Test', word_list: loadHard(150), mode: 'hard' });
});

router.get('/easy/api', function(req, res, next) {
	let words = 50;
	if (req.query.words)
		words = parseInt(req.query.words);
	res.json({word_list: loadEasy(words)});
});

/* GET hard page. */
router.get('/hard/api', function(req, res, next) {
	let words = 50;
	if (req.query.words)
		words = parseInt(req.query.words);
	res.json({word_list: loadHard(words)});
});

module.exports = router;
