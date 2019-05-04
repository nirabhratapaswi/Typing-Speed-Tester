// Following variables defined in typing_test.ejs
/*var on_word = 0;
var on_letter = 0;
var check_space = false;
var check_backspace_space = false;	// works reverse of check_space
var line = 0;*/

var retain_color = '',
    words_per_minute = 0,
    words_per_line = 8,
    correct_words_per_line = new Array(words_per_line),
    correct_color = '#00E676',
    wrong_color = '#E53935',
    correct_color_rgb = [0, 230, 118],
    wrong_color_rgb = [229, 57, 53];

var start_time, current_time, update_interval = null,
    time_limit = 10,
    initial_display_string = '00:10',
    number_of_words = 150;

var keyUpFunction = (e) => {
    check_validity(e.key);
}

function getNewParagraph(callback) {
    var xmlhttp = new XMLHttpRequest();
    var url;
    if (document.getElementById('play_mode_radio_1').checked)
    	url = `/typingtest/${mode}/api?words=${number_of_words}`;
    else
    	url = `/typingtest/${mode}/api?words=${document.getElementById('word_limit').value}`;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            console.log(data);
            word_list = data.word_list;
            on_word = 0;
            on_letter = 0;
            displayText();
            if (callback)
            	callback();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function resetCorrectWordsPerLine() {
    for (let i = 0; i < words_per_line; i++)
        correct_words_per_line[i] = false;
}

function displayText(with_first_retained=false) {
    let text = '';
    for (var i = 0; i < word_list.length; i++) {
        text += `<span id='word_${i}'>`;
        for (var j = 0; j < word_list[i].length; j++) {
            if (with_first_retained && i == 0 && j == 0) {
                text += `<span class='not_typed' id='word_${i}_${j}'>${word_list[i][j]}</span>`;
                continue;
            }
            text += `<span class='not_typed' id='word_${i}_${j}'>${word_list[i][j]}</span>`;
        }
        text += `</span><span id='space_${i}'> </span>`;
        if ((i + 1) % words_per_line == 0) {
            text += `<br>`;
        }
    }
    document.getElementById('display_para_div_text').innerHTML = text;
    if (with_first_retained) {
        console.log('Retain color: ', retain_color);
        document.getElementById(`word_0_0`).style.color = retain_color;
    }
}

var popLineIfCompleted = () => {
    if (on_word > 0 && on_word % words_per_line == 0 && on_letter > 0) {
        console.log(`Currently on line: ${line}`);
        word_list = word_list.slice(words_per_line, word_list.length);
        on_word = 0;
        // on_letter = 0;
        line++;
        displayText(true);
        console.log(`word_list after popping: `, word_list);
    }
}

var check_validity = (letter) => {
    if (letter == 'Shift')
        return;
    popLineIfCompleted();
    if (on_word > word_list.length - 1) {
    	word_list = new Array();
    	return;
    }
    if (letter == 'Backspace') {
        if (check_backspace_space) {
            words_per_minute = (words_per_minute - 1 < 0) ? 0 : words_per_minute - 1;
            check_backspace_space = false;
            check_space = true;
            // console.log(`In backspace word: ${on_word}, letter: ${on_letter}`);
            // console.log('flag 0');
            if (on_word - 1 < 0) {
                on_word = 0;
                on_letter = 0;
                check_space = false;
                // console.log('flag 1');
            } else {
                on_word--;
                on_letter = word_list[on_word].length;
                // console.log('flag 2');
            }
            document.getElementById(`space_${on_word}`).style.backgroundColor = '#EEEEEE';
        } else {
            check_space = false;
            on_letter = (on_letter - 1 < 0) ? 0 : on_letter - 1;
            console.log(`word: ${on_word}, letter: ${on_letter}`);
            document.getElementById(`word_${on_word}_${on_letter}`).style.color = '#757575';
            // console.log('flag 3');
            if (on_letter - 1 < 0) {
                console.log(`word: ${on_word}, letter: ${on_letter}`);
                document.getElementById(`word_${on_word}_${on_letter}`).style.color = '#757575';
                check_backspace_space = true;
                // console.log('flag 4');
            }
        }
    } else {
        if (check_space) {
            if (letter == ' ') {
                // Word is one behind current word index in this block, and we need to check for the previous word only, so on_word can directly be used!!
                let equal = true;
                for (let i = 0; i < word_list[on_word].length; i++) {
                    let raw_color_str = document.getElementById(`word_${on_word}_${i}`).style.color.toString(),
                        inside_color_str = raw_color_str.slice(4, raw_color_str.length - 1);

                    let inside_color_str_arr = inside_color_str.split(',');
                    console.log(inside_color_str_arr, correct_color_rgb);
                    for (let i = 0; i < 3; i++) {
                        if (parseInt(inside_color_str_arr[i]) != correct_color_rgb[i]) {
                            // console.log('Unnequal!');
                            equal = false;
                        }
                    }
                }
                if (equal) {
                    // console.log('Incrementing!!');
                    words_per_minute++;
                }
            } else {
                document.getElementById(`space_${on_word}`).style.backgroundColor = wrong_color;
            }
            check_space = false;
            check_backspace_space = true;
            on_word++;
            on_letter = 0;
            return;
        }
        check_backspace_space = false;
        console.log(`Word: ${on_word}, letter: ${on_letter}`);

        if (letter == word_list[on_word][on_letter]) {
            document.getElementById(`word_${on_word}_${on_letter}`).style.color = correct_color;
            retain_color = correct_color;
        } else {
            document.getElementById(`word_${on_word}_${on_letter}`).style.color = wrong_color;
            retain_color = wrong_color;
        }
        on_letter++;
        if (word_list[on_word].length == on_letter) {
            check_space = true;
        }
    }
    console.log(`Correct words: ${words_per_minute}`);
}

function displayTimer() {
    console.log('Displaying Timer');
    document.getElementById('timer_div').style.display = 'inline-block';
    document.getElementById('timer_div').innerText = initial_display_string;
}

function updateTimer() {
    current_time = (new Date()).getTime();
    console.log(`Elapsed: `, Math.round((current_time - start_time) / 1000));
    let elapsed_time = Math.round((current_time - start_time) / 1000),
        seconds = (time_limit - elapsed_time % 60),
        minutes = Math.floor((time_limit - elapsed_time) / 60);

    if (seconds < 10) {
        seconds = '0'.concat(seconds.toString());
    } else {
        seconds = seconds.toString();
    }
    if (minutes < 10) {
        minutes = '0'.concat(minutes.toString());
    } else {
        minutes = minutes.toString();
    }
    document.getElementById('timer_div').innerText = `${minutes}:${seconds}`;
    if (Math.round((current_time - start_time) / 1000) >= time_limit) {
        clearInterval(update_interval);
        displayTimer();
        document.getElementById('start_button').disabled = false;
        document.getElementById('score').innerText = `Words Per Minute = ${words_per_minute}`;
        document.removeEventListener('keyup', keyUpFunction);
        setTimeout(() => {
        	getNewParagraph();
        }, 1000);
    }
}

function hideTimer() {
    console.log('Hiding Timer');
    document.getElementById('timer_div').style.display = 'none';
}

function initilizeWithTimer() {
    displayTimer();
    words_per_minute = 0;
    document.getElementById('start_button').disabled = true;
    start_time = (new Date()).getTime();
    current_time = start_time;
    update_interval = setInterval(() => {
        updateTimer();
    }, 100);
}

function resetTimer() {
    if (update_interval) {
        clearInterval(update_interval);
    }
}

function displayTimerSelf() {
    document.getElementById('timer_div').style.display = 'inline-block';
    document.getElementById('timer_div').innerText = '00:00';
}

function updateTimerSelf() {
    current_time = (new Date()).getTime();
    console.log(`Elapsed: `, Math.round((current_time - start_time) / 1000));
    let elapsed_time = Math.round((current_time - start_time) / 1000),
        seconds = elapsed_time % 60,
        minutes = Math.floor(elapsed_time / 60);

    if (seconds < 10) {
        seconds = '0'.concat(seconds.toString());
    } else {
        seconds = seconds.toString();
    }
    if (minutes < 10) {
        minutes = '0'.concat(minutes.toString());
    } else {
        minutes = minutes.toString();
    }
    document.getElementById('timer_div').innerText = `${minutes}:${seconds}`;
    if (word_list.length == 0) {
        clearInterval(update_interval);
        displayTimer();
        document.getElementById('start_button').disabled = false;
        document.getElementById('score').innerText = `Words Per Minute = ${Math.floor((words_per_minute * 60) / elapsed_time)}`;
        document.removeEventListener('keyup', keyUpFunction);
        setTimeout(() => {
        	getNewParagraph();
        }, 1000);
    }
}

function initializeForSelf() {
    displayTimerSelf();
    words_per_minute = 0;
    if (update_interval) {
        clearInterval(update_interval);
    }
    document.getElementById('start_button').disabled = true;
    start_time = (new Date()).getTime();
    current_time = start_time;
    update_interval = setInterval(() => {
        updateTimerSelf();
    }, 100);
}

function startTest() {
    resetTimer();
    console.log('Test is starting');
    if (document.getElementById('play_mode_radio_1').checked) {
        console.log('Time game starting');
        initilizeWithTimer();
    } else if (document.getElementById('play_mode_radio_2').checked) {
        console.log('Self game starting');
        initializeForSelf();
    } else {
        console.log('None of the radio buttons are selected!!');
    }
    document.addEventListener('keyup', keyUpFunction);
}

window.onload = () => {
    displayText();
    displayTimer();
    setTimeout((document, check_validity) => {
        document.getElementById('play_mode_radio_1').addEventListener('click', (e) => {
        	document.getElementById('reset_word_limit_button').style.display = 'none';
        	getNewParagraph(() => {
        		displayTimer();
        	});
        });
        document.getElementById('play_mode_radio_2').addEventListener('click', (e) => {
        	document.getElementById('reset_word_limit_button').style.display = 'inline-block';
        	getNewParagraph(() => {
        		displayTimerSelf();
        	});
        });
    }, 500, document, check_validity);
}
