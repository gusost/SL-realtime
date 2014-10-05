// GG. BitCoin donations
/*
<script src="http://coinwidget.com/widget/coin.js"></script>

if(typeof CoinWidgetComCounter!='number')var CoinWidgetComCounter=0;if(typeof CoinWidgetCom!='object')var CoinWidgetCom={source:'http://coinwidget.com/widget/',config:[],go:function(config){config=CoinWidgetCom.validate(config);CoinWidgetCom.config[CoinWidgetComCounter]=config;CoinWidgetCom.loader.jquery();document.write('<span data-coinwidget-instance="'+CoinWidgetComCounter+'" class="COINWIDGETCOM_CONTAINER"></span>');CoinWidgetComCounter++},validate:function(config){var $accepted=[];$accepted['currencies']=['bitcoin','litecoin'];$accepted['counters']=['count','amount','hide'];$accepted['alignment']=['al','ac','ar','bl','bc','br'];if(!config.currency||!CoinWidgetCom.in_array(config.currency,$accepted['currencies']))config.currency='bitcoin';if(!config.counter||!CoinWidgetCom.in_array(config.counter,$accepted['counters']))config.counter='count';if(!config.alignment||!CoinWidgetCom.in_array(config.alignment,$accepted['alignment']))config.alignment='bl';if(typeof config.qrcode!='boolean')config.qrcode=true;if(typeof config.auto_show!='boolean')config.auto_show=false;if(!config.wallet_address)config.wallet_address='My '+config.currency+' wallet_address is missing!';if(!config.lbl_button)config.lbl_button='Donate';if(!config.lbl_address)config.lbl_address='My Bitcoin Address:';if(!config.lbl_count)config.lbl_count='Donation';if(!config.lbl_amount)config.lbl_amount='BTC';if(typeof config.decimals!='number'||config.decimals<0||config.decimals>10)config.decimals=4;return config},init:function(){CoinWidgetCom.loader.stylesheet();jQuery(window).resize(function(){CoinWidgetCom.window_resize()});setTimeout(function(){CoinWidgetCom.build()},800)},build:function(){$containers=jQuery("span[data-coinwidget-instance]");$containers.each(function(i,v){$config=CoinWidgetCom.config[jQuery(this).attr('data-coinwidget-instance')];$counter=$config.counter=='hide'?'':('<span><img src="'+CoinWidgetCom.source+'icon_loading.gif" width="13" height="13" /></span>');$button='<a class="COINWIDGETCOM_BUTTON_'+$config.currency.toUpperCase()+'" href="#"><img src="'+CoinWidgetCom.source+'icon_'+$config.currency+'.png" /><span>'+$config.lbl_button+'</span></a>'+$counter;jQuery(this).html($button);jQuery(this).find('> a').unbind('click').click(function(e){e.preventDefault();CoinWidgetCom.show(this)})});CoinWidgetCom.counters()},window_resize:function(){jQuery.each(CoinWidgetCom.config,function(i,v){CoinWidgetCom.window_position(i)})},window_position:function($instance){$config=CoinWidgetCom.config[$instance];coin_window="#COINWIDGETCOM_WINDOW_"+$instance;obj="span[data-coinwidget-instance='"+$instance+"'] > a";$pos=jQuery(obj).offset();switch($config.alignment){default:case'al':$top=$pos.top-jQuery(coin_window).outerHeight()-10;$left=$pos.left;break;case'ac':$top=$pos.top-jQuery(coin_window).outerHeight()-10;$left=$pos.left+(jQuery(obj).outerWidth()/2)-(jQuery(coin_window).outerWidth()/2);break;case'ar':$top=$pos.top-jQuery(coin_window).outerHeight()-10;$left=$pos.left+jQuery(obj).outerWidth()-jQuery(coin_window).outerWidth();break;case'bl':$top=$pos.top+jQuery(obj).outerHeight()+10;$left=$pos.left;break;case'bc':$top=$pos.top+jQuery(obj).outerHeight()+10;$left=$pos.left+(jQuery(obj).outerWidth()/2)-(jQuery(coin_window).outerWidth()/2);break;case'br':$top=$pos.top+jQuery(obj).outerHeight()+10;$left=$pos.left+jQuery(obj).outerWidth()-jQuery(coin_window).outerWidth();break}if(jQuery(coin_window).is(':visible')){jQuery(coin_window).stop().animate({'z-index':99999999999,'top':$top,'left':$left},150)}else{jQuery(coin_window).stop().css({'z-index':99999999998,'top':$top,'left':$left})}},counter:[],counters:function(){$addresses=[];jQuery.each(CoinWidgetCom.config,function(i,v){$instance=i;$config=v;if($config.counter!='hide')$addresses.push($instance+'_'+$config.currency+'_'+$config.wallet_address);else{if($config.auto_show)jQuery("span[data-coinwidget-instance='"+i+"']").find('> a').click()}});if($addresses.length){CoinWidgetCom.loader.script({id:'COINWIDGETCOM_INFO'+Math.random(),source:(CoinWidgetCom.source+'lookup.php?data='+$addresses.join('|')),callback:function(){if(typeof COINWIDGETCOM_DATA=='object'){CoinWidgetCom.counter=COINWIDGETCOM_DATA;jQuery.each(CoinWidgetCom.counter,function(i,v){$config=CoinWidgetCom.config[i];if(!v.count||v==null)v={count:0,amount:0};jQuery("span[data-coinwidget-instance='"+i+"']").find('> span').html($config.counter=='count'?v.count:(v.amount.toFixed($config.decimals)+' '+$config.lbl_amount));if($config.auto_show){jQuery("span[data-coinwidget-instance='"+i+"']").find('> a').click()}})}if(jQuery("span[data-coinwidget-instance] > span img").length>0){setTimeout(function(){CoinWidgetCom.counters()},2500)}}})}},show:function(obj){$instance=jQuery(obj).parent().attr('data-coinwidget-instance');$config=CoinWidgetCom.config[$instance];coin_window="#COINWIDGETCOM_WINDOW_"+$instance;jQuery(".COINWIDGETCOM_WINDOW").css({'z-index':99999999998});if(!jQuery(coin_window).length){$sel=!navigator.userAgent.match(/iPhone/i)?'onclick="this.select();"':'onclick="prompt(\'Select all and copy:\',\''+$config.wallet_address+'\');"';$html=''+'<label>'+$config.lbl_address+'</label>'+'<input type="text" readonly '+$sel+'  value="'+$config.wallet_address+'" />'+'<a class="COINWIDGETCOM_CREDITS" href="http://coinwidget.com/" target="_blank">CoinWidget.com</a>'+'<a class="COINWIDGETCOM_WALLETURI" href="'+$config.currency.toLowerCase()+':'+$config.wallet_address+'" target="_blank" title="Click here to send this address to your wallet (if your wallet is not compatible you will get an empty page, close the white screen and copy the address by hand)" ><img src="'+CoinWidgetCom.source+'icon_wallet.png" /></a>'+'<a class="COINWIDGETCOM_CLOSER" href="javascript:;" onclick="CoinWidgetCom.hide('+$instance+');" title="Close this window">x</a>'+'<img class="COINWIDGET_INPUT_ICON" src="'+CoinWidgetCom.source+'icon_'+$config.currency+'.png" width="16" height="16" title="This is a '+$config.currency+' wallet address." />';if($config.counter!='hide'){$html+='<span class="COINWIDGETCOM_COUNT">0<small>'+$config.lbl_count+'</small></span>'+'<span class="COINWIDGETCOM_AMOUNT end">0.00<small>'+$config.lbl_amount+'</small></span>'}if($config.qrcode){$html+='<img class="COINWIDGETCOM_QRCODE" data-coinwidget-instance="'+$instance+'" src="'+CoinWidgetCom.source+'icon_qrcode.png" width="16" height="16" />'+'<img class="COINWIDGETCOM_QRCODE_LARGE" src="'+CoinWidgetCom.source+'icon_qrcode.png" width="111" height="111" />'}var $div=jQuery('<div></div>');jQuery('body').append($div);$div.attr({'id':'COINWIDGETCOM_WINDOW_'+$instance}).addClass('COINWIDGETCOM_WINDOW COINWIDGETCOM_WINDOW_'+$config.currency.toUpperCase()+' COINWIDGETCOM_WINDOW_'+$config.alignment.toUpperCase()).html($html).unbind('click').bind('click',function(){jQuery(".COINWIDGETCOM_WINDOW").css({'z-index':99999999998});jQuery(this).css({'z-index':99999999999})});if($config.qrcode){jQuery(coin_window).find('.COINWIDGETCOM_QRCODE').bind('mouseenter click',function(){$config=CoinWidgetCom.config[jQuery(this).attr('data-coinwidget-instance')];$lrg=jQuery(this).parent().find('.COINWIDGETCOM_QRCODE_LARGE');if($lrg.is(':visible')){$lrg.hide();return}$lrg.attr({src:CoinWidgetCom.source+'qr/?address='+$config.wallet_address}).show()}).bind('mouseleave',function(){$lrg=jQuery(this).parent().find('.COINWIDGETCOM_QRCODE_LARGE');$lrg.hide()})}}else{if(jQuery(coin_window).is(':visible')){CoinWidgetCom.hide($instance);return}}CoinWidgetCom.window_position($instance);jQuery(coin_window).show();$pos=jQuery(coin_window).find('input').position();jQuery(coin_window).find('img.COINWIDGET_INPUT_ICON').css({'top':$pos.top+3,'left':$pos.left+3});jQuery(coin_window).find('.COINWIDGETCOM_WALLETURI').css({'top':$pos.top+3,'left':$pos.left+jQuery(coin_window).find('input').outerWidth()+3});if($config.counter!='hide'){$counters=CoinWidgetCom.counter[$instance];if($counters==null){$counters={count:0,amount:0}}if($counters.count==null)$counters.count=0;if($counters.amount==null)$counters.amount=0;jQuery(coin_window).find('.COINWIDGETCOM_COUNT').html($counters.count+'<small>'+$config.lbl_count+'</small>');jQuery(coin_window).find('.COINWIDGETCOM_AMOUNT').html($counters.amount.toFixed($config.decimals)+'<small>'+$config.lbl_amount+'</small>')}if(typeof $config.onShow=='function')$config.onShow()},hide:function($instance){$config=CoinWidgetCom.config[$instance];coin_window="#COINWIDGETCOM_WINDOW_"+$instance;jQuery(coin_window).fadeOut();if(typeof $config.onHide=='function'){$config.onHide()}},in_array:function(needle,haystack){for(i=0;i<haystack.length;i++){if(haystack[i]==needle){return true}}return false},loader:{loading_jquery:false,script:function(obj){if(!document.getElementById(obj.id)){var x=document.createElement('script');x.onreadystatechange=function(){switch(this.readyState){case'complete':case'loaded':obj.callback();break}};x.onload=function(){obj.callback()};x.src=obj.source;x.id=obj.id;document.lastChild.appendChild(x)}},stylesheet_loaded:false,stylesheet:function(){if(!CoinWidgetCom.loader.stylesheet_loaded){CoinWidgetCom.loader.stylesheet_loaded=true;var $link=jQuery('<link/>');jQuery("head").append($link);$link.attr({id:'COINWIDGETCOM_STYLESHEET',rel:'stylesheet',type:'text/css',href:CoinWidgetCom.source+'coin.css'})}},jquery:function(){if(!window.jQuery&&!CoinWidgetCom.loader.loading_jquery){$prefix=window.location.protocol=='file:'?'http:':'';CoinWidgetCom.loader.script({id:'COINWIDGETCOM_JQUERY',source:$prefix+'//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',callback:function(){CoinWidgetCom.init()}});return}CoinWidgetCom.init()}}};

<script>
CoinWidgetCom.go({
	wallet_address: "1C7WCMDKuZTozopukrU7wn4L5QeEP9zkiG",
	currency: "bitcoin",
	counter: "count",
	alignment: "bc",
	qrcode: true,
	auto_show: false,
	lbl_button: "Donate",
	lbl_address: "Bitcoin Donation Address:",
	lbl_count: "donations",
	lbl_amount: "BTC"
});
</script>
*/

