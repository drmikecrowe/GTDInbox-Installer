var giLoadFailMonitor=giBase.extend({pageId:null,_timeoutId:null,_shutdown:false,_elWarningBar:null,constructor:function(pageId){this.pageId=pageId;var me=this;this._timeoutId=setTimeout(function(){me._testLoadFail()},35E3)},unload:function(){this._shutdown=true;if(this._elWarningBar);if(this._timeoutId){clearTimeout(this._timeoutId);this._timeoutId=null}this.pageId=null},_testLoadFail:function(){if(this._shutdown)return;var pageData=null;try{pageData=giPluginManager._pluginPageInstances[this.pageId];
var boxOk=false;try{var box=giPluginManager.getPluginInstance(boxMain,pageData.pageBase);var aboutBox=box.getUIObject("box");var errorBox=box.getUIObject("error");if(errorBox.isLoaded())boxOk=true}catch(e){}if(boxOk)if(giPluginManager.browserName=="mozilla")giPageManager.hadSuccessfulLoad=true;else{if(giPluginManager.browserName=="chrome");}else{giLogger.warn("[load-fail-detected]. errorBox in box/sidebar not detected. Will proceed to report load fail.","giLoadFailMonitor._testLoadFail",null,this.pageId);
this._reportLoadFail()}}catch(e){giLogger.warn(e,"giLoadFailMonitor._testLoadFail","pageId: "+this.pageId,this.pageId);this._reportLoadFail()}},_reportLoadFail:function(){if(this._shutdown)return;giLogger.log("st","giLoadFailMonitor._reportLoadFail",this.pageId);try{pageData=giPluginManager._pluginPageInstances[this.pageId];var hadSuccessfulLoad=false;if(giPluginManager.browserName=="mozilla")hadSuccessfulLoad=giPageManager.hadSuccessfulLoad;else if(giPluginManager.browserName=="chrome");var loadFailReport=
"";loadFailReport+="Initial URL: "+pageData.initialUrl+"\n";var url=pageData.doc&&pageData.doc.defaultView&&pageData.doc.defaultView.location?pageData.doc.defaultView.location.href:"not-found";loadFailReport+="URL now: "+url+"\n";if(pageData.docFail)loadFailReport+="Frames IDs at point of docFail: "+pageData.docFail.frameIds.join(", ")+"\n";var iframeEls=pageData.doc.getElementsByTagName("IFRAME");var iframes=[];for(var i=0;i<iframeEls.length;i++)iframes.push(iframeEls[i].id);loadFailReport+="Frame IDs now: "+
iframes.join(", ")+"\n";if(hadSuccessfulLoad)giLogger.log("[load-fail-detected] Appears to be an 'irrelevant doc', as Gmail loaded okay elsewhere.\n\n"+loadFailReport,"giLoadFailMonitor._reportLoadFail",this.pageId);else try{giLogger.log("[load-fail-detected]. Possibly major as Gmail not loaded in any other doc.\n\n"+loadFailReport,"giLoadFailMonitor._reportLoadFail",this.pageId);if(pageData.docFail){giLogger.logHTML(pageData.docFail.html,"giLoadFailMonitor._reportLoadFail.[html at initial point of docFail]",
null,false,pageId);try{var canvasDocument=pageData.doc;var canvasDocumentElement=canvasDocument.documentElement;var html=canvasDocumentElement.innerHTML;if(!html)throw new Error("No HTML found in canvasDocumentElement");giLogger.logHTML(html,"giLoadFailMonitor._reportLoadFail.[html now]",null,false,pageId)}catch(e){giLogger.warn("Could not find canvasDocument HTML for doc to retrieve HTML at point of log. Error: "+e,"giPluginManager._reportLoadFail",null,pageId)}}else;this._injectWarningBar()}catch(e){giLogger.warn(e,
"giLoadFailMonitor._reportLoadFail","pageId: "+this.pageId,this.pageId);this._reportWithNoDOM()}}catch(e){giLogger.warn(e,"giLoadFailMonitor._reportLoadFail","pageId: "+this.pageId,this.pageId)}},_injectWarningBar:function(){if(this._shutdown)return;giLogger.log("st","giLoadFailMonitor._injectWarningBar",this.pageId);var pageData=giPluginManager._pluginPageInstances[this.pageId];var errorCount=giLogger.getErrorReportCount(this.pageId);var canvasDocument=null;if(pageData&&pageData.pageBase&&pageData.pageBase.doc)canvasDocument=
pageData.pageBase.doc;else canvasDocument=pageData.doc;giLogger.log("Starting to create warning bar","giLoadFailMonitor._injectWarningBar",this.pageId);this._elWarningBar=canvasDocument.createElement("DIV");this._elWarningBar.id="gtdi-load-error";this._elWarningBar.style.position="absolute";this._elWarningBar.style.top="0px";this._elWarningBar.style.width="100%";canvasDocument.body.appendChild(this._elWarningBar);var elInner=canvasDocument.createElement("DIV");elInner.style.background="#FFFF8F";elInner.style.border=
"1px black solid";elInner.style.width="460px";elInner.style.margin="auto";elInner.style.padding="5px";elInner.style.fontSize="0.8em";var html="<span>GTDInbox could not load ("+errorCount+" errors).</span><div id='gtdi-load-error-hide' style='float:right;color:#2A5DB0;text-decoration:underline;cursor:pointer;'>hide</div><div id='gtdi-load-error-report' style='float:right;margin-right: 10px;color:#2A5DB0;text-decoration:underline;cursor:pointer;'>Report Error(s) to Team</div>";html+="<br clear='all'/>";
html+="<div id='gtdi-load-error-submit-container' style='display:none;background-color: #c6c600;'>";if(giLogger.getHTMLLogCount(this.pageId)>0)html+="  <div id='gtdi-load-error-submit-html-container'><input type='checkbox' id='gtdi-load-error-submit-checkbox-html' checked='true'/> Include Gmail layout <br/><span style='font-size:0.8em;color:#777;'>(Please note it may include snippets of your email because it includes whatever is on screen; but it's the most useful diagnosis data we can use. We do not store this information for more than 2 weeks.)</span></div>";
html+="  <div><input type='checkbox' id='gtdi-load-error-submit-checkbox-emailaddress' checked='true' /> Include your email address<br/><span style='font-size:0.8em;color:#777;'>(This is so we can contact you if a follow up is needed)</span></div>";html+="  <div><button id='gtdi-load-error-submit'>OK, Send the Error Report</button></div>";html+="</div>";html+="<div style='margin-top:6px;color:#555;font-size:0.8em;'>If this persists for more than 24 hours, please check the <a href='http://blog.gtdinbox.com' target='_blank'>blog</a> and then email <a href='mailto:support@gtdinbox.com'>support@gtdinbox.com</a>.</div>";
elInner.innerHTML=html;this._elWarningBar.appendChild(elInner);var me=this;this._elWarningBar.addEventListener("click",function(evt){me._warningBarClick(evt)},false)},_warningBarClick:function(evt){var elContainer=evt.target;try{var pageData=giPluginManager._pluginPageInstances[this.pageId];var doc=this._elWarningBar.ownerDocument;while(elContainer.parentNode&&elContainer.id!="gtdi-load-error")elContainer=elContainer.parentNode;switch(evt.target.id){case "gtdi-load-error-report":doc.getElementById("gtdi-load-error-submit-container").style.display=
"";break;case "gtdi-load-error-submit":if(giLogger.getHTMLLogCount(this.pageId)>0)if(doc.getElementById("gtdi-load-error-submit-checkbox-html").checked){var log=giLogger.getErrorLog(this.pageId,true);for(var i=0;i<log.length;i++)if(log[i].objType&&log[i].objType=="logHTML"&&!log[i].removed)log[i].approved=true}else giLogger.removeUnapprovedHTML(this.pageId);var exclEmail=!doc.getElementById("gtdi-load-error-submit-checkbox-emailaddress").checked;this._submitServer(exclEmail);case "gtdi-load-error-hide":if(this._elWarningBar&&
this._elWarningBar.parentNode)this._elWarningBar.parentNode.removeChild(this._elWarningBar);this._elWarningBar=null;break}}catch(e){giLogger.warn(e,"giPluginManager._warningBarClick",null,this.pageId);if(this._elWarningBar&&this._elWarningBar.parentNode)this._elWarningBar.parentNode.removeChild(this._elWarningBar);this._reportWithNoDOM();this._elWarningBar=null}},_reportWithNoDOM:function(){if(this._shutdown)return;try{giLogger.warn("Resorted to _reportWithNoDOM. Means either a catastrophic problem the DOM or with giLoadFailMonitor.",
"giLoadFailMonitor._reportWithNoDOM",this.pageId);giLogger.removeUnapprovedHTML(this.pageId);var exclEmail=true;this._submitServer(exclEmail,true)}catch(e){giLogger.warn(e,"giLoadFailMonitor._reportWithNoDOM",null,this.pageId);this._totalFail(null,"Error in giLoadFailMonitor._reportWithNoDOM -> "+e)}},_submitServer:function(exclEmail,muteMsgs){if(this._shutdown)return;try{var pageData=giPluginManager._pluginPageInstances[this.pageId];var email=pageData?pageData.account:"email-not-found";if(!email)try{email=
pageData.pageBase.environment.getAccount()}catch(e){}if(!email)try{email=glPageWrapper.getGlobalStatic(pageData.doc,this.pageId,"account")}catch(e){}var emailHash=email?gihex_md5(email):"";if(exclEmail)email=null;var successCallback=function(xhr){if(!xhr.responseText||xhr.responseText.indexOf("completed")>-1){if(!muteMsgs)alert("The GTDInbox Team have been informed - thank you.")}else this._totalFail(xhr,xhr.responseText)};var doc=pageData?pageData.doc:null;giServerErrorReport.sendError(doc,this.pageId,
emailHash,email,"","load_fail_report",successCallback,this._totalFail)}catch(e){giLogger.warn(e,"giLoadFailMonitor._serverSubmit",null,this.pageId);this._totalFail(null,"Error in giLoadFailMonitor._submitServer -> "+e)}},_totalFail:function(xhr,additionalMsg){if(this._shutdown)return;if(additionalMsg)additionalMsg="\n\n(Additional server response to report: "+additionalMsg+")";var status=xhr&&xhr.readyState>2?xhr.status:"na";alert("GTDInbox cannot reach the server to report the recent load error.\nYour error report has *not* been sent.\n\nPlease email support@gtdinbox.com, with the server status code '"+
status+"'.\n"+additionalMsg)}});
