/* 보험나이계산 */
function Bohumnai(id)
{
	now = new Date(); // 현재날짜

	var y_dt;
	var m_dt;
	var d_dt;
	
	y_dt = now.getFullYear(); // 현재년도
	m_dt = now.getMonth()+1; // 현재월
	d_dt = now.getDate(); // 현재일
	
	b_year = parseInt(id.substring(0,4),10); // 대상자 생년
	b_month = parseInt(id.substring(4,6),10); // 대상자 생월
	b_day = parseInt(id.substring(6,8),10); // 대상자 생일
	
	r_year = y_dt; // 현재년도
	r_month = m_dt; // 현재월
	r_day = d_dt; // 현재일
	
	if (b_day > r_day) // 현재일보다 생일이 클경우
	{
	     switch (r_month) // 현재월에서 1을 빼고 현재일에 이전달의 일수를 더함
	     {
	          case 1 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 2 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 3 :
	               r_month = r_month - 1;
	               if ( ( r_year % 4 ) == 0 )
	                             r_day = r_day + 29;
	               else
	                             r_day = r_day + 28;
	               break;
	
	          case 4 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 5 :
	               r_month = r_month - 1;
	               r_day = r_day + 30;
	               break;
	
	          case 6 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 7 :
	               r_month = r_month - 1;
	               r_day = r_day + 30;
	               break;
	
	          case 8 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 9 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 10 :
	               r_month = r_month - 1;
	               r_day = r_day + 30;
	               break;
	
	          case 11 :
	               r_month = r_month - 1;
	               r_day = r_day + 31;
	               break;
	
	          case 12 :
	               r_month = r_month - 1;
	               r_day = r_day + 30;
	               break;
	     }
	}

	x_day = r_day - b_day; // (계산된)현재일에서 생일을 뺌
	
	if ( b_month > r_month ) // 현재 월보다 생월이 클 경우
	{
		// 현재년도에서 1을 빼고 현재월에 12를 더함
	     r_month = r_month + 12;
	     r_year = r_year - 1;
	}
	
	x_month = r_month - b_month; // (계산된)현재월에서 생월을 뺌
	x_year = r_year - b_year; // (계산된)현재년도에서 생년을 뺌
	
	if ( x_month > 5 ) // 월을 뺀 값이 5보다 큰경우 년도를 뺀 값에 1을 더함
	     nai = x_year + 1;
	else
	     nai = x_year;
	
	return nai;
}

/* 생년 계산 (YYYY)*/
function calcBtYYYY(resiNo){
	var nYear, bYear;
	var today =  new Date();
	nYear = today.getFullYear();
	
	if(parseInt(resiNo.substr(5,1),10)<3){
		bYear = 1900 + parseInt(resiNo.substring(0,2),10);
	}else{
		bYear = 2000 + parseInt(resiNo.substring(0,2),10);
	}
	return bYear.toString();
}

