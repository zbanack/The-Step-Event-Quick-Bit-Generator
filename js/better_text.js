function text_tokenize(data) {
	let words = [];
	let colors = [];
	let fonts = [];

	for(var i = 0; i < data.length; i++) {
		let group_words = (data[i][0].split(' '));

		for(var j in group_words) {
			words.push(group_words[j]+' ');
			if (words[words.length-1].includes('\n')) {
				words[words.length-1] = words[words.length-1].replace(/\n/g, '');
				words.push('\n');
			}
			colors.push(data[i][1]);
			fonts.push(data[i][2]);
		}
	}

	return {
		w: words,
		c: colors,
		f: fonts
	}
}

function text_operations(data, xo, yo, max_width, line_height, is_drawing, is_code) {
	let word_width = 0;
	let cur_x = 0;
	let cur_y = 0;
	let x_list = [];
	let y_list = [];
	let widest = 0;

	let tokens = [[]];
	let words = [];
	let colors = [];
	let fonts = [];

	if (is_code) {
		for(var i = 0; i < data.length; i++) {
			words.push(data[i][0]);
			colors.push(data[i][1]);
			fonts.push(data[i][2]);			
		}
	}
	else {
		tokens = text_tokenize(data);
		words = tokens.w;
		colors = tokens.c;
		fonts = tokens.f;		
	}


    let canvas = document.getElementById("myCanvas");  
    let ctx = canvas.getContext("2d");  
	ctx.textAlign="left"; 
	ctx.textBaseline="top"; 

	for(var i in words) {
		let word = words[i].replace(/&nbsp;/g, ' ');
		let newline = word.includes('\n');
		if (newline) word = '';

		ctx.fillStyle = colors[i];
		ctx.font = fonts[i];

		let metrics = ctx.measureText(word); 
		word_width = metrics.width;

		let will_shift = true;

		if ((cur_x + word_width >= max_width) || (newline)) {
			cur_y += line_height;
			cur_x = 0;
		}
		else {
		}

		if ((cur_x + word_width) > widest) widest = cur_x + word_width;
		
		x_list.push(cur_x - word_width);
		y_list.push(cur_y - word_width);

		if (is_drawing) ctx.fillText(word, xo + cur_x, yo + cur_y);

		if (will_shift) cur_x += word_width;
	}

	return {
		height: cur_y + line_height,
		width: widest,
		xs: x_list,
		ys: y_list
	}
}

function text_get_coordinates(data, max_width, line_height) {
	return text_operations(data, 0, 0, max_width, line_height, false, false);
}

function text_get_coordinates_code(data, max_width, line_height) {
	return text_operations(data, 0, 0, max_width, line_height, false, true);
}


function text_draw(data, x, y, max_width, line_height) {
	return text_operations(data, x, y, max_width, line_height, true, false);
}

function text_draw_code(data, x, y, max_width, line_height) {
	return text_operations(data, x, y, max_width, line_height, true, true);
}