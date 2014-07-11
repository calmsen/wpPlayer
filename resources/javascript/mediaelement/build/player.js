//работа с плеиром начало
document.write('<div id="container_players" ia="#cont_playlist" class="sign" s="n_19">');
	document.write('<div class="mejs_0 mejs-hidden">');
		document.write('<div>');
			document.write('<div>');
				document.write('<video poster="" controls="controls" preload="none" width="650px" height="400px">');
					document.write('<source type="video/mp4" src="" />');
					document.write('<source type="video/ogg" src="" />');
					document.write('<object type="application/x-shockwave-flash" data="plugins/mediaelement/build/flashmediaelement.swf" width="650px" height="400px">');
						document.write('<param name="movie" value="plugins/mediaelement/build/flashmediaelement.swf" />');
						document.write('<param name="flashvars" value="controls=true&poster=&file=" />');
						document.write('<img src="" title="No video playback capabilities"  width="650px" height="400px"/>');
					document.write('</object>');
				document.write('</video>');
			document.write('</div>');
		document.write('</div>');
	document.write('</div>');	document.write('<div class="mejs_0 mejs-hidden">');
		document.write('<div>');
			document.write('<div>');
				document.write('<video poster="" controls="controls" preload="none" width="650px" height="400px">');
					document.write('<source type="video/mp4" src="" />');
					document.write('<source type="video/ogg" src="" />');
					document.write('<object type="application/x-shockwave-flash" data="plugins/mediaelement/build/flashmediaelement.swf" width="650px" height="400px">');
						document.write('<param name="movie" value="plugins/mediaelement/build/flashmediaelement.swf" />');
						document.write('<param name="flashvars" value="controls=true&poster=&file=" />');
						document.write('<img src="" title="No video playback capabilities"  width="650px" height="400px"/>');
					document.write('</object>');
				document.write('</video>');
			document.write('</div>');
		document.write('</div>');
	document.write('</div>');	document.write('<div class="mejs_0 mejs-hidden">');
		document.write('<div>');
			document.write('<div>');
				document.write('<video poster="" controls="controls" preload="none" width="650px" height="400px">');
					document.write('<source type="video/mp4" src="" />');
					document.write('<source type="video/ogg" src="" />');
					document.write('<object type="application/x-shockwave-flash" data="plugins/mediaelement/build/flashmediaelement.swf" width="650px" height="400px">');
						document.write('<param name="movie" value="plugins/mediaelement/build/flashmediaelement.swf" />');
						document.write('<param name="flashvars" value="controls=true&poster=&file=" />');
						document.write('<img src="" title="No video playback capabilities"  width="650px" height="400px"/>');
					document.write('</object>');
				document.write('</video>');
			document.write('</div>');
		document.write('</div>');
	document.write('</div>');
document.write('</div>');
controller_players = {
	$container_players:$('#container_players'),
	players:[],
	idblog: '',
	art_idblog: '',
	$cont_player:{},
	me_player:{},
	$but_play:{},
	type_init:'',
	$idplaylistu:{},
	$but_fullscreen:{},
	isFullScreen:false,
	do_countup:{},
	is_ready:true,
	$playlist:$('ul.playlist'),
	size: 3,
	isGeneral_pg:false,
	isArticlel_pg:false,
	
	playing:function(self){
		this.$idplaylistu = self.$idplaylistu;
		$playlist.find(".playing").removeClass("playing");
		$(self.$idplaylistu).addClass("playing");

	},
	man_gen_pl:function($el){
		this.isArticlel_pg = false;
		this.isGeneral_pg = false;
		var l = $el.attr('l');
		if(l == ('article')){
			this.isArticlel_pg = true;
		}else
		if(l == ('general') || l == ('toread') || l == ('tolisten') || l == ('towatch') || l == ('news_block') || l == ('placard_block') || l == ('search_blog') || l == ('itunes') || l == ('mobile') || l == ('aboutjournal') || l == ('advertiser')){
			this.isGeneral_pg = true;
		}
		for(var i = 0;i < this.size;i++){
			var
				player = this.players[i],
				$cont_player = this.players[i].$cont_player,
				$but_play = this.players[i].$but_play,
				type_init = this.players[i].type_init,
				idblog = this.players[i].idblog,
				is_play = this.players[i].is_play
			;
			this.players[i].active = false;

			if(this.isGeneral_pg){
				if(type_init == "new"){
					$cont_player.removeClass("mejs_0").removeClass("mejs_1").removeClass("mejs_3").addClass("mejs_2").removeClass("mejs-hidden").removeClass("mejs-hide-video");							
					player.view = 'new';
				}else
				if(this.idblog == idblog){
					$cont_player.removeClass("mejs_0").removeClass("mejs_2").removeClass("mejs_3").addClass("mejs_1").removeClass("mejs-hidden");
					player.view = 'base';
				}else{
					$cont_player.removeClass("mejs_1").removeClass("mejs_2").removeClass("mejs_3").addClass("mejs_0").addClass("mejs-hidden");
					player.view = '';
				}
			}else
			if(this.isArticlel_pg){

				if(this.art_idblog == idblog){
					$cont_player.removeClass("mejs_0").removeClass("mejs_1").removeClass("mejs_2").addClass("mejs_3").removeClass("mejs-hidden");
					player.view = 'art';
				}else
				if(this.idblog == idblog){
					$cont_player.removeClass("mejs_0").removeClass("mejs_2").removeClass("mejs_3").addClass("mejs_1").removeClass("mejs-hidden");
					player.view = 'base';
				}else{
					$cont_player.removeClass("mejs_1").removeClass("mejs_2").removeClass("mejs_3").addClass("mejs_0").addClass("mejs-hidden");
					player.view = '';
				}
			}else{
				if(this.idblog == idblog){
					$cont_player.removeClass("mejs_0").removeClass("mejs_2").removeClass("mejs_3").addClass("mejs_1").removeClass("mejs-hidden");
					player.view = 'base';
				}else{
					$cont_player.removeClass("mejs_1").removeClass("mejs_2").removeClass("mejs_3").addClass("mejs_0").addClass("mejs-hidden");
					player.view = '';
				}
			}	
		}
	},
	hide_players:function(){
		this.art_idblog = false;
		for(var i = 0;i < this.players.length;i++){
			var
				player = this.players[i],
				$cont_player = this.players[i].$cont_player
			;
			if(player.view != 'base'){
				$cont_player.addClass('mejs-hidden');
			}
		}
	}
}
function Player(){
	var self = this;
	self.active = false;
	self.is_play = false;
	self.number = controller_players.players.length;
	self.$cont_player = controller_players.$container_players.children('div:eq(' + self.number + ')');
	self.isFullScreen = false;
	self.me_player = $('video',self.$cont_player)[0].player;
	self.me_player.integrate_controller(self);
	self.$but_play = $('div.mejs-playpause-button',self.$cont_player);
	self.$but_overlay = $('div.mejs-overlay-button button',self.$cont_player);
	self.$but_video = $('div.mejs-video-button',self.$cont_player);
	self.$but_fullscreen = $('div.mejs-fullscreen-button',self.$cont_player);
	if($.browser.msie){
		self.$but_fullscreen.css({'display':'none'});
	}
	self.$layers = $('div.mejs-layers',self.$cont_player);
	self.$mediaelement = $('div.mejs-mediaelement',self.$cont_player);
	self.$but_video.data('player',self).click(self.click_but_video);
	self.$layers.data('player',self).dblclick(self.dblclick_fullscreen);
	self.$mediaelement.data('player',self).dblclick(self.dblclick_fullscreen);
	
}
Player.prototype.click_but_video = function(){
	$(this).data('player').$cont_player.toggleClass("mejs-hide-video");
}
Player.prototype.dblclick_fullscreen = function(){
	$(this).data('player').$but_fullscreen.mousedown();
}
Player.prototype.alert = function(mes){
	log(mes);
}
	
	
	
Player.prototype.play = function(){
	var self = this;
	if(!self.is_play){
		self.$but_play.click();
		controller_players.$but_play = self.$but_play;
		controller_players.me_player = self.me_player;
		controller_players.$cont_player = self.$cont_player;
		controller_players.idblog = self.idblog;
	}
}