/* 금액 텍스트 변환 */
function amtTextVal(amt){
	var AmtVal="";
	if(amt.length > 4){	//만단위 이상
		amt = amt.substr(0,amt.length-4);
		AmtVal = (amt.length >= 5? Number(amt.substr(0,amt.length-4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') + "억":"")
		+(Number(amt.substring(amt.length,amt.length-4)) > 0?Number(amt.substring(amt.length,amt.length-4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') + "만":"");
	}else{
		AmtVal = amt.replace(/\B(?=(\d{3})+(?!\d))/g,',');
	}
	
	amtVal = AmtVal + "원";
	return amtVal;
}

/* 이메일 도메인 자동완성 */
function autoCompleteEmail(wrap, option) {
	// setting
	var domainList = [ // 기본 도메인 리스트
		'daum.net',
		'gmail.com',
		'hanmail.net',
		'naver.com',
		'nate.com',
	]
	if (typeof(option) === 'object'){
		if (!!option.domainList) {
			domainList = option.domainList;
		}
	}

	// run point
	function extractLast( val ) {
		if (val.indexOf("@")!=-1){
			var tmp = val.split("@")
				, _id = val.substring(0, val.lastIndexOf("@"));
			if (tmp[tmp.length-1] === '') {
					// 이 때 나타나야함
					return {
						id: _id
					};
			} else {
					return {
						id: _id,
						domain: tmp[tmp.length-1]
					};
				}
		}
		$('.ui-menu').hide();
		return "";
	}

	// bind
	$(wrap).find('.ui-autocomplete-inp')
		.bind( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
								$(this).data( "autocomplete" ).menu.active ) {
						event.preventDefault();
				}
		})
		.autocomplete({
				minLength: 1,
				source: function( request, response ) {
						var mail = extractLast(request.term).domain
							, id = extractLast(request.term).id;

							if (!!id) { // @ 쳤을 시
								if (!!mail){  // @ 다음 문자열 있을 시
									var matcher = new RegExp( "^" + mail, "i" );
									response($.grep(domainList, function(item){
											return matcher.test(item);
									}));
								} else { // @만 쳤을 시
									response(domainList);
								}
								$('.ui-menu-item').each(function(_idx, item){
										var _text = $(item).find('a').html()
												, _html = ''
												, _point = !!mail ? id + '@' + mail : id + '@';
												
										_html = '<b>' + _point + '</b>';
										_html += !!mail ? _text.split(mail)[1] : _text;
										$(item).find('a').html(_html);
								})
						} else {
							return;
						}
					},
				focus: function() {
						// prevent value inserted on focus
						return false;
				},
				appendTo: wrap,
				select: function( event, ui ) {
						var terms = this.value.split(", ");
						// remove the current input
						var _id = this.value.substring(0, this.value.lastIndexOf("@"));
						terms.pop();
						// add the selected item
						terms.push( _id + "@" + ui.item.value );
						// add placeholder to get the comma-and-space at the end

						this.value = terms.join("");
						return false;
				}
		});
}

// popup load by ajax
function openPopup(id, callback){
	if (!$('#'+id).length) {
		loadPopup(id);
	} else {
		$('#'+id).insertAfter($('.ui-modal').last());
	}
	
	$plugins.uiModalOpen({
		id:id,
		full:false,
		callback: function(v){
			console.log('open :', v );
			!!callback && callback();
		}
	});

	function loadPopup(id){
		$.ajax({
			type: 'GET',
			url: './'+id+'.html',
			cache: false,
			async: false,
			headers: {
				"cache-control" : "no-cache", 
				"pragma" : "no-cache"
			},
			error: function(request, status, err) {
				console.log("error");
			},
			success: function(v) {
				$('.smilecare').append($(v).find('#'+id));
			}
		});
	}
}

function fixedBanner(el) {
	var $ts = $(el)
		, $inner = $ts.find('.floating-inner')
		, tsH
		, tsY = $ts.offset().top
		, innerH
		, docY
		, _flag = false;

	!$ts.hasClass('floating') && $ts.addClass('floating');
	innerH = $inner.outerHeight();
	$inner.css('top', -innerH);
	$ts.removeClass('floating');
	tsH = $ts.outerHeight();
	$ts.css('height', tsH);
	
	if ($('html').prop('scrollTop') > tsY + tsH) {
		$ts.addClass('floating');
		$inner.css({top:0, opacity:1});
	}

	$(document)
	.off('scroll.fixedBanner')
	.on('scroll.fixedBanner', function(){
		docY = $('html').prop('scrollTop');
		if (docY > tsY + tsH) {
			if (!_flag && !$ts.hasClass('floating')) {
				$ts.addClass('floating');
				_flag = true;
				$inner.css('opacity', 0).animate({
					top: 0,
					opacity: 1
				}, 250, function(){
					_flag = false;
				})
			}
		} else {
			$ts.removeClass('floating');
			$inner.css({top: '-'+innerH+'px'});
		}
	});
	
}

var slidePage = {
	init: function(id, isMobile) {
		var $wrap = $('#'+id)
			, $panelWrap = $wrap.find('.apply-items')
			, $panel = $wrap.find('.apply-inner')
			
			, _w, _h;

		if (!isMobile) {
			_w = 720; _h = 350;
		} else {
			_w = $(window).outerWidth() - 50; _h = 350;
		}
		$panelWrap.css({width: _w*$panel.length}); // _w: apply-inner의 width
		$panel.css({width: _w, height: _h}); // _h: apply-inner의 height

		if (isMobile) {
			$(window).on('resize', function(){
				if ($(window).outerHeight() < 580) {
					$panel.css('height', $(window).outerHeight() - 230);
					console.log($(window).outerHeight() - 230);
				} else {
					$panel.css('height', _h);
				}
			}) 
		}
	},
	goSlidePage: function(v, callback) {
		var $wrap = $('.apply-wrap')
			, $panel = $wrap.find('.apply-inner')
			, $panelWrap = $wrap.find('.apply-items')
			, $onPanel = $('.apply-inner.on')
			
			, num = v;

		if (!!$panel.eq(num-1).attr('data-title') && !!$wrap.closest('.ui-modal').length) {
			var $modalHeader = $wrap.closest('.ui-modal').find('.ui-modal-head h1');
			$modalHeader.text($panel.eq(num-1).attr('data-title'));
		}
			
		$panel.eq(num-1).addClass('on');
		$panelWrap.animate({
			marginLeft: -$panel.outerWidth()*(num-1)
		}, 400, function(){
			$onPanel.removeClass('on');
			$panelWrap.css('padding-left', $panel.outerWidth()*(num-1));
			!!callback && callback();
		});
	}
}

var sldTerms
	, isModalLoaded;
function initTermsSlider() {
	// slider in terms popup
	var $btnAgree = $('#btnAgree')
		, $btnDisagree = $('#btnDisagree')
		, $modalHeader = $('[id*="ET-010201"] .ui-modal-head h1');

	if (!sldTerms) {
		// init slide
		sldTerms = $('#sldTerms .slider').bxSlider({
			slideWidth: 600,
			speed: 200,
			infiniteLoop: false,
			hideControlOnEnd: true,
			controls: false,
			onBeforeSlide: function(newIdx, leng, $el) {
				$(sldTerms).css('height', $el.outerHeight());
				$('.ctab_cont').prop('scrollTop',0);
			},
			onAfterSlide: function (newIdx, leng, $el){
				// after slide change
				$('[id*="ET-010201"] .disagree, [id*="ET-010201"] .agree').removeClass('active'); // 하단 '동의/미동의' 버튼 초기화

				$('.inner-terms').removeClass('current');
				$el.addClass('current');
				

				$modalHeader.text($el.attr('data-title'));
				$btnAgree.attr('data-step', newIdx+1);
				$btnDisagree.attr('data-step', newIdx+1);
				if (newIdx === 0) {
					$('.slider-btn.btn-prev').prop('disabled', true);
				} else if (newIdx === leng - 1){
					$('.slider-btn.btn-next').prop('disabled', true);
				} else {
					$('.slider-btn').prop('disabled', false);
				}
			},
		});
		$('[id*="ET-010201"] .slider-btn').on('click', function(){
			var isNext = $(this).hasClass('btn-next') ? true : false;

			if (isNext){
				agreeCheck(sldTerms.getCurrentSlide()+1, false);
				// sldTerms.goToNextSlide();
			} else {
				sldTerms.goToPreviousSlide();
			}
		})
	} else {
		isModalLoaded = setInterval(function(){
			if (!!$plugins.uiModalLoaded) {
				setTimeout(function(){
					sldTerms.goToSlide(0);
					sldTerms.reloadShow();
				}, 200);
				$modalHeader.text($('.inner-terms').eq(0).attr('data-title'));
				clearInterval(isModalLoaded)
				return;
			}
		}, 100);
	}
}

// validation check in terms slider
var arrTermsMsg;
function agreeCheck(ts, v) {
	var $ts = typeof(ts) === 'number' ? ts : $(ts)
		, isTrue = v
		, stepIdx = typeof(ts) === 'number' ? ts-1 : parseInt($ts.attr('data-step'))-1;

	var arrTermsMsg = [
		// 첫번째 약관
		{
			agree: function() {
				sldTerms.goToNextSlide();
			},
			disagree: function(){
				alert('케어 구독서비스 신청을 위해 서비스 이용 약관에 동의해주세요.');
			}
		},
		// 두번째 약관
		{
			agree: function() {
				sldTerms.goToNextSlide();
			},
			disagree: function(){
				alert('동의는 거부하실 수 있고, 동의를 거부하실 경우 서비스 가입이 제한됩니다.');
			}
		},
		// 세번째 약관
		{
			agree: function() {
				sldTerms.goToNextSlide();
			},
			disagree: function(){
				alert('동의는 거부하실 수 있고, 동의를 거부하실 경우 서비스 가입이 제한됩니다.');
			}
		},
		// 네번째 약관
		{
			agree: function() {
				sldTerms.goToNextSlide();
			},
			disagree: function(){
				alert('가입이벤트는 별도의 이벤트 참여신청 없이도 해당 동의에 체크하신 후 자동으로 이벤트에 응모됩니다. 본 동의는 서비스 이용에 필수는 아니고 거부하실 수 있으며, 동의를 거부하실 경우에는 가입 이벤트에 당첨되더라도 경품발송이 제한됩니다.');
				sldTerms.goToNextSlide();
			}
		},
		// 다섯번째 약관
		{
			agree: finishSlider,
			disagree: function(){
				alert('본 동의 서비스 이용에 필수적이지 않으며 동의를 거부할 수 있습니다. 만약 동의 했더라도 원치 않는 정보를 수신한 경우 이를 수신거부 할 수 있습니다.');
				finishSlider();
			},
		}
	]

	function finishSlider() {
		if (!$('#ET-010201_mo').length) { // in PC
			$plugins.uiModalClose({
				id:'ET-010201', 
				callback:function(){setTimeout(function(){
					slidePage.goSlidePage(2, function(){
						$('#ET-010101 .btn-base.n1').hide();
						$('#ET-010101 .btn-base.n2').show();
						$('#ET-010101 .step-list li').removeClass('active').eq(1).addClass('active');
						$('#ET-010101 .step-list li').eq(0).addClass('done');
					})
				}, 250)}
			});
		} else { // in Mobile
			$plugins.uiModalClose({
				id:'ET-010201_mo', 
				callback:function(){setTimeout(function(){
					slidePage.goSlidePage(2, function(){
						$('#ET-010101_mo .btn-base.n1').hide();
						$('#ET-010101_mo .btn-base.n2').show();
						$('#ET-010101_mo .step-list li').removeClass('active').eq(1).addClass('active');
						$('#ET-010101_mo .step-list li').eq(0).addClass('done');
					})
				}, 250)}
			});
		}
	}
	if (!!arrTermsMsg[stepIdx]){
		if (isTrue){
			arrTermsMsg[stepIdx].agree();
		} else {
			arrTermsMsg[stepIdx].disagree();
		}
	}
	typeof(ts) !== 'number' && $ts.addClass('active').siblings().removeClass('active');
}
