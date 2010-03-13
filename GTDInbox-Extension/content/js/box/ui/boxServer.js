var boxServer=giUIObject.extend({el:null,_serverAccount:null,_accountRetry:null,_eventsContainer:null,connect:function(main){giLogger.log("st","boxServer.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main);this._eventsContainer=new giEventsContainer(this);var doc=this._main.gmail.canvasDocument;this.el=doc.createElement("DIV");this.el.className="gtdi-box-account";this._eventsContainer.observe(this.el,"click",this._click,false)},disconnect:function(){if(this.el.parentNode)this.el.parentNode.removeChild(this.el);
this.el=null;this._eventsContainer.reset();this._eventsContainer=null;if(this._accountRetry){this._accountRetry.disconnect();this._accountRetry=null}this._serverAccount=null;this.base()},_click:function(evt){var el=evt.target;switch(el.id){case "gtdi-box-account-recovered-refresh":break;case "gtdi-box-account-error-hide":this._main.getUIObject("box").removeSection(this);break;case "gtdi-box-account-register":case "gtdi-box-account-error-reregister":this._main.getUIObject("register");break;case "gtdi-box-account-error-cancelpassword":this._main.prefs.setGlobal("server_account.password_hash",
null,true);var elError=this._main.gmail.canvasDocument.getElementById("gtdi-box-account-error");if(elError)elError.parentNode.removeChild(elError);break}},load:function(serverAccount,retrying){this._serverAccount=serverAccount;if(this._serverAccount.isRegistered())if(this._serverAccount.isLoaded())this._load(retrying);else{var me=this;this._serverAccount.addEventListener(giServerAccount.LOADED,function(){me._load(retrying)},this)}else{var elRegister=this._main.gmail.canvasDocument.createElement("BUTTON");
elRegister.id="gtdi-box-account-register";elRegister.innerHTML=giI18N.getString("Box.Server.register");this.el.appendChild(elRegister)}},_load:function(retrying){var doc=this._main.gmail.canvasDocument;this.el.innerHTML="";if(this._serverAccount.isLoggedIn())if(retrying){this.el.innerHTML="<p id='gtdi-box-account-recovered'>"+giI18N.getString("Box.Server.recovered.ready")+"</p>";this.el.innerHTML+="<p id='gtdi-box-account-recovered-refresh'>"+giI18N.getString("Box.Server.recovered.refresh")+"</p>"}else{var accountType=
this._serverAccount.getAccountType();this.el.innerHTML="<p class='gtdi-box-account-type gtdi-box-account-"+accountType+"'><a href='http://www.gtdinbox.com/account/manage.php' target='_blank' title='"+giI18N.getString("Box.Server.manage.tooltip")+"'>"+giI18N.getString("Box.Server.types."+accountType)+"</a></p>";if(accountType==giServerAccount.TYPES.FREE)this.el.innerHTML+="<a id='gtdi-box-account-upgrade' href='http://www.gtdinbox.com/account/buyplus.php' target='_blank'>"+giI18N.getString("Box.Server.upgrade")+
"</p>"}else{var elHide=doc.createElement("DIV");elHide.innerHTML="x";elHide.id="gtdi-box-account-error-hide";this.el.appendChild(elHide);var elMsg=doc.createElement("DIV");elMsg.id="gtdi-box-account-error";this.el.appendChild(elMsg);elMsg.innerHTML="<p id='gtdi-box-account-error-title'>"+giI18N.getString("Box.Server.problem.title")+"</p>";var errors=this._serverAccount.getErrorLog();var lastErrorType=null;for(var i=0;i<errors.length;i++){lastErrorType=errors[i].type;var msg=errors[i].msg?" ("+errors[i].msg+
")":"";elMsg.innerHTML+="<p class='gtdi-box-account-error-msg'>"+giI18N.getString("Box.Server.problem.types."+errors[i].type)+msg+"</p>"}var reregisterHtml="";if(lastErrorType=="unknownCredentials"){reregisterHtml=" / <span id='gtdi-box-account-error-reregister' title='"+giI18N.getString("Box.Server.problem.types.unknownCredentials.reregister.tooltip")+"'>"+giI18N.getString("Box.Server.problem.types.unknownCredentials.reregister")+"</span>";reregisterHtml+=" / <span id='gtdi-box-account-error-cancelpassword' title='"+
giI18N.getString("Box.Server.problem.types.unknownCredentials.cancelpassword.tooltip")+"'>"+giI18N.getString("Box.Server.problem.types.unknownCredentials.cancelpassword")+"</span>"}elMsg.innerHTML+="<p id='gtdi-box-account-error-help'>(<a href='http://www.gtdinbox.com/support_serverbox.html#'"+lastErrorType+" target='_blank'>"+giI18N.getString("Box.Server.problem.help")+"</a>"+reregisterHtml+")</p>";if(lastErrorType!="unknownCredentials")if(retrying&&retrying>3);else{if(retrying)retrying++;else retrying=
1;if(this._accountRetry)this._accountRetry.disconnect();this._accountRetry=new boxServerRetry(this._main);this.el.appendChild(this._accountRetry.el);var me=this;this._accountRetry.addEventListener(boxServerRetry.RETRY,function(){me.load(this._serverAccount,retrying)},this);this._accountRetry.start(this._serverAccount,120*retrying)}}if(this._serverAccount.version)this._updateNotifications(this._serverAccount.version,this._serverAccount.eb)},_onreadystatechange_load:function(evt){var xhr=evt.target;
if(xhr.readyState==4)try{if(xhr.status==200){var data=giJson.decode(xhr.responseText);if(data.version)this._updateNotifications(data.version,data.eb)}}catch(e){giLogger.warn(e,"boxServer._onreadystatechange_load",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_updateNotifications:function(version,eb){if(!this._elNotifications){this._elNotifications=this._main.gmail.canvasDocument.createElement("DIV");this._elNotifications.id="gtdi-box-server-notifications";this.el.appendChild(this._elNotifications)}this._elNotifications.innerHTML=
"";try{if(giVersionCompare.greaterThan(version.number,giPluginManager.version)){var link=version.link?version.link:"http://www.gtdinbox.com/gettingstarted.htm";this._elNotifications.innerHTML+="<div id='gtdi-box-server-notifications-version'><a href='"+link+"' target='_blank'>"+giI18N.getString("Box.Server.notifications.newVersion").replace("%1",version.number)+"</a></div>"}if(eb)for(var i=0;i<=eb.length;i++)if(!eb[i].before||giVersionCompare.greaterThan(eb[i].before,giPluginManager.version)){var color=
eb[i].color?"style='color:"+eb[i].color+";'":"";this._elNotifications.innerHTML+="<div class='gtdi-box-server-notifications-eb'><a href='"+eb[i].link+"' target='_blank' "+color+">"+eb[i].msg+"</a></div>"}}catch(e){giLogger.warn(e,"boxServer._updateNotifications",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}}});
var boxServerRetry=giBase.extend({el:null,_elTimer:null,_main:null,_timer:null,_countdown:null,_serverAccount:null,constructor:function(main){giLogger.log("st","boxServerRetry.constructor",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this._main=main;this.el=this._main.gmail.canvasDocument.createElement("DIV");this.el.id="gtdi-box-account-error-retry";this.el.innerHTML=giI18N.getString("Box.Server.problem.retry.notice")+" ";this._elTimer=this._main.gmail.canvasDocument.createElement("SPAN");this._elTimer.id=
"gtdi-box-account-error-retry-timer";this.el.appendChild(this._elTimer)},disconnect:function(){if(this.el.parentNode)this.el.parentNode.removeChild(this.el);this._removeAllListeners();if(this._timer){clearInterval(this._timer);this._timer=null}this._serverAccount=null;this.el=null;this._elTimer=null;this._main=null},start:function(serverAccount,countdown){if(serverAccount)this._serverAccount=serverAccount;this._countdown=countdown||120;if(this._timer)clearInterval(this._timer);var me=this;this._timer=
setInterval(function(){me._timerEvent()},1E3)},_timerEvent:function(){this._countdown=this._countdown-1;if(this._countdown<=0){clearInterval(this._timer);this._timer=null;this._elTimer.innerHTML=giI18N.getString("Box.Server.problem.retry.retrying");this._serverAccount.addEventListener(giServerAccount.LOADED,this._serverAccountLoaded,this);this._serverAccount.load(this._serverAccount.getUsername(),this._serverAccount.getPasswordHash())}else{var timeLeft="";var mins=parseInt(this._countdown/60);if(mins>=
1)timeLeft=mins+":"+(this._countdown-mins*60);else timeLeft=this._countdown+" "+giI18N.getString("Box.Server.problem.retry.seconds");this._elTimer.innerHTML=timeLeft}},_serverAccountLoaded:function(){this._serverAccount.removeEventListener(giServerAccount.LOADED,this._serverAccountLoaded,this);this.dispatchEvent({name:boxServerRetry.RETRY})}},{RETRY:"retry"});boxServerRetry.implement(giEventDispatcher);
