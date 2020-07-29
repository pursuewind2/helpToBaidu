// 获取url参数
function getQueryValue(key){
	var query = window.location.search.substring(1);
	var pairs = query.split("&");
	for(var i = 0; i < pairs.length; i++){
		var pair = pairs[i].split("=");
		if(pair[0] == key) return(pair[1]);
	}
	return;
}

// 判断是否演示
function checkShow(){
	word = getQueryValue("wd");
	if(word){
		word = decodeURI(word);
		document.title = word;	// 修改网页标题
		$("#tips").html("<span>1.打开百度，找到输入框</span>");
		initMove();
	}
}

// 生成演示页面网址
function generatePage(){
	searchWord = $("#text").val();
	if(searchWord){
		url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?wd=";
		longUrl = url + encodeURI(searchWord);
		$("#generater").css("display", "block");
		$("#longUrl").text(longUrl);
		generateShortUrl();
	}

}

// 生成短网址
function generateShortUrl(){
	// 短网址1
	$.ajax({
		url: "https://7dwz.cc/api" ,
		type: "POST",
		data: {url: longUrl},
		dataType: "json",
		success: function(data){
			var shorturl = data.dwz;
			$("#shortUrl1").text("①" + shorturl);
			$("#gTitle2, #shortUrl1").css("display", "block");
		}
	});
	
	// 短网址2
	$.ajax({
		url: "https://api.uomg.com/api/long2dwz?dwzapi=mrwso&url=" + url + encodeURI(encodeURI(searchWord)) ,
		dataType: "json",
		success: function(data){
			var shorturl = data.ae_url;
			$("#shortUrl2").text("②" + shorturl);
			$("#gTitle2, #shortUrl2").css("display", "block");
		}
	});
}


//*************以下部分为移动、打字、跳转部分代码*************

// 获取目标位置及步宽
function setTarget(id){
	toTop = $("#"+id).offset().top + 30;
	toLeft = $("#"+id).offset().left + 20;
	eachStepX = (toLeft - nowLeft)/100;
	eachStepY = (toTop - nowTop)/100;
}

// 按照步宽移动一次
function moveTo(){
	if(nowTop < toTop) nowTop+= eachStepY;
	if(nowLeft < toLeft) nowLeft+= eachStepX;
	$("#mouse").css("top", nowTop+"px");
	$("#mouse").css("left", nowLeft+"px");
}

// 初始化
function initMove(){
	nowTop = $("#mouse").offset().top;
	nowLeft = $("#mouse").offset().left;
	$("#mouse").css("display", "block");
	step1();
}

// 第一步：移动到搜索框
function step1(){
	setTarget("text");
	move1 = setInterval(function(){
		moveTo();
		if(nowLeft >= toLeft && nowTop >= toTop){
			clearInterval(move1);
			step2();
		}
	}, 10);
}

// 第二步：到达搜索框，开始打字特效
function step2(){
	$("#tips").html("<span>2.输入搜索关键词</span>");
	$("#text").focus();	// 输入框获取焦点
	new TypeIt("#text", {
	  strings: word,
	  speed: 100,
	  waitUntilVisible: true
	}).go().exec(step3);
}

// 第三步：打完字后，移动到搜索按钮 
function step3(){
	$("#tips").html("<span>3.点击搜索按钮</span>");
	setTarget("button");
	move3 = setInterval(function(){
		moveTo();
		if(nowLeft >= toLeft && nowTop >= toTop){
			clearInterval(move3);
			step4();
		}
	}, 10);
}

// 第四步：到达搜索按钮，跳转
function step4(){
	$("#tips").css("font-weight","bold");
	$("#tips").html("<span>这对你来说就这么困难吗？</span>");
	setTimeout(function(){
		window.location.href="https://www.baidu.com/s?wd="+word;
	}, 1000); 
}
