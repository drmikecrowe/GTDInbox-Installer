var gtdMainPagePlugin=giMainPageUIPlugin.extend({labelsData:null,environment:null,statusThreadsContainer:null,recent:null,preLabeler:null,_loaded:null,_missedFirstViewChange:null,load:function(accountData,pageBase,classPrefix,serverAccount,pageId){this.base(accountData,pageBase,"gtd",serverAccount,pageId);this.gmail.page.addEventListener(glPageWrapper.UI_READY,this._baseUIReady,this);this.gmail.page.addEventListener(glPageWrapper.VIEW_CHANGED,this._viewChanged,this)},unload:function(){if(this.statusThreadsContainer){this.statusThreadsContainer.preventUnload=
false;this.statusThreadsContainer.unload()}if(this.preLabeler)this.preLabeler.unload();this.labelsData.unload();this.environment.unload();this.base()},_baseUIReady:function(evt){var loadErrorProgress="";this.gmail.page.removeEventListener(glPageWrapper.UI_READY,this._baseUIReady,this);try{if(!this.prefs.getPref("labels.types.statuses.core")||!this.prefs.getPref("labels.types.statuses.core.next_action")||!this.prefs.getPref("labels.types.statuses.core.waiting_on")||!this.prefs.getPref("labels.types.statuses.core.finished")||
!this.prefs.getPref("labels.types.statuses.prefix")){giLogger.logConcern("Status preferences failed integrity check","gtdMainPagePlugin._baseUIReady",this.pageId);this.prefs.extendPluginPrefsWithDefaults()}this.gmail.page.addCSS(giUrl.getURL("skin/gtd/c/main.css"));loadErrorProgress="css";this.labelsData=new gtdLabelsData(this);loadErrorProgress="labelsData";this.environment=new gtdEnvironment(this);loadErrorProgress="gtdEEnvironment";this.recent=new gtdRecent(this);loadErrorProgress="gtdRecent";
this.preLabeler=new gtdPreLabeler(this);loadErrorProgress="gtdPreLabeler";if(this.prefs.getPref("components.navigation.gmail_labels_box.enabled"))this.gmailLabelsBox=this.getUIObject("gmailLabelsBox");loadErrorProgress="gmailLabelsBox";this.statusThreadsContainer=new gtdStatusThreadContainer(this);loadErrorProgress="statusThreadsContainer";this.views=new gtdViews(this);loadErrorProgress="views";var mainView=this.getUIObject("mainView");loadErrorProgress="mainView"}catch(e){giLogger.warn("loadErrorProgress: "+
e,"gtdMainPagePlugin._baseUIReady - main load section","loadErrorProgress: "+loadErrorProgress,this.pageId)}try{var box=giPluginManager.getPluginInstance(boxMain,this.gmail);if(box)if(box.isLoaded())this._addGtdToBox(box);else box.addEventListener(boxMain.LOADED,function(evt){this._addGtdToBox(evt.target)},this);else giLogger.warn("Could not find box to load GTD boxSection","gtdMainPagePlugin._baseUIReady",null,this.pageId)}catch(e){giLogger.warn("box load fail: "+e,"gtdMainPagePlugin._baseUIReady",
this.pageId)}try{if(this.serverAccount&&this.serverAccount.getAccountType()==giServerAccount.TYPES.PLUS){if(!this.prefs.getPref("shown_welcome_plus")){this.prefs.setPref("shown_welcome_plus",true,true);var welcomeBox=this.getUIObject("welcome");welcomeBox.load("gtdWelcomePlus.htm")}}else if(!this.prefs.getPref("shown_welcome")){this.prefs.setPref("shown_welcome",true,true);var welcomeBox=this.getUIObject("welcome");welcomeBox.load()}}catch(e){giLogger.warn("welcome error: "+e,"gtdMainPagePlugin._baseUIReady",
null,this.pageId)}try{this._loaded=true;if(this._missedFirstViewChange)this._viewChanged()}catch(e){giLogger.warn("viewChanged error: "+e,"gtdMainPagePlugin._baseUIReady",null,this.pageId)}},_addGtdToBox:function(box){if(!this.prefs.getPref("labels.types.statuses.core")||!this.prefs.getPref("labels.types.statuses.prefix")){var boxPrefsWarning=this.getUIObject("boxPrefsWarning");box.getUIObject("box").addSection(boxPrefsWarning,true)}var elDash=this.gmail.canvasDocument.createElement("IMG");elDash.className=
"gtdi-box-dashboard-popout";elDash.src=giUrl.getURL("skin/gtd/popout.PNG");elDash.title=giI18N.getString("Box.DashboardShortcut.title");var me=this;elDash.addEventListener("mousedown",function(evt){me._clickDashPopout(evt)},true);box.getUIObject("box").elHeader.appendChild(elDash);if(!this.prefs.getPref("components.navigation.gtd_setup.disabled")){var sd=this.labelsData.getStatusData();var statuses=this.labelsData.getLabelsHash("statuses");if(!(statuses[sd["action"]]&&statuses[sd["waiting_on"]])){var boxSetup=
this.getUIObject("boxSetup");box.getUIObject("box").addSection(boxSetup,true)}}if(this.prefs.getPref("components.navigation.types.enabled")){var boxTypes=this.getUIObject("boxTypes");box.getUIObject("box").addSection(boxTypes,true)}},_clickDashPopout:function(evt){try{giUtil.stopEvent(evt);var popup=this.getUIObject("browserPopup");popup.load(gtdBrowser.createBrowser(this))}catch(e){giLogger.warn(e,"gtdMainPagePlugin._clickDashboardPopout",null,this.pageId)}},_viewChanged:function(evt){if(!this._loaded){this._missedFirstViewChange=
false;return}this.base(evt)}});giPluginManager.registerPlugin({id:"gtd",version:"3.0.6",main:"gtdMainPagePlugin",migrator:"gtdMigrator",defaults:"content/js/gtd/default-prefs.json"});
