window.onload = function(){
	load_high_score();
	home_screen();
}

function object(image_link, object_type, id_number){
	this.image = image_link;
	this.type = object_type;
	this.id = id_number;
	this.layer = (id_number%10);
	this.x = Math.floor(Math.random()*(85))+10;
	if(this.type === "balloon"){
		this.y = 100
	}
	else{
		this.y = -11;		
	}

	if(Math.floor(Math.random()*(10))%2){
		this.direction = 0.4;
	}
	else{
		this.direction = -0.4;
	}
	this.speed = Math.random();
	this.html = $("#" + this.id);
	this.create = function(){
		//create the html for the object
		$('body').append("<img src='" + this.image + "' class='object' id='" + this.id + "' onclick='delete_object(" + this.id + ")'>");
		document.getElementById(this.id).style.marginLeft = this.x + 'vw';
		document.getElementById(this.id).style.marginTop = this.y + 'vh';
		document.getElementById(this.id).style.zIndex = this.layer + '';
	}
	this.move = function(){
		if(this.type === "star" && (this.y+11) < 100){
			this.y = this.y + 0.6;
			if(this.x <0 || this.x > 93){
				this.direction = 0;
			}
			this.x = this.x + (this.direction * this.speed);
			document.getElementById(this.id).style.marginLeft = this.x + 'vw';
			document.getElementById(this.id).style.marginTop = this.y + 'vh';
			//update css
		}
		else if(this.type === "balloon" && (this.y > -11)){
			this.y = this.y - 0.6;
			if(this.x <0 || this.x > 93){
				this.direction = 0;
			}
			this.x = this.x + (this.direction * this.speed);
			document.getElementById(this.id).style.marginLeft = this.x + 'vw';
			document.getElementById(this.id).style.marginTop = this.y + 'vh';
		}
		else{
			this.delete_self(this.type === "star");
		}

	}
	this.delete_self = function(lose){
		$("#" + this.id).remove();
		if(lose){
			lives--;
			$("#" + "life"+lives).remove();
			if(!lives){
				end_game();
			}
		}
		delete object_list[this.id];
	}
	this.create();
}

function add_new_object(){
	var object_randomizer = Math.floor(Math.random()*(9+1));
	//create new object
	var new_object;
	var star_img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/2000px-Gold_Star.svg.png';
	var balloon_img = 'http://images.clipartpanda.com/hot-air-balloon-clip-art-vertical_striped_hot_air_balloons_2-800px.png';
	if(object_randomizer>7){
		//create balloon
		new_object = new object(balloon_img, 'balloon', counter);
	}
	else{
		//create star
		new_object = new object(star_img, 'star', counter);
	}
	counter++;
	object_list[new_object.id] = new_object;

}

function delete_object(id){
	var type = object_list[id].type;
	object_list[id].delete_self(type === 'balloon');
	//increase score
	if(type != 'balloon'){
		change_score();
	}
}

function move_objects(){
	for(var key in object_list){
		object_list[key].move();
	}
}

function load_high_score(){
	//find saved high score in cookies
	high_score = 0;
	if(document.cookie){
		temp = document.cookie.split(';')[0];
		high_score = temp.split('=')[1];
	}
	else{
		var d = new Date();
    	d.setTime(d.getTime() + (365*24*60*60*1000));
    	var expires = "expires="+ d.toUTCString();
		document.cookie = "high_score=" + high_score + ';' + expires + ';path=/';
	}

}

function set_high_score(){
	//save the high score in cookie
	if(high_score < score){
		high_score = score;
		//save into cookie
		var d = new Date();
    	d.setTime(d.getTime() + (365*24*60*60*1000));
    	var expires = "expires="+ d.toUTCString();
		document.cookie = "high_score=" + high_score + ';' + expires + ';path=/';
	}
}

function change_score(){
	score++;
	$('#score').text('Score: ' + score );
}

function home_screen(){
	$('body').css('backgroundImage','url("https://s-media-cache-ak0.pinimg.com/originals/90/9a/1c/909a1cb139394a79e081bc3a73119e4f.jpg")');
	$('body').append("<h1>Unicorn Star Bash</h1>");
	$('body').append('<h2> High Score: ' + high_score + '</h2>');
	$('body').append("<button type='button' class='game_button' onclick='start_game()'> Start Game </button>");
}

function start_game(){
	$('body').empty();
	$('body').append('<div class="gamebackground"></div>');
	counter = 0;
	object_list ={};
	score = 0;
	lives =3;
	for(var i =0; i < lives; i++){
		$('.gamebackground').append('<img src="http://static.tumblr.com/36203d0956b86d170045ddacfa9ae49a/dcyezcd/1txoasho8/tumblr_static_17l8146vgqg0k04cg0s48wgoo.png" class="lives" id="life'+i+'">');
	}
	$('.gamebackground').append('<span id="score">Score: ' + score + '</span>');
	add_new_object();
	add_objects = setInterval(add_new_object, 750);
	object_movement = setInterval(move_objects, 25);
}

function end_game(){
	clearInterval(add_objects);
	clearInterval(object_movement);
	set_high_score();
	$('body').empty();
	$('body').append("<h1>Game Over</h1>");
	$('body').append('<h2>Score: ' + score + '</h2>');
	$('body').append("<button type='button' class='game_button' onclick='start_game()'>Play Again</button>");
	$('body').append("<form action='index.html'><button type='submit' class='game_button'>Exit Game</button></form>");
}