;(function($, win, doc, undefined) {
	
	'use strict';

	console.log('ui plugins')

	var global = '$plugins';
	var namespace = 'cignaUI.plugins';

	if (!!win[global]) {
		throw new Error("module already exists! >>" + global);
	} else {

		win[global] = createNameSpace(namespace, {
			uiNameSpace: function (identifier, module) {
				return createNameSpace(identifier, module);
			}
		});
	}

	function createNameSpace(identifier, module) {
		var w = win,
			name = identifier.split('.'),
			p;

		if (!!identifier) {
			for (var i = 0; i < name.length; i += 1) {
				(!w[name[i]]) ? (i === 0) ? w[name[i]] = {} : w[name[i]] = {} : '';
				w = w[name[i]];
			}
		}

		if (!!module) {
			for (p in module) {
				if (!w[p]) {
					w[p] = module[p];
				} else {
					throw new Error("module already exists! >>" + p);
				}
			}
		}
		return w;
	}

	win[global] = win[global].uiNameSpace(namespace, {
		uiInit: function () {
			return createUiInit();
		},
		uiAjax: function(opt) {
			return createUiAjax();
		},
		uiInpBox: function () {
			return createUiInpBox();
		},
		uiFloating: function (opt) {
			return createUiFloating(opt);
		},
		uiScrollBox: function (opt) {
			return createUiScrollBox(opt);
		},
		uiBtnSelect: function(opt) {
			return createUiBtnSelect(opt);
		},
		uiGraphHuman: function (opt) {
			return createUiGraphHuman(opt);
		},
		uiGraphHumanRe: function (opt) {
			return createUiGraphHumanRe(opt);
		},
		uiGraphBar: function (opt) {
			return createUiGraphBar(opt);
		},
		uiGraphBarRe: function (opt) {
			return createUiGraphBarRe(opt);
		},
		uiModalOpen: function(opt) {
			return createUiModalOpen(opt);
		},
		uiModalLoaded: true
		,
		uiModalClose: function(opt) {
			return createUiModalClose(opt);
		},
		uiCountStep: function(opt) {
			return createUiCountStep(opt);
		},
		uiCountSlide: function(opt) {
			return createUiCountSlide(opt);
		},
		uiComma : function(n){
			var parts = n.toString().split(".");

			return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
		}
	});

	win[global].page = {};

	function createUiInit(){
		$('#container').css('min-height', $(win).outerHeight(true) - $('#header').outerHeight(true) - $('#footer').outerHeight(true));
	}

	win[global].uiAjax.option = {
		page: true,
		add: false,
		prepend:false,
		type: 'GET',
		callback: false,
		contType: 'application/x-www-form-urlencoded; charset=euc-kr'
	}
	function createUiAjax(v){
		var opt = $.extend(true, {}, win[global].uiAjax.option, v),
			$target = $('#' + opt.id),
			callback = opt.callback === undefined ? false : opt.callback;

		$.ajax({
			type: opt.type,
			url: opt.url,
			cache: false,
			async: false,
			headers: {
				"cache-control" : "no-cache", 
				"pragma" : "no-cache"
			},
			error: function(request, status, err) {
				console.log("error");
			},
			success: function(v) {S
				opt.page ? opt.add ? opt.prepend ? $target.prepend(v) : $target.append(v) : $target.html(v) : '';
				callback ? callback(v) : '';
			}
		});
	}

	function createUiBtnSelect(opt){
		var $btnwrap = $('#' + opt.id),
			$btn = $btnwrap.find('button'),
			current = opt.current !== undefined ? opt.current : 0,
			callback = opt.callback !== undefined ? opt.callback : false;

		callbackfn(current);
		$btn.on('click', function(){
			callbackfn($(this).index());
		});

		function callbackfn(n){
			$btn.removeClass('selected');
			$btn.eq(n).addClass('selected');
			!!callback 
				? callback({ 
					id: opt.id,
					current: n,
					val : $btn.eq(n).val()
				}) 
				:'';
		}
	}

	function createUiScrollBox(opt) {
		var callback = opt.callback,
			len = $('.ui-scrollbox-item').length;

		//setup
		if ($(win).outerHeight() > $('.ui-scrollbox-item').eq(0).offset().top) {
			$('.ui-scrollbox-item').eq(0).addClass('visible');
			callback({ current: 0, visible: true});
		} 

		//event
		$(win).off('scroll.win').on('scroll.win', function(){
			var $win = $(win),
				$body = $('body'),
				win_h = $win.outerHeight(),
				scr_t = $win.scrollTop(),
				add_h = (win_h / 10),
				item = $('.ui-scrollbox-item');

			var n = 0;

			if (Math.abs(win_h - item.eq(0).offset().top) + add_h < scr_t || $(win).outerHeight() > item.eq(0).offset().top) {
				item.eq(0).addClass('visible');
				n = 0;
				callback({ current: n, visible: true});
				itemCheck();
			} else {
				callback({ current: n, visible: false});
				item.eq(0).removeClass('visible');
			}

			function itemCheck(){
				n = n + 1;
				var items = item.eq(n);

				if (n >= len) {
					return false;
				} 

				if (Math.abs(win_h - items.offset().top) + add_h < scr_t) {
					items.addClass('visible');
					callback({ current: n, visible: true});
					itemCheck();
				} else {
					items.removeClass('visible');
					callback({ current: n, visible: false});
				}
			}
		});

		
		
	}

	function createUiCountSlide(opt) {
		var $base = $('#' + opt.id);
		var countNum = !!opt.value === true ? opt.value : $base.text(),
			base_h = $base.outerHeight(),
			textNum = 0,
			len = countNum.toString().length,
			speed = !!opt.speed === true ? opt.speed + 's' : '1.0s',
			eff = !!opt.eff === true ? opt.eff : 'easeoutQuart',
			transitionEnd = 'transitionend webkit TransitionEnd oTransitionEnd otransitionend',
			i= 0,
			nn = 1,
			step, re, timer, r;

		if($base.data('ing') !== true) {
			textNum = $plugins.uiComma(countNum);
			base_h === 0 ? base_h = $base.text('0'.outerHeight()) : '';
			$base.data('ing', true).empty().css('height',base_h);
			len = textNum.length;
			step = len;
			re = Math.ceil(len / 9);
			(step < 9) ? step = 9 -len : step = 1;

			for (i; i < len; i++) {
				var n = Number(textNum.substr(i, 1)),
				$thisNum, $base_div;

				if(isNaN(n)) {
					$base.append('<div class="n' + i + '"><div class="ui-count-og" style="top:' + base_h + 'px">' + textNum.substr(i,1) + '</div></div>');
					$base.find('.n' + i).append('<span>' + textNum.substr(i,1) + '</span>');
				} else {
					$base.append('<div class="n' + i +'"><div class="ui-count-og" style="top:' + base_h + 'px">' + n + '</div></div>');
					$base.find('.n' + i).append('<span>9<br>8<br>7<br>6<br>5<br>4<br>3<br>2<br>1<br>0<br>' + n +'</span>');
					step = step + 1;
				}

				$base_div = $base.children('.n' + i);
				$base_div.find('span').wrapAll('<div class="ui-count-num" style="top:'+ base_h + 'px; transition:top ' + speed +' ;"></div>');
				$thisNum = $base_div.find('.ui-count-num');
				$thisNum.data('height', $thisNum.height());
			}

			r = len;
			timer = setInterval(function(){
				count(r);
				r = r - 1;
				(r < 0) ? clearInterval(timer) : '';

			}, 150);
		}
		function count(r) {
			var $current_num = $base.children('.n' + r).find('.ui-count-num'),
				num_h = Number($current_num.data('height'));

			$current_num.css('top', (num_h - base_h) * -1);

			if (r === 0) {
				$current_num.one(transitionEnd, function(){
					$base.text(textNum).data('ing', false);
				})

			}
		}
	}
	function createUiCountStep(opt) {
		var $base = $('#' + opt.id);
		var countNum = !!opt.value === true ? opt.value : $base.text(),
			count = 0,
			timer, diff, counter;

		if($base.data('ing') !== true){
			counter = function(){
				diff = countNum - count;
				(diff > 0) ? count += Math.ceil(diff / 20, -2) : '';

				var n = $plugins.uiComma(count);
				$base.text(n);
				if (count < countNum) {
					timer = setTimeout(function(){
						counter();
					},1);
				} else {
					clearTimeout(timer);
				}
			}
			counter();
		} 
	}

	function createUiInpBox(){ 
		$('.form-box-item input, .form-box-item [tabindex="0"]').off('focus.inpbox').on('focus.inpbox', function(){
			$('.form-box-item').removeClass('hover');
			$(this).closest('.form-box-item').addClass('hover');
		}).on('blur', function(){
			$('.form-box-item').removeClass('hover');
		});
	}

	win[global].uiModalOpen.option = {
		full:false,
		ps: 'center'
	}
	function createUiModalOpen(v) {
		var opt = $.extend(true, {}, win[global].uiModalOpen.option, v),
			id = opt.id,
			src = opt.src,
			full = opt.full,
			ps = opt.ps,
			endfocus = opt.endfocus === undefined ? document.activeElement : '#' + opt.endfocus,
			callback = opt.callback === undefined ? false : opt.callback,
			$modal = $('#' + id);

		var timer;

		win[global].uiModalLoaded = false;


		if (!!src) {
			$plugins.uiAjax({
				id: 'wrap',
				url : src
			});
		}

		!!full ? $modal.addClass('ready type-full') : $modal.addClass('ready type-normal');
		//$('body').css('overflow','hidden');

		switch (ps) {
			case 'center':
				$modal.addClass('ps-center');
				break;
			case 'top':
				$modal.addClass('ps-top');
				break;
			case 'bottom':
				$modal.addClass('ps-bottom');
				break;
		}
		
		clearTimeout(timer);
		timer = setTimeout(function(){
			$modal.addClass('open').data('endfocus', endfocus);
			callback ? callback(opt) : '';

			if ($modal.find('.ui-modal-cont').outerHeight() > $(win).outerHeight(true) - 20 && !full) {
				$modal.find('.ui-modal-wrap').css('height', '100%');
			}
 
			$modal.find('.btn-close').focus();
			win[global].uiModalLoaded = true;
		},150);
		

	}
	win[global].uiModalClose.option = {
		remove:false
	}
	function createUiModalClose(v) {
		var opt = $.extend(true, {}, win[global].uiModalClose.option, v),
			id = opt.id,
			src = opt.src,
			full = opt.full,
			remove = opt.remove,
			$modal = $('#' + id),
			endfocus = opt.endfocus === undefined ? $modal.data('endfocus') : '#' + opt.endfocus,
			callback = opt.callback === undefined ? false : opt.callback;
		
		var timer;

		$modal.removeClass('open');
		clearTimeout(timer);
		timer = setTimeout(function(){
			$modal.removeClass('ready ps-bottom ps-top ps-center type-normal type-full');
			$('body').css('overflow','initial');
			$('body').removeAttr('style');
			callback ? callback(opt) : '';
			remove ? $modal.remove() : '';
			!!endfocus ? endfocus.focus()  :'';
		},150);

	}

	function createUiGraphBarRe(opt) {
		var id = opt.id,
			$graph = $('#' + id),
			$graphwrap = $graph.find('.graph-bar-wrap'),
			$item = $graphwrap.find('.bar-wrap'),
			$bar = $item.find('.bar'),
			graph_axis = opt.vertical ;

		$item.removeClass('finish');
		if (graph_axis === 'height') {
			$bar.stop().animate({
				height: 0
			},0);
		} else {
			$bar.stop().animate({
				width: 0
			},0);
		}
	}
	function createUiGraphBar(opt) {
		var id = opt.id,
			max = opt.max === undefined ? 100 : opt.max,
			$graph = $('#' + id),
			$graphwrap = $graph.find('.graph-bar-wrap'),
			graphVal = opt.val / max * 100,
			speed = opt.speed === undefined ? 500 : opt.speed,
			graph_axis = (opt.vertical === undefined ? false : opt.vertical) ? 'height' : 'width',
			$item = $graphwrap.find('.bar-wrap'),
			$bar = $item.find('.bar');

		$graph.find('.graph-val').text(opt.val);
		$plugins.uiGraphBarRe({ 
			id: opt.id,
			vertical: graph_axis
		});

		if (graph_axis === 'height') {
			$item.find('.bar').stop().animate({
				height: graphVal + '%'
			},speed, function() {
				$item.addClass('finish');
			});
		} else {
			$item.find('.bar').stop().animate({
				width: graphVal + '%'
			},speed, function() {
				$item.addClass('finish');
			});
		}
	}

	function createUiGraphHumanRe(opt) {
		var id = opt.id,
			$graph = $('#' + id),
			$graphwrap = $graph.find('.graph-human-wrap'),
			$item = $graphwrap.find('span'),
			$bar = $item.find('.bar'),
			graph_axis = opt.vertical;

		if (graph_axis === 'height') {
			$bar.stop().animate({
				height: 0
			},0);
		} else {
			$bar.stop().animate({
				width: 0
			},0);
		}
	}
	function createUiGraphHuman(opt) {
		var id = opt.id,
			max = opt.max,
			$graph = $('#' + id),
			$graphwrap = $graph.find('.graph-human-wrap'),
			graphVal = opt.val / max * 100,
			graph_axis = (opt.vertical === undefined ? false : opt.vertical) ? 'height' : 'width';

		var timer,
			i = 0,
			html_graph = ''; //human sum

		$graph.find('.graph-val').text(opt.val);
		for (var j = 0; j < max; j++) {
			html_graph += '<span><i></i></span>';
		}
		$graphwrap.html(html_graph);

		var $item = $graphwrap.find('span'),
			$bar = $item.find('i');

		$plugins.uiGraphHumanRe({ 
			id: opt.id,
			vertical: graph_axis
		});

		clearTimeout(timer);
		timer = setTimeout(function(){
			graphMotion(i);	
		},500);
		
		function graphMotion(n){
			if (n === Math.floor(opt.val)) {
				if (i < Math.ceil(opt.val)) {
					if (graph_axis === 'height') {
						$item.eq(i).find('i').stop().animate({
							height: ((opt.val - i) / 100 * 100) * 100 + '%'
						},150);
					} else {
						$item.eq(i).find('i').stop().animate({
							width: ((opt.val - i) / 100 * 100) * 100 + '%'
						},150);
					}
					
				} 
			} else {
				if (graph_axis === 'height') {
					$item.eq(n).find('i').stop().animate({
						height: '100%'
					},150, function(){
						if (n < Math.floor(opt.val)) {
							i = n + 1;
							graphMotion(i);
						} 
					});
				} else {
					$item.eq(n).find('i').stop().animate({
						width: '100%'
					},150, function(){
						if (n < Math.floor(opt.val)) {
							i = n + 1;
							graphMotion(i);
						} 
					});
				}
			}
		}
	}

	win[global].uiFloating.option = {
		ps: 'bottom',
		add: false,
		fix: true,
		callback: false
	}
	function createUiFloating(opt) {
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, opt),
			id = opt.id,
			ps = opt.ps,
			add = opt.add,
			fix = opt.fix,
			callback = opt.callback,
			$id = $('#' + id),
			$idwrap = $id.find('.ui-floating-wrap'),
			$add = $('#' + add),
			$addwrap = $add.find('.ui-floating-wrap').length ? $add.find('ui-floating-wrap') : $add,
			c = 'ui-fixed-' + ps,
			timer;

		!!fix ? $id.addClass(c) : '';

		if ($id.length) {
			clearTimeout(timer);
			timer = setTimeout(act, 300);
		}

		$(win).off('scroll.' + id).on('scroll.' + id, function(){
			if ($id.length) {
				act();
				clearTimeout(timer);
				timer = setTimeout(act, 500);
			}
		});

		function act(){
			var tt = Math.ceil($id.offset().top),
				th = Math.ceil($idwrap.outerHeight()),
				st = $(win).scrollTop(),
				wh = Math.ceil($(win).outerHeight()),
				dh = Math.ceil($(doc).outerHeight()),
				lh = (!!add) ? $add.outerHeight() : 0,
				lt = (!!add) ? dh - ($add.offset().top).toFixed(0) : 0,
				lb = 0,
				_lb;

			$idwrap.removeAttr('style');
			$id.data('fixbottom', th);

			if (!!add) {
				if ($add.data('fixbottom') === 'undefined') {
					$add.data('fixbottom', th + $addwrap.outerHeight());
				}
			}

			(!!add) ? lh = (ph + Number($add.data('fixtop')) === undefined) ? 0 : $add.data('fixtop') : '';
			(!!callback) ? callback({ id: id, scrolltop: st, boundaryline: tt - lh }) : '';
			$id.css('height', th);

			if (ps === 'top') {
				if (fix === true) {
					if(tt - lh <= st) {
						$id.removeClass(c).data('fixtop', false);
						$idwrap.removeAttr('style');
					} else {
						$id.addClass(c).data('fixtop', lh);
						$idwrap.css('top', lh);
					}
				} else {
					if(tt - lh <= st) {
						$id.addClass(c).data('fixtop', lh);
						$idwrap.css('top', lh);
					} else {
						$id.removeClass(c).data('fixtop', false);
						$idwrap.removeAttr('style');
					}
				}
			} else if (ps === 'bottom') {
				if (!!add) {
					lb = th + Number($add.data('fixbottom'));
					$id.data('fixbottom', lb);
				}
				_lb = (lb - th < 0) ? 0 : lb - th;

				if (fix === true) {
					if (tt + th + _lb - wh <= st) {
						$id.removeClass(c);
						$idwrap.removeAttr('style');
					} else {
						$id.addClass(c);
						$idwrap.css('bottom', _lb);
					}
				} else {
					if (tt + th + _lb - wh <= st) {
						
						$id.addClass(c);
						$idwrap.css('bottom', _lb);
					} else {
						$id.removeClass(c);
						$idwrap.removeAttr('style');
					}
				}
			}
		}
	}

})(jQuery, window, document);