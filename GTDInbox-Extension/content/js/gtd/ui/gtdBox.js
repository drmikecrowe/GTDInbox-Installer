var gtdBoxSetup=boxSection.extend({_gtd:null,connect:function(gtd){giLogger.log("st","gtdBoxSetup.connect",gtd?gtd.pageId:giLogger.UNKNOWN_PAGE_ID);this._gtd=gtd;var box=giPluginManager.getPluginInstance(boxMain,this._gtd.gmail);this.id="gtdsetup";this.base(box);var doc=this._main.gmail.canvasDocument;var elMsg=doc.createElement("DIV");elMsg.id="gtdi-gtd-setup-msg";elMsg.innerHTML=giI18N.getString("Box.setup.msg");this.el.appendChild(elMsg);var elInstall=doc.createElement("BUTTON");elInstall.id="gtdi-gtd-setup-install";
elInstall.innerHTML=giI18N.getString("Box.setup.install");this.el.appendChild(elInstall);this._eventsContainer.observe(this.el,"click",this._click,false);this._gtd.labelsData.addEventListener(gtdLabelsData.LABEL_CHANGED,this._labelsChanged,this)},disconnect:function(){this._gtd.labelsData.removeEventListener(gtdLabelsData.LABEL_CHANGED,this._labelsChanged,this);this.base()},_labelsChanged:function(evt){var sd=this._gtd.labelsData.getStatusData();var statuses=this._gtd.labelsData.getLabelsHash("statuses");
if(statuses[sd["next_action"]]&&statuses[sd["waiting_on"]]&&statuses[sd["some_day"]])this.disconnect()},_click:function(evt){try{var el=evt.target;if(el.id=="gtdi-gtd-setup-install")try{this._gtd.getUIObject("setup")}catch(e){giLogger.warn(e,"gtdBoxSetup._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);gBrowser.selectedTab=gBrowser.addTab("http://www.gtdinbox.com/faq.htm#gtdsetup")}}catch(e){giLogger.warn(e,"gtdBoxSetup._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}}});
var gtdBoxPrefsWarning=boxSection.extend({_gtd:null,connect:function(gtd){giLogger.log("st","gtdBoxCvWarning.connect",gtd?gtd.pageId:giLogger.UNKNOWN_PAGE_ID);this._gtd=gtd;var box=giPluginManager.getPluginInstance(boxMain,this._gtd.gmail);this.id="gtdcvwarning";this.base(box);var doc=this._main.gmail.canvasDocument;var elMsg=doc.createElement("DIV");elMsg.id="gtdi-gtd-prefs-warning";elMsg.innerHTML=giI18N.getString("Box.prefswarning.msg");this.el.appendChild(elMsg);var elFAQ=doc.createElement("A");
elFAQ.id="gtdi-gtd-prefs-warning-faq";elFAQ.href="http://www.gtdinbox.com/faq.htm#prefswarning";elFAQ.innerHTML=giI18N.getString("Box.prefswarning.faq");this.el.appendChild(elFAQ)},disconnect:function(){this.base()},_click:function(evt){try{this.disconnect()}catch(e){giLogger.warn(e,"gtdBoxCvWarning._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}}});
