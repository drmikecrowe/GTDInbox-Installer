var giPageManager=giBase.extend(null,{loadPage:function(doc,browserName){try{if(doc._gtdiLoadPage)return;var url=doc&&doc.defaultView&&doc.defaultView.location?doc.defaultView.location.href:"not-found";giLogger.log("try .loadPage with url: "+url,"giPageManager.loadPage");if(url.indexOf("view=bsp")>-1){var elComms=doc.createElement("DIV");elComms.id="aig-doctest";doc.documentElement.appendChild(elComms);var elScript=doc.createElement("SCRIPT");elScript.setAttribute("type","text/javascript");var code=
"var desiredDoc = top.document.getElementById('canvas_frame').contentDocument;\n";code+="var elComms = document.getElementById('aig-doctest');\n";code+="elComms.setAttribute('gtdi_top_location', top.location.href);\n";code+="if( document==desiredDoc ) {\n";code+="   var ignoreTopUrls = ['view=btop', 'view=cm', 'com/buzz', 'ContactChooser', 'ContactManager'];\n";code+="   var matchIgnoredUrl = false;\n";code+="   for( var i = 0; i < ignoreTopUrls.length; i++) {\n";code+="       if(top.location.href.indexOf(ignoreTopUrls[i])>-1) {\n";
code+="           matchIgnoredUrl = true;\n";code+="           break;\n";code+="       }\n";code+="   }\n";code+="   if( !matchIgnoredUrl ) elComms.setAttribute('result', '1');\n";code+="   else elComms.setAttribute('result', '0');\n";code+="} else {\n";code+="   elComms.setAttribute('result', '0');\n";code+="}";elScript.textContent=code;doc.documentElement.appendChild(elScript);var href=elComms.getAttribute("gtdi_top_location");var result=elComms.getAttribute("result");elScript.parentNode.removeChild(elScript);
elComms.parentNode.removeChild(elComms);if(result=="1"){giLogger.log(".loadPage success with url: "+url,"giPageManager.loadPage");giPageManager._loadPage_testAccount(doc,browserName,null,href)}}}catch(e){giLogger.warn(e,"giPageManager.loadPage")}},_loadPage_testAccount:function(doc,browserName,attempts){try{if(!attempts)attempts=1;var envOk=false;var account=glPageWrapper.getGlobalStatic(doc,null,"account");if(account&&giUtil.testEmailAddress(account)){var elHead=doc.getElementsByTagName("HEAD")[0];
var elBody=doc.getElementsByTagName("BODY")[0];if(elHead&&elBody)envOk=true}if(envOk)giPluginManager.loadPage(doc,browserName,account);else if(attempts++<20)setTimeout(function(){giPageManager._loadPage_testAccount(doc,browserName,attempts)},500);else giPluginManager.loadPage(doc,browserName)}catch(e){giLogger.warn(e,"giPageManager._loadPage_testAccount")}}});
