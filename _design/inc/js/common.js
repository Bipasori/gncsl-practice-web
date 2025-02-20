/* *******************************************************
 * filename : common.js
 * description : 전체적으로 사용되는 JS
 * Update : 2020-11-25
******************************************************** */

var laptopWidth = 1366;
var tabletWidth = 1220; // 헤더가 변경되는 시점
var mobileWidth = 800;

$(window).load(function  () {
	// toAnchorParameter("anchor");	/* 주소~?anchor=content  */ 
	aosInit ();	// 사용안할시 삭제
});
$(document).ready(function  () {
	/* ************************
	* Func : 브라우저 체크 및 기기체크
	* isMobile() 필요
	************************ */
	if ( isMobile() ) {
		$("body").addClass("is-mobile").addClass(detectOS()+"-os");
	}else {
		$("body").addClass("is-pc").addClass(detectBrowser()+"-browser");
	}
		
	/* ************************
	* Func : 드롭메뉴 공통
	* getWindowWidth () 필요
	************************ */
	$(".cm-drop-menu-box-JS").each(function  () {
		var $dropBox = $(this);
		var $dropOpenBtn = $(this).find(".cm-drop-open-btn-JS");
		var $dropList = $(this).find(".cm-drop-list-JS");
		var eventState = $dropBox.data("drop-event");
		
		if ( eventState === "click" ) {
			$dropOpenBtn.click(function  () {
				$dropList.slideToggle(500);
				$dropBox.toggleClass("open");
				$dropBox.on("mouseleave", function  () {
					dropClose ();
				});
				return false;
			});
			$("body").click(function  () {
				dropClose();
			});
		}else if ( eventState === "hover" ) {
			$dropBox.hover(function  () {
				$dropList.slideDown(500);
				$dropBox.addClass("open");
			},function  () {
				dropClose ();
			});
		}
		function dropClose () {
			if ( $dropBox.data("drop-width") ) {
				if ( getWindowWidth () < $dropBox.data("drop-width")+1 ) {
					$dropList.slideUp(500);
					$dropBox.removeClass("open");
				}
			}else {
				$dropList.slideUp(500);
				$dropBox.removeClass("open");
			}
		}
		$(window).resize(function  () {
			if ( getWindowWidth () > $dropBox.data("drop-width") ) {
				$dropList.removeAttr("style");
			}else {
				$dropList.hide();
			}
		});
	});

	/* ************************
	* Func : 탭 메뉴 공통 사용
	* getWindowWidth () 필요
	************************ */
	$(".cm-tab-container-JS").each(function  () {
		var $cmTabList = $(this).find(".cm-tab-list-JS");
		var $cmTabListli = $cmTabList.find("li");
		var $cmConWrapper = $(this).children(".cm-tab-content-wrapper-JS");
		var $cmContent = $cmConWrapper.children();
		
		
		// 탭 영역 숨기고 selected 클래스가 있는 영역만 보이게
		var $selectCon = $cmTabList.find("li.selected").find("a").attr("href");
		var selectTxt = $cmTabList.find("li.selected").find("em").text();
		$cmContent.hide();
		$($selectCon).show();

		$cmTabListli.children("a").click(function  () {
			if ( !$(this).parent().hasClass("selected")) {
				var visibleCon = $(this).attr("href");
				$cmTabListli.removeClass("selected");
				$(this).parent("li").addClass("selected");
				$cmContent.hide();
				$(visibleCon).fadeIn();
			}
			return false;
		});

		// 모바일 버튼이 있을때 추가
		var $cmTabMobileBtn = $(this).find(".cm-tab-select-btn-JS");
		if ($.exists($cmTabMobileBtn)) {
			$cmTabMobileBtn.find("span").text(selectTxt);
			// Mobile Btn Click
			$cmTabMobileBtn.click(function  () {
				$(this).toggleClass("open").siblings().slideToggle();
				return false;
			});

			// Mobile List Click
			$cmTabListli.children("a").click(function  () {
				$cmTabMobileBtn.find("span").text($(this).find("em").text());
				tabListClose();
			});
			$("body").click(function  () {
				tabListClose();
			});
			function tabListClose () {
				if ( getWindowWidth () < 801 ) {
					$cmTabMobileBtn.removeClass("open").siblings().slideUp();
				}
			}
			$(window).resize(function  () {
				if ( getWindowWidth () > 800 ) {
					$cmTabMobileBtn.siblings().removeAttr("style");
				}else {
					$cmTabMobileBtn.siblings().hide()//.css("display","none");
				}
			});
		}
	});

	/* ************************
	* Func : 단어 Split 사용 
	* Splitting.js 필요
	************************ */	
	/* -------- Split :: 기본 -------- */ 
	if ($.exists('.cm-word-split')) {
		var $mainTxt = ('.cm-word-split');
		// 텍스트 Split
		splittingText($mainTxt);
		// Split 텍스트에 delay주기	
		$($mainTxt).each(function  () {
			splittingTextDelay($(this),$(this).data("speed"),$(this).data("speed-delay"));
		});
	}
	/* -------- Split :: Splitting Plugin -------- */ 
	if ($.exists('.cm-word-split-JS')) {
		Splitting();
		var $splittingTxt = $(".cm-word-split-JS");
		$($splittingTxt).each(function  () {
			splittingTextDelay($(this),$(this).data("speed"),$(this).data("speed-delay"));
		});
	}

	/* ************************
	* Func : 상단 :: 모바일버전에서 헤더 FIXED
	* getWindowWidth (), objectFixed() 필요
	************************ */	
	if ($.exists('#header')) {
		$(window).scroll(function  () {
			if ( getWindowWidth () < (tabletWidth-1) ) {
				objectFixed($("#header"), 0, "top-fixed");
			}
		});
		$(window).resize(function  () {
			if ( getWindowWidth () > tabletWidth ) {
				$("#header").removeClass("top-fixed");
			}
		});
	}

	/* ************************
	* Func : 상단 :: 검색 toggle
	************************ */	
	$(".header-search-box").each(function  () {
		var $searchBox = $(this);
		var $openBtn = $(this).find(".header-search-open-btn");
		var $closeBtn = $(this).find(".header-search-close-btn");
		
		$openBtn.click(function  () {
			$searchBox.addClass("open");
		});
		$closeBtn.click(function  () {
			$searchBox.removeClass("open");
		});
	});

	/* ************************
	* Func : 상단 :: 사이트맵 스타일 02
	************************ */
	if ($.exists('.sitemap-open-btn')) {
		var sitemapState = false;
		var $sitemapOpenbtn = $(".sitemap-open-btn");
		
		// 클릭이벤트
		var sitemapState = false;
		var $sitemapOpenbtn = $(".sitemap-open-btn");
		
		//  Toggle
		$(".sitemap-open-btn").click(function  () {
			if ( ! sitemapState ) {
				openSitemap();
			}else {
				closeSitemap();
			}
			if ( $(this).data("event") === "toggle") {
				sitemapState = !sitemapState;
			}
		});
		// Close Button
		$(".sitemap-close-btn").click(function  () {
			sitemapState = !sitemapState;
			closeSitemap();
		});

		function openSitemap () {
			$("#sitemapContent").addClass("open");
			if ( $sitemapOpenbtn.data("event") === "toggle") {
				$sitemapOpenbtn.addClass("active");
			}
			$("body").css({'height':$(window).height(), 'overflow':'hidden'});
			if ($.exists('#fullpage')) {
				$.fn.fullpage.setAllowScrolling(false);
				$.fn.fullpage.setKeyboardScrolling(false);
			}
		}
		function closeSitemap () {
			$("#sitemapContent").removeClass("open");
			$sitemapOpenbtn.removeClass("active");
			$("body").css({'height':'auto', 'overflow':'auto'});
			if ($.exists('#fullpage')) {
				$.fn.fullpage.setAllowScrolling(true);
				$.fn.fullpage.setKeyboardScrolling(true);
			}
		}
	}

	/* ************************
	* Func : 하단 :: top버튼
	* moveScrollTop (), objectFixed() 필요
	************************ */
	$(".to-top-btn").each(function  () {
		// top버튼 나오게 (필요한 경우에만 넣으세요)
		if ( $(this).length > 0 ) {
			$(window).scroll(function  () {
				objectFixed($(".to-top-btn"), 0, "bottom-fixed");
			});
		}
		// top버튼 클릭
		$(this).on("click",function  () {
			if ($.exists('#fullpage')) {
				$.fn.fullpage.moveTo(1);
			}else {
				moveScrollTop(0, 300);
			}
			
			return false;
		});
	});
	

	/* ************************
	* Func : 하단 :: 파트너사 리스트
	************************ */
	if ($.exists('.footer-partner-list')) {
		$('.footer-partner-list').slick({
			slidesToShow: 7,
			slidesToScroll: 1,
			arrows: true,
			fade: false,
			dots:false,
			autoplay: true,
			speed:500,
			infinite:true,
			autoplaySpeed: 3000,
			easing: 'easeInOutQuint',
			pauseOnHover:false,
			prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Prev" tabindex="0" role="button"><i class="xi-angle-left-min"></i></button>',
			nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"><i class="xi-angle-right-min"></i></button>',
			responsive: [
						{
						  breakpoint: 1367,
						  settings: {
							slidesToShow: 5
						  }
						},
						{
						  breakpoint: 1025,
						  settings: {
							slidesToShow: 3
						  }
						}
					  ]
		});
	}

	/* *********************** 상단 언어 목록 ************************ */
    $(".cm-drop-menu-box").each(function  () {
        var $dropBox = $(this);
        var $dropOpenBtn = $(this).children(".cm-drop-open-btn");
        var $dropList = $(this).children(".cm-drop-list");
        var eventState = $dropBox.data("drop-event");
         
        if ( eventState === "click" ) {
            $dropOpenBtn.click(function  () {
                $dropList.slideToggle(500);
                $dropBox.toggleClass("open");
                $dropBox.on("mouseleave", function  () {
                    dropClose ();
                });
                return false;
            });
            $("body").click(function  () {
                dropClose();
            });
        }else if ( eventState === "hover" ) {
            $dropBox.hover(function  () {
                $dropList.slideDown(500);
                $dropBox.addClass("open");
            },function  () {
                dropClose ();
            });
        }
         
        function dropClose () {
            if ( $dropBox.data("drop-width") ) {
                if ( getWindowWidth () < $dropBox.data("drop-width")+1 ) {
                    $dropList.slideUp(500);
                    $dropBox.removeClass("open");
                }
            }else {
                $dropList.slideUp(500);
                $dropBox.removeClass("open");
            }
             
        }
        $(window).resize(function  () {
            if ( getWindowWidth () > $dropBox.data("drop-width") ) {
                $dropList.show();
            }else {
                $dropList.hide();
            }
        });
    });

	/* *********************** 사이트맵 ************************ */
	$(".sitemap-open-btn").click( function () {
		$("#siteMapCon").addClass("open");
	});
	$(".sitemap-close-btn").click( function () {
		$("#siteMapCon").removeClass("open");
	});

	/* *********************** file upload Custom ************************ */
	$(".file-custom-box").each(function  () {
		var fileTarget = $(this).find(".upload-hidden");
		
		fileTarget.on('change', function(){
			if(window.FileReader){
				var filename = $(this)[0].files[0].name;
			} else {
				var filename = $(this).val().split('/').pop().split('\\').pop();
			}
		 
			$(this).siblings('.upload-name').val(filename);
		});
	});
});