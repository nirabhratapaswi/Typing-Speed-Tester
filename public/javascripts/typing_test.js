var on_word = 0;
var on_letter = 0;
var check_space = false;
var check_backspace_space = false;	// works reverse of check_space

var check_validity = (letter) => {
    // console.log(`Typing: ${letter}`);
    if (letter == 'Backspace') {
        if (check_backspace_space) {
            check_backspace_space = false;
            check_space = true;
            // console.log(`In backspace word: ${on_word}, letter: ${on_letter}`);
            console.log('flag 0');
            if (on_word - 1 < 0) {
                on_word = 0;
                on_letter = 0;
                check_space = false;
                console.log('flag 1');
            } else {
                on_word--;
                on_letter = word_list[on_word].length;
                console.log('flag 2');
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
        		document.getElementById(`space_${on_word}`).style.backgroundColor = '#00E676';
        	} else {
        		document.getElementById(`space_${on_word}`).style.backgroundColor = '#E53935';
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
            document.getElementById(`word_${on_word}_${on_letter}`).style.color = '#00E676';
        } else {
            document.getElementById(`word_${on_word}_${on_letter}`).style.color = '#E53935';
        }
        on_letter++;
        if (word_list[on_word].length == on_letter) {
            check_space = true;
        }
    }
}

window.onload = () => {
    console.log('Window has loaded.', word_list);
    setTimeout((document, check_validity) => {
        document.addEventListener('keyup', (e) => {
            check_validity(e.key);
        });
    }, 500, document, check_validity);
}