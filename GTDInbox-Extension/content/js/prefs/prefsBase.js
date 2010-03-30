var prefsBase=giPopupNotice.extend({_prefsChanged:false,connect:function(main){giLogger.log("st","prefsBase.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.id="prefsbase";this.base(main);this._load("preferences.htm");var doc=this._main.gmail.canvasDocument;var el=doc.getElementById("gtdi-pref-accountcontainer-forgotpassword");var account=this._main.gmail.environment.getAccount();el.href="http://www.gtdinbox.com/account/reset_password.php?email="+encodeURIComponent(account);var el=doc.getElementById("gtdi-pref-accountcontainer-getaccount");
el.href="http://www.gtdinbox.com/account/buyplus.php";this._eventsContainer.observe(this._elContent,"mouseup",this._savePrefsTextbox,false);this._eventsContainer.observe(this._elContent,"keyup",this._savePrefsTextbox,false);this._eventsContainer.observe(this._elContent,"change",this._savePrefsCheckbox,false);this._eventsContainer.observe(this._main.gmail.canvasDocument.getElementById("gtdi-pref-labelcategoriescontainer-categories"),"change",this._changeListIndex,false);this._eventsContainer.observe(this._main.gmail.canvasDocument.getElementById("gtdi-pref-statuslabelscontainer-statuslabels"),
"change",this._changeListIndex,false);this.loadPrefs()},disconnect:function(){if(this._prefsChanged)if(confirm(giI18N.getString("Prefs.confirmRefresh")))this._main.gmail.page.reloadGmail();this.base()},loadPrefs:function(){try{giLogger.log("st","prefMainPagePlugin.loadPrefs",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);var doc=this._main.gmail.canvasDocument;this._prefsChanged=false;this._updateAccountStatus();var results=doc.evaluate(".//*[@gtdi-preference]",this._elContent,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
null);for(var i=0;i<results.snapshotLength;i++){var el=results.snapshotItem(i);if(el.nodeName.toLowerCase()=="input")switch(el.getAttribute("type")){case "checkbox":el.checked=this._main.prefs.getGlobal(el.getAttribute("gtdi-preference"));break;case "password":case "text":el.value=this._main.prefs.getGlobal(el.getAttribute("gtdi-preference"));break}}var elList=doc.getElementById("gtdi-pref-labelcategoriescontainer-categories");elList.innerHTML="";var types=this._main.prefs.getGlobal("gtd.labels.types");
for(t in types){var elLi=doc.createElement("OPTION");elLi.value=t;elLi.innerHTML=giI18N.getString("Labels.Types."+t,t);elList.appendChild(elLi)}elList.selectedIndex=0;this._changeListIndex(null,elList);var elList=doc.getElementById("gtdi-pref-statuslabelscontainer-statuslabels");elList.innerHTML="";var core=this._main.prefs.getGlobal("gtd.labels.types.statuses.core");for(c in core)if(!core[c].excludeFromOptions){var elLi=doc.createElement("OPTION");elLi.value=c;elLi.innerHTML=giI18N.getString("Labelling.statuses."+
c,c);elList.appendChild(elLi)}elList.selectedIndex=0;this._changeListIndex(null,elList);var elLabelPrefix=this._main.gmail.canvasDocument.getElementById("gtdi-pref-statuslabelscontainer-labelprefix");elLabelPrefix.innerHTML=this._main.prefs.getGlobal("gtd.labels.types.statuses.prefix")}catch(e){giLogger.warn(e,"prefsBase.loadPrefs",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_savePrefsTextbox:function(evt){try{var el=evt.target;var doc=this._main.gmail.canvasDocument;if(el.hasAttribute("gtdi-preference"))if(el.nodeName.toLowerCase()==
"input")switch(el.getAttribute("type")){case "password":case "text":this._main.prefs.setGlobal(el.getAttribute("gtdi-preference"),el.value,true);this._prefsChanged=true;break}if(el.id=="gtdi-pref-labelcategoriescontainer-prefix"){var elLabelPrefix=this._main.gmail.canvasDocument.getElementById("gtdi-pref-statuslabelscontainer-labelprefix");elLabelPrefix.innerHTML=this._main.prefs.getGlobal("gtd.labels.types.statuses.prefix")}if(el.id=="gtdi-pref-statuslabelscontainer-label"){var elList=doc.getElementById("gtdi-pref-statuslabelscontainer-statuslabels");
elList.options[elList.selectedIndex].innerHTML=el.value}}catch(e){giLogger.warn(e,"prefsBase._savePrefs",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_savePrefsCheckbox:function(evt){try{var el=evt.target;var doc=this._main.gmail.canvasDocument;if(el.hasAttribute("gtdi-preference"))if(el.nodeName.toLowerCase()=="input")switch(el.getAttribute("type")){case "checkbox":this._main.prefs.setGlobal(el.getAttribute("gtdi-preference"),el.checked,true);this._prefsChanged=true;break}}catch(e){giLogger.warn(e,
"prefsBase._savePrefs",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_click:function(evt){try{var doc=this._main.gmail.canvasDocument;var el=evt.target;switch(el.id){case "gtdi-pref-labelcategories-remove":var elList=doc.getElementById("gtdi-pref-labelcategoriescontainer-categories");var type=elList.options[elList.selectedIndex].value;var typeStr=elList.options[elList.selectedIndex].innerHTML;if(type.toLowerCase()=="statuses"){alert(giI18N.getString("Prefs.gtd.labels.types.button.remove.cannot_remove_statuses"));
return}if(!confirm(giI18N.getString("Prefs.gtd.labels.types.button.remove.confirm").replace("%1",typeStr)))return;this._main.prefs.setGlobal("gtd.labels.types."+type,null,true);this.loadPrefs();this._prefsChanged=true;break;case "gtdi-pref-labelcategories-add":var type=prompt(giI18N.getString("Prefs.gtd.labels.types.button.add.getType"));if(!type)return;var prefix=prompt(giI18N.getString("Prefs.gtd.labels.types.button.add.getPrefix").replace("%1",type));if(!prefix)return;if(this._main.prefs.getGlobal("gtd.labels.types."+
type)){alert(giI18N.getString("Prefs.gtd.labels.types.button.add.already_exists").replace("%1",type));return}this._main.prefs.setGlobal("gtd.labels.types."+type,{prefix:prefix},true);this.loadPrefs();this._prefsChanged=true;break;case "gtdi-pref-accountcontainer-passwordsave":var elPass=doc.getElementById("gtdi-pref-accountcontainer-password1");var elPassConfirm=doc.getElementById("gtdi-pref-accountcontainer-password2");if(elPass.value!=elPassConfirm.value){alert(giI18N.getString("Prefs.gtd.password.noMatch"));
elPass.value="";elPassConfirm.value="";return}if(elPass.value=="")if(!confirm(giI18N.getString("Prefs.gtd.password.confirmClear")))return;var passwordHash=elPass.value?gihex_md5(elPass.value):null;this._main.prefs.setGlobal("server_account.password_hash",passwordHash,true);this._updateAccountStatus(true);elPass.value="";elPassConfirm.value=""}}catch(e){giLogger.warn(e,"prefsBase._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}this.base(evt)},_changeListIndex:function(evt,elList){try{if(!elList)elList=
evt.target;var chosenValue=elList.options[elList.selectedIndex].value;switch(elList.id){case "gtdi-pref-labelcategoriescontainer-categories":var elPrefix=this._main.gmail.canvasDocument.getElementById("gtdi-pref-labelcategoriescontainer-prefix");elPrefix.setAttribute("gtdi-preference","");elPrefix.value=this._main.prefs.getGlobal("gtd.labels.types."+chosenValue+".prefix");elPrefix.setAttribute("gtdi-preference","gtd.labels.types."+chosenValue+".prefix");break;case "gtdi-pref-statuslabelscontainer-statuslabels":var elLabel=
this._main.gmail.canvasDocument.getElementById("gtdi-pref-statuslabelscontainer-label");elLabel.setAttribute("gtdi-preference","");elLabel.value=this._main.prefs.getGlobal("gtd.labels.types.statuses.core."+chosenValue+".name");elLabel.setAttribute("gtdi-preference","gtd.labels.types.statuses.core."+chosenValue+".name");break}}catch(e){giLogger.warn(e,"prefsBase._changeListIndex",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_updateAccountStatus:function(updating){try{var elAccountStatus=
this._main.gmail.canvasDocument.getElementById("gtdi-pref-accountcontainer-status");var account=this._main.gmail.environment.getAccount();var passwordHash=this._main.prefs.getGlobal("server_account.password_hash");if(passwordHash){elAccountStatus.innerHTML=giI18N.getString("Prefs.gtd.password.loading");var serverAccount=new giServerAccount(this._main.pageId,false);serverAccount.addEventListener(giServerAccount.LOADED,function(){if(serverAccount.isLoggedIn()){elAccountStatus.innerHTML=giI18N.getString("Prefs.gtd.password.verified.success");
if(updating)this._prefsChanged=true}else{elAccountStatus.innerHTML=giI18N.getString("Prefs.gtd.password.verified.fail");this._main.gmail.canvasDocument.getElementById("gtdi-pref-accountcontainer-password1").value="";this._main.gmail.canvasDocument.getElementById("gtdi-pref-accountcontainer-password2").value="";this._main.prefs.setGlobal("server_account.password_hash",null,true);if(updating)alert(giI18N.getString("Prefs.gtd.password.verified.fail"))}},this);serverAccount.load(account,passwordHash)}else elAccountStatus.innerHTML=
giI18N.getString("Prefs.gtd.password.no_password")}catch(e){giLogger.warn(e,"prefsBase._updateAccountStatus",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}}});