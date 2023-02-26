/** Script to launch the WhichBrowser tool 
detect.php file path on the server has to be set in the s.scr variable (last line)
detect.php is inside the WhichBrowser library directory
*/
(function(){var p=[],w=window,d=document,e=f=0;p.push('ua='+encodeURIComponent(navigator.userAgent));e|=w.ActiveXObject?1:0;e|=w.opera?2:0;e|=w.chrome?4:0; e|='getBoxObjectFor' in d || 'mozInnerScreenX' in w?8:0;e|=('WebKitCSSMatrix' in w||'WebKitPoint' in w||'webkitStorageInfo' in w||'webkitURL' in w)?16:0; e|=(e&16&&({}.toString).toString().indexOf("\n")===-1)?32:0;p.push('e='+e);f|='sandbox' in d.createElement('iframe')?1:0;f|='WebSocket' in w?2:0; f|=w.Worker?4:0;f|=w.applicationCache?8:0;f|=w.history && history.pushState?16:0;f|=d.documentElement.webkitRequestFullScreen?32:0;f|='FileReader' in w?64:0; p.push('f='+f);p.push('r='+Math.random().toString(36).substring(7));p.push('w='+screen.width);p.push('h='+screen.height);var s=d.createElement('script'); 
s.src='http://onexp.lpl-aix.fr/jockog/lib/whichbrowser/detect.php?' + p.join('&');d.getElementsByTagName('head')[0].appendChild(s);})();

// ===> Set the full server path towards detect.php file of the WichBrowser library - Add the "?" character at the end of the path
// http://howfast.lpl-aix.fr/appreg/lib/whichbrowser/detect.php?

// Wait 900 ms max for WhichBrowser to be load 
function waitForWhichBrowser(cb) {
	
	function wait(iw) {
		function gowait(){
			iw++;
			if ((typeof WhichBrowser !== 'undefined') || (iw > 10)) {		
				clearInterval(id);
			}
		}			
		var id = setInterval(gowait, 100);

		if (typeof WhichBrowser === 'undefined'){ 
			var sinf = 'Unable_wb';					
		}else{
			var sinf = cb();
		}
		return sinf;
	}
	return wait(0);
}

function getBrowserInfos(){
	
	var afterwb = function(){
		// New WhichBrowser object
		var Browsers = new WhichBrowser();		
		
		var subjinfo = "";
		subjinfo += 'OS_' + Browsers.os.name;
		if (Browsers.os.version != null) {
			subjinfo += '_' + Browsers.os.version;
		}
		
		subjinfo += '_Br_' + Browsers.browser.name+'_'+ Browsers.browser.version.original;
		subjinfo += '_Dt_'+ Browsers.device.type;
		
		// Remove blanks
		subjinfo = subjinfo.replace(/\s+/g, '');
		subjinfo = subjinfo.replace(/\./g, 'p');		
		return subjinfo;		
	}
	
	return waitForWhichBrowser(afterwb);
}	