//var d = new Date();
var timeOffset = 0 - ( new Date().getTimezoneOffset() * 60 );
var _ = _;
var transports = ["Buses", "Metros", "Trains", "Trams"];
var properties = ["SiteId", "StopAreaNumber", "TransportMode", "StopAreaName", "LineNumber", "JourneyDirection", "Destination", "TimeTabledDateTime", "ExpectedDateTime", "DisplayTime"];
var favoriteStationsIds = ["9430", "9309"];
var favoriteStationsFilter = {
								"9430" : { "JourneyDirection": 2 },
								"9309" : {}
							 };
var currentSiteId = null;
var currentPosition;
var sites = {};
var sitesArray;
var stopPoints;
var stopAreaNumberToSiteId = {};
var locationWatcher;

//var favoriteStations = JSON.parse(localStorage.get("favoriteStations"));

Pebble.addEventListener("ready", function(event) {
	//console.log("JavaScript app ready and running! Event payload: " + JSON.stringify(event));
//	Pebble.showSimpleNotificationOnPebble('Hello!','Notifications from JavaScript? Welcome to the future!');

	// GG. Start by getting a position fix.
	window.navigator.geolocation.getCurrentPosition();

	sitesArray = JSON.parse( localStorage.getItem("sitesArray") );
	stopAreaNumberToSiteId = JSON.parse( localStorage.getItem("stopAreaNumberToSiteId") );
	if ( _.isArray(sitesArray ) )
	{
		console.log("\nLoaded data from local storage \nsitesArray: " + sitesArray.length );

		if( _.isObject( stopAreaNumberToSiteId ) )
		{
			console.log("\nLoaded data from local storage \nstopAreaNumberToSiteId: " + _.keys(stopAreaNumberToSiteId).length );
		}
		else
		{
			getData("http://api.sl.se/api2/FileService?key=7ebd290f4b2948bdb341512c976475b2&filename=Sites.csv", getSites);
		}

	}
	else
	{
		getData("http://api.sl.se/api2/FileService?key=7ebd290f4b2948bdb341512c976475b2&filename=Sites.csv", getSites);
	}
	
	stopPoints = JSON.parse( localStorage.getItem("stopPoints") );
	if ( _.isArray( stopPoints ) )
	{
		console.log("\nLoaded data from local storage\nstopPoints: " + stopPoints.length );
	}	
	else
	{
		getData("http://api.sl.se/api2/FileService?key=7ebd290f4b2948bdb341512c976475b2&filename=StopPoints.csv", getStopPoints);
	}

	var locationOptions = { "timeout": 10000, "maximumAge": 15000, "enableHighAccuracy": true };
	if ( locationWatcher !== undefined )
	{
		window.navigator.geolocation.clearWatch(locationWatcher);
	}
	locationWatcher = window.navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);

});

Pebble.addEventListener("appmessage", function(e) {
// console.log("appmessage: " + JSON.stringify(e));
/*	var SiteId = getSiteId(); */
//	locationWatcher = window.navigator.geolocation.watchPosition(getSiteId, null /* locationError */, null /* locationOptions */);
/* 
	{"type":"appmessage","target":{},"currentTarget":{},"payload":{"fetch":1}}
*/

  if(currentSiteId && e.payload.fetch)
  	getRealtimeTransports(currentSiteId);
  else
	  console.log("No current SiteId or weird message: " + JSON.stringify(e) );
/*	if (e.payload.symbol) { */
});

function expectedTimeSort(a,b) {
	if (a.ExpectedDateTime < b.ExpectedDateTime)
		return -1;
	if (a.ExpectedDateTime > b.ExpectedDateTime)
		return 1;
	return 0;
}