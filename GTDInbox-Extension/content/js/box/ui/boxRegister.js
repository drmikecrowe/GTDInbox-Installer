var boxRegister=giPopupNotice.extend({connect:function(main){giLogger.log("st","boxRegister.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.id="register";this.base(main);this._eventsContainer=new giEventsContainer(this);try{this.addEventListener(giPopupNotice.CONTENT_LOADED,this._contentLoaded,this);this._load("register.htm")}catch(e){giLogger.warn(e,"boxRegister.connect",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_contentLoaded:function(){try{var doc=this._main.gmail.canvasDocument;
var account=this._main.gmail.environment.getAccount();var elEmail=doc.getElementById("gtdi-register-body-account");elEmail.innerHTML=account;var elForgottenPass=doc.getElementById("gtdi-forgotten-password");var elForgottenPassLink=elForgottenPass.getElementsByTagName("A")[0];elForgottenPassLink.href="http://www.gtdinbox.com/account/reset_password.php?email="+encodeURIComponent(account);var elManageAccountLink=doc.getElementById("gtdi-manage-account").getElementsByTagName("A")[0];elManageAccountLink.href=
"http://www.gtdinbox.com/account/manage.php"}catch(e){giLogger.warn(e,"boxRegister._contentLoaded",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},disconnect:function(){this.base()},_click:function(evt){try{var doc=this._main.gmail.canvasDocument;var el=evt.target;if(el.id=="gtdi-register-body-savepassword"){var elPassword1=doc.getElementById("gtdi-register-body-password1");var elPassword2=doc.getElementById("gtdi-register-body-password2");if(elPassword1.value==""){alert(giI18N.getString("Box.Register.savePassword.noPassword"));
return}if(elPassword1.value!=elPassword2.value){alert(giI18N.getString("Box.Register.savePassword.noPasswordMatch"));return}var elSpinner=doc.createElement("IMG");elSpinner.id="gtdi-register-body-loadingspinner";elSpinner.src=giUrl.getURL("skin/indicator_small.gif");el.parentNode.appendChild(elSpinner);var xhr=new giXMLHttpRequest;var email=this._main.gmail.environment.getAccount();var passwordHash=gihex_md5(elPassword1.value);xhr.open("GET","http://www.gtdinbox.com/account/login_ws.php?email="+escape(email)+
"&passwordHash="+escape(passwordHash)+"&browser="+giPluginManager.browserName,true);var me=this;xhr.onreadystatechange=function(evt){try{if(xhr.readyState==4){elSpinner.parentNode.removeChild(elSpinner);if(xhr.status==200){var data=giJson.decode(xhr.responseText);if(data.success==true){me._main.prefs.setGlobal("server_account.password_hash",passwordHash,true);if(confirm(giI18N.getString("Box.Register.savePassword.success").replace("%1",email)))me._main.gmail.page.reloadGmail();else me.disconnect()}else if(data.errorType==
"unknownCredentials")alert(giI18N.getString("Box.Register.savePassword.unknownCredentials"));else alert(giI18N.getString("Box.Register.savePassword.serverFail"))}else alert(giI18N.getString("Box.Register.savePassword.serverFail"))}}catch(e){giLogger.warn(e,"boxRegister._click xhr.onreadystatechange",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}};xhr.send(null)}this.base(evt)}catch(e){giLogger.warn(e,"boxRegister._clickClose",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}}});