Player.prototype.init = function($el) {
	var 
		self = this,
		idblog = $('#idblog',$el).val(),
		type_init = $('#type_init',$el).val(),
		number_row = $('#number_row',$el).val(),
		player = '';
	;
	
	for(var i = 0;i < controller_players.size;i++){
		player = controller_players.players[i];
		if(idblog == player.idblog){//с рачетом что инициализируется при вызове на главной странице
			if(type_init == 'base'){
				if(player.view != 'new'){
					player.$cont_player.removeClass('mejs_0').removeClass('mejs_2').removeClass('mejs_3').removeClass("mejs-hidden").addClass('mejs_1');
					player.type_init = type_init;
				}
				location.hash = '#' + idblog + '_player';
				log('#' + idblog + '_player');
				player.active = false;
				player.play();
				
			}else//с рачетом что инициализируется при вызове обработчика n_19
			if(type_init == 'new'){
				if(number_row == 0){
					player.$cont_player.addClass('first-child');
				}else
				if(number_row == 1){
					player.$cont_player.removeClass('first-child');
				}
				player.active = true;
				player.type_init = type_init;
			}else
			if(type_init == 'art'){
				controller_players.art_idblog = idblog;
				player.active = true;
				player.type_init = type_init;
			}
			return true;
		}
	}
	if(((type_init == 'new') || (type_init == 'art')) && self.is_play){
		return false;
	}
	if((type_init == 'base') && (self.type_init == 'new')){
		return false;
	}
	self.idblog = idblog;
	self.type_init = type_init;	
	self.mp3 = $('#mp3',$el).val();
	self.ogg = $('#ogg',$el).val();
	self.qcomments = $('#qcomments',$el).val();
	self.response = $('#response',$el).val();
	self.review = $('#review',$el).val();
	self.category = $('#category',$el).val();
	self.position = $('#position',$el).val();
	self.href = $('#href',$el).val();
	self.$idplaylistu = $($('#idplaylistu',$el).val());
	self.suf_id = '_cp';
	var add_class = '';
	var remove_class = '';
	
	if(self.category == "tolisten"){
		add_class = "mejs-audio";
		remove_class = 'mejs-video';
		self.type = 'audio'; 
	}else
	if(self.category == "towatch"){
		add_class = "mejs-video";
		remove_class = 'mejs-audio';
		self.type = 'video' ;
	}
	
	self.$cont_player.attr('id',self.idblog + self.suf_id).removeClass(remove_class).addClass(add_class);
	self.me_player.setSrc([{src:self.mp3,type:'video/mp4'},{src:self.ogg,type:'video/ogg'}]);
	self.me_player.load();
	self.active = true;
	$("div.compl a",self.$cont_player).attr('href','/comment/' + self.position);
	$("div.compl span",self.$cont_player).attr("id",self.idblog + "101").text(self.qcomments);
	$("div.readpl a",self.$cont_player).attr('href',self.href);
	$("div.readpl span",self.$cont_player).attr("id",self.idblog + "105").text(self.review);
	$("div.resppl a",self.$cont_player).attr('href','/response/' + self.position);
	$("div.resppl span",self.$cont_player).attr("id",self.idblog + "02").text(self.response);
	$("a.loadmp4",self.$cont_player).attr("href","/library/myphp/download.php?filename=" + self.mp3.replace(cs.root + '/',''));
	if(self.type_init == 'base'){
		self.$cont_player.removeClass('mejs_0').removeClass('mejs_2').removeClass('mejs_3').removeClass("mejs-hidden").addClass('mejs_1');
		location.hash = '#' + 'player-' + self.position;
		self.active = false;
		self.is_play = false;
		self.view = 'base';
		self.play();
	}else
	if(self.type_init == 'new'){
		self.$cont_player.removeClass('mejs_0').removeClass('mejs_1').removeClass('mejs_3').removeClass("mejs-hidden").addClass('mejs_2');
		if(number_row == 0){
			self.$cont_player.addClass('first-child');
		}else
		if(number_row == 1){
			self.$cont_player.removeClass('first-child');
		}
		self.view = 'new';
	}else
	if(self.type_init == 'art'){
		self.$cont_player.removeClass('mejs_0').removeClass('mejs_1').removeClass('mejs_2').removeClass("mejs-hidden").addClass('mejs_3');
		controller_players.art_idblog = self.idblog;
		self.view = 'art';
	}
	return true;
	
}
cs.sign.n_19.ready = false;
cs.sign.n_19.unload = function(){
	$("video").mediaelementplayer({features: ['resume','playpause','volume_1','muteunmute','current','progress','duration','volume','video','loadmp4','fullscreen']});
	ifExist(function(){
		for(var i = 0;i < controller_players.size;i++){
			controller_players.players[i] = new Player();
		}
		cs.sign.n_19.ready = true;
	},'$("#container_players > div:eq(2) div.mejs-playpause-button")');
};

cs.sign.n_20.ready = true;
cs.sign.n_20.load = function(){
	var el = this;
	cs.sign.n_20.ready = false;
	ifExist(function(){
		var fl_init = false;
		
		for(var i = 0;i < controller_players.size;i++){
			var 
				active = controller_players.players[i].active
			;
			if(!active){
				if(controller_players.players[i].init($(el))){
					fl_init = true;
				}
			}
			if(fl_init){
				break;
			}
		}
		cs.sign.n_20.ready = true;
	},"cs.sign.n_19.ready");
};
cs.sign.n_21.load = function(){
	var $el = $(this);
	var l = $el.attr('l');
	cs.trigger_nav_active($('#' + l));
	setTimeout(function(){
		ifExist(function(){
			if(cs.sign.n_19.ready){
				controller_players.man_gen_pl($el);
			}
		},"cs.sign.n_20.ready")
	},0);
};
cs.sign.n_21.unload = function(){
	window.controller_players!=undefined&&controller_players.hide_players();
};
//работа с плеиром конец