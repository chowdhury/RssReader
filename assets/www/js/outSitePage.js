var entry = JSON.parse(sessionStorage.getItem('outSiteEntry'));

function share(){
	Oauth();
}

//listen for showImages Button
$("#showImages").live("click", function() {

//	if($("img").length==0)
//		alert('No image!');
//	else
		$("img").slideToggle();
	
});

//Listen for the outSite page to load
$("#outSitePage").live("pageshow", function(prepage) {

	//Set the title
	$("#outSitePage h1").text(entry.title);
	getHtmlByUrl(entry.link);
	
	
});

function getHtmlByUrl(url){
	$.ajax({
		url:url,
		success:function(res,code) {//����ɹ�
			//��ȡ��ҳ���ݣ������ڣ�������ҳ��Ч���ݵ�Ԫ��idΪcontentText��������磺sohu��
			//clone(true)�Ǹ���Ԫ�ؼ�Ԫ�ص��¼����޲ε�clone()��ֻ����Ԫ�أ�������Ԫ�ص��¼�  
			$("#contentText").remove();//���֮ǰ��ɾ�����У��ϴ���ӵģ���Ч�����ã���
			var contentText = $(res).find("#contentText").clone(true);
			
			var deviceWidth = $(window).width();
			var max_width=deviceWidth*0.9;
//			contentText.find('IMG').each(function(){
//				$(this).width(max_width);
//			});
			contentText.find('img').each(function(){
				$(this).width(max_width);
			});

			contentText.width(deviceWidth*0.95);
			
			contentText.appendTo($("#siteContainer"));
//			$(res).find("#contentText").clone(true).appendTo($("#siteContainer"));
			
			//ͨ�ô���������ȡ��ҳ������div
			//$(res).find("div").clone(true).appendTo($("#siteContainer"));
		},
		error:function(jqXHR,status,error) {//����ʧ��
			alert("try to use catched data!");
			
			//����ʹ�����غõ�����
//			alert(entry.fullContent);
			$("#siteContainer").html(entry.fullContent);
			
			$("#siteContainer").slideDown();
			$("#shareButton").slideUp();
		}
	}).complete(function(){
		//�����ɺ�Ĵ���
		if($("img").length==0)
			$("#showImages").slideUp();
		
		if( (window.localStorage.getItem("auto_load_images")||'off') == 'off')
			$("img").slideUp();
	});
}

//������Ȩ����
function readArgs(loc){
	var arr_args = loc.split('#');
	var args = arr_args[1];//#�ź���Ĳ���
	arr_args = args.split('&');
//	�洢access_token�� remind_in�� expires_in�� uid
	for(var index=0; index<arr_args.length; index++){
		var key_value = arr_args[index].split('=');
		window.localStorage.setItem(key_value[0],key_value[1]);
		
	}
}
function Oauth() {    
    // Set childBrowser callback to detect our oauth_callback_url
	if(window.localStorage.getItem('access_token')=='' || window.localStorage.getItem('access_token')=='undefined'){
		//��Ҫ��Ȩ
		if (typeof window.plugins.childBrowser.onLocationChange !== "function") {        	
	    	window.plugins.childBrowser.onLocationChange = function(loc){
	    		if(loc === 'https://api.weibo.com/oauth2/authorize'){
	    		}
	    		if(loc.indexOf('https://api.weibo.com/oauth2/authorize?') >= 0 ){
	    		}
	    		if(loc.indexOf('error=access_denied') >=0 ){
	    			window.plugins.childBrowser.close();
	    			return;
	    		}
	    		if(loc.indexOf('access_token') >=0 ){
	    			readArgs(loc);
	    			alert("Authorize Success!");
	    			window.plugins.childBrowser.close();
	    			//�򿪷���ҳ��
	    			sessionStorage.newsTitle = entries[selectedEntry].title;
	    			sessionStorage.newsLink = entries[selectedEntry].link ;
	    			window.location = "share.html"; 
	    			return;
	    		}
	        }; 
	    } // end if
//	    alert(typeof window.plugins.childBrowser.onLocationChange);
	    
	    window.plugins.childBrowser.onClose = function(){alert('ChileBrowser Closed'); };
	    window.plugins.childBrowser.onOpenExternal = function(){alert('onOpenExternal'); };
//	    oauth = OAuth(options);
	    var oauth_url = 'https://api.weibo.com/oauth2/authorize?client_id=2126684334&response_type=token&redirect_uri=http://mindhacks.sinaapp.com&display=mobile';
	    window.plugins.childBrowser.showWebPage(oauth_url, { showLocationBar : false }); 
	}
	else{
		//������Ȩ
		//�򿪷���ҳ��
		sessionStorage.newsTitle = entry.title;
		sessionStorage.newsLink = entry.link ;
		window.location = "share.html"; 
		return;
	}
}
