var gtdBrowserThreads=gtdBrowser.extend({_serverActionType:null,_eventsContainer:null,_elHeaderType:null,_elHeaderItem:null,_elHeaderLink:null,_elGroupByList:null,_elTabs:null,_elWarning:null,_elContent:null,_filteredStatusThreads:null,searchConditions:null,containers:null,connect:function(main){giLogger.log("st","gtdBrowserThreads.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main);this._eventsContainer=new giEventsContainer(this);var doc=main.gmail.canvasDocument;var elHeaderItem=
doc.createElement("DIV");elHeaderItem.id="gtdi-context";this.elHeader.appendChild(elHeaderItem);this._elHeaderType=doc.createElement("H1");elHeaderItem.appendChild(this._elHeaderType);this._elHeaderItem=doc.createElement("SPAN");elHeaderItem.appendChild(this._elHeaderItem);this._elHeaderLink=doc.createElement("IMG");this._elHeaderLink.id="gtdi-open-in-gmail";this._elHeaderLink.src=giUrl.getURL("skin/gtd/goto.png");this._elHeaderLink.title=giI18N.getString("Browser.Popup.openInGmail");var elGroupBy=
doc.createElement("DIV");elGroupBy.id="gtdi-groupby";this.elHeader.appendChild(elGroupBy);this._elTabs=doc.createElement("DIV");this._elTabs.id="gtdi-menu";this.elBody.appendChild(this._elTabs);this._elContent=doc.createElement("DIV");this._elContent.id="gtdi-content";this.elBody.appendChild(this._elContent);this._eventsContainer.observe(this.el,"click",this._click,false);this._main.views.addEventListener(gtdViews.VIEW_EDITED,this._viewEdited,this);var listeners=[glThreadContainer.NEW_SEARCH,glThreadContainer.LOADED,
glThreadContainer.LOADING_UPDATE,glThreadContainer.CHANGED];for(var i=0;i<listeners.length;i++)this._main.statusThreadsContainer.addEventListener(listeners[i],this._threadContainerChanged,this)},disconnect:function(){for(p in this)if(this[p]&&this[p].nodeName&&this[p].nodeType&&this[p]!=this.el)this[p]=null;var listeners=[glThreadContainer.NEW_SEARCH,glThreadContainer.LOADED,glThreadContainer.LOADING_UPDATE,glThreadContainer.CHANGED];for(var i=0;i<listeners.length;i++)this._main.statusThreadsContainer.removeEventListener(listeners[i],
this._threadContainerChanged,this);for(i in this.containers)if(this.containers[i]instanceof gtdBrowserThreads_Container)this.containers[i].unload();this.containers=null;this._main.views.removeEventListener(gtdViews.VIEW_EDITED,this._viewEdited,this);this._eventsContainer.reset();this._eventsContainer=null;this.searchConditions=null;this._filteredStatusThreads=null;this.base()},load:function(type,item,searchConditions){if(this._elWarning){this._elWarning.parentNode.removeChild(this._elWarning);this._elWarning=
null}this._elTabs.innerHTML="";this._type=type||this._type;this._item=item||this._item;this.searchConditions=new glSearchAndConditions;if(searchConditions)this.searchConditions.addCondition(searchConditions);this.setHeaderType(type,item);this.containers={}},setHeaderType:function(type,item){if(type==gtdBrowser.TYPES.LABEL){var labelType=this._main.labelsData.getLabelType(item);this._elHeaderType.innerHTML=giI18N.getString("Browser.Types.label."+labelType,labelType)}else this._elHeaderType.innerHTML=
giI18N.getString("Browser.Types."+type,type);switch(type){case gtdBrowser.TYPES.VIEW:this._elHeaderItem.innerHTML=this._main.views.getViewName(item);break;default:this._elHeaderItem.innerHTML=item||"";break}if(this._elHeaderItem.innerHTML==""){this._elHeaderItem.style.display="none";this._elHeaderLink.style.display="none"}else{this._elHeaderType.innerHTML+=":";this._elHeaderItem.appendChild(this._elHeaderLink);this._elHeaderLink.style.display="";this._elHeaderLink.setAttribute("gtdSearch",this.searchConditions.toString())}},
setServerActionType:function(type){this._serverActionType=type;for(c in this.containers)for(i in this.containers[c].tabs)if(this.containers[c].tabs[i].threadList)this.containers[c].tabs[i].threadList.setServerActionType(type)},_viewEdited:function(evt){for(c in this.containers)for(i in this.containers[c].tabs)if(this.containers[c].tabs[i].id==evt.viewId)this.containers[c].tabs[i].filter=this._main.views.getViewSearch(evt.viewId)},_click:function(evt){try{var el=evt.target;while(el.parentNode&&el!=
this.el){if(el.id=="gtdi-open-in-gmail"){this.dispatchEvent({name:gtdBrowser.LOAD_TYPE,type:gtdBrowser.TYPES.SEARCH,item:el.getAttribute("gtdSearch"),openInGmail:true});break}el=el.parentNode}}catch(e){giLogger.warn(e,"gtdBrowserThreads._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_threadContainerChanged:function(evt){this._filteredStatusThreads=null},getFilteredStatusThreads:function(){if(!this._filteredStatusThreads){var filteredStatusThreads=[];var threads=this._main.statusThreadsContainer.threads;
if(threads.length==0){if(!this.searchConditions.canMatchThreads())throw new Error("Impossible match in search conditions: "+this.searchConditions.toString());}else for(var i=0;i<threads.length;i++)if(this.searchConditions.matchThread(threads[i]))filteredStatusThreads.push(threads[i]);this._filteredStatusThreads=filteredStatusThreads}return this._filteredStatusThreads||[]},_getFirstTab:function(){var tab=null;var firstTab=null;for(c in this.containers){if(!firstTab)for(t in this.containers[c].tabs){firstTab=
this.containers[c].tabs[t];break}tab=this._getFirstTabForContainer(this.containers[c],true);if(tab)break}return tab||firstTab},_getFirstTabForContainer:function(container,doNotReturnFirst){var tab=null;var firstTab=null;for(t in container.tabs){if(!firstTab)firstTab=container.tabs[t];if(container.tabs[t]instanceof gtdBrowserThreads_ThreadListTab)if(container.tabs[t].getThreads(true).length>0){tab=container.tabs[t];break}}if(tab)return tab;else if(!doNotReturnFirst)return firstTab},selectTab:function(tab){if(!tab)tab=
this._getFirstTab();var currentTab=this.getActiveTab();if(currentTab){if(currentTab==tab)return false;currentTab.active(false)}this._elContent.innerHTML="";tab.active(true);if(tab instanceof gtdBrowserThreads_ThreadListTab){if(!tab.threadList){tab.threadList=this._main.getUIObject("threadList");tab.threadList.addEventListener(gtdBrowser.LOAD_TYPE,this._loadType,this);tab.threadList.setServerActionType(this._serverActionType);this.dispatchEvent({name:gtdBrowserThreads.CREATE_THREADLIST,threadList:tab.threadList})}tab.refreshThreadList();
this._elContent.appendChild(tab.threadList.el)}this.dispatchEvent({name:gtdBrowser.RESIZABLE_ELEMENT_CHANGE});this.dispatchEvent({name:gtdBrowserThreads.SELECT_TAB,tab:tab});return true},_createTabsFromStatuses:function(){var statuses=this._main.labelsData.getLabelsArray("statuses",true);var statusData=this._main.labelsData.getStatusData();var container=new gtdBrowserThreads_Container(this._main,this,"statuses",giI18N.getString("Browser.Threads.Tabs.Containers.statuses"));this.appendContainer(container);
for(var i=0;i<statuses.length;i++)if(statuses[i]!=statusData.finished){var tab=new gtdBrowserThreads_ThreadListTab(this._main,this,statuses[i],statuses[i].replace(statusData.prefix,""),new glSearchConditions(glSearch.l(statuses[i])));if(tab instanceof gtdBrowserThreads_ThreadListTab)tab.refreshCount();container.appendTab(tab)}},_createTabsFromViews:function(){var views=this._main.views.getViews();var container=new gtdBrowserThreads_Container(this._main,this,"views",giI18N.getString("Browser.Threads.Tabs.Containers.views"));
this.appendContainer(container);for(var i=0;i<views.length;i++){var id=views[i];var tab=new gtdBrowserThreads_ThreadListTab(this._main,this,id,this._main.views.getViewName(id),this._main.views.getViewSearch(id));if(tab instanceof gtdBrowserThreads_ThreadListTab)tab.refreshCount();container.appendTab(tab)}},appendContainer:function(container){this.containers[container.id]=container;this._elTabs.appendChild(container.el)},getActiveTab:function(){for(c in this.containers)for(t in this.containers[c].tabs)if(this.containers[c].tabs[t].active())return this.containers[c].tabs[t]},
getTabBySearch:function(searchStr){for(c in this.containers)for(t in this.containers[c].tabs)if(this.containers[c].tabs[t].searchConditions.toString()==searchStr)return this.containers[c].tabs[t]},_loadType:function(evt){this.dispatchEvent(evt)}},{SELECT_TAB:"select_tab",CREATE_THREADLIST:"create_threadlist",DEFAULT_NUMBER_THREADS:200});gtdBrowserThreads.implement(giEventDispatcher);
var gtdBrowserThreads_Container=giBase.extend({id:null,el:null,_elHeader:null,_elList:null,_browser:null,tabs:null,_eventsContainer:null,constructor:function(gtd,browser,id,displayName){this._main=gtd;this._browser=browser;this.id=id;var doc=this._main.gmail.canvasDocument;this.el=doc.createElement("DIV");this._elHeader=doc.createElement("H3");this._elHeader.innerHTML=displayName||"";this.el.appendChild(this._elHeader);this._elList=doc.createElement("UL");this.el.appendChild(this._elList);this.tabs=
{};this._eventsContainer=new giEventsContainer(this);this._eventsContainer.observe(this.el,"click",this._click,false)},unload:function(){for(i in this.tabs)if(this.tabs[i]instanceof gtdBrowserThreads_Tab)this.tabs[i].unload();this.tabs=null;this._eventsContainer.reset();this._eventsContainer=null},appendTab:function(tab){this.tabs[tab.id]=tab;tab.container(this);this._elList.appendChild(tab.el)},_click:function(evt){try{var el=evt.target;while(el.parentNode&&el!=this.el){if(el.getAttribute("gtdi-tabid")){this._browser.selectTab(this.tabs[el.getAttribute("gtdi-tabid")]);
break}el=el.parentNode}}catch(e){giLogger.warn(e,"gtdBrowserThreads._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}}});
var gtdBrowserThreads_Tab=giBase.extend({id:null,el:null,_browser:null,_container:null,_active:null,_main:null,constructor:function(gtd,browser,id,displayName){this._main=gtd;this._browser=browser;this.id=id;var doc=this._main.gmail.canvasDocument;this.el=doc.createElement("LI");this.el.className="gtdi-menu-item";this.el.setAttribute("gtdi-tabid",id);this.el.innerHTML="<div><span class='gtdi-menuitem'>"+displayName+"</span></div>"},unload:function(){this.searchConditions=null;this._browser=null;this._container=
null;this._main=null},container:function(container){if(container)this._container=container;return this._container},active:function(v){if(typeof v!="undefined"){giUIObject.removeClassName(this.el,"gtdi-active");if(v)giUIObject.addClassName(this.el,"gtdi-active");this._active=v}return this._active}});
var gtdBrowserThreads_ThreadListTab=gtdBrowserThreads_Tab.extend({_threadContainer:null,_currentThreadContainer:null,searchConditions:null,_threads:null,threadList:null,__isStatusConstrained:null,constructor:function(gtd,browser,id,displayName,searchConditions){this.base(gtd,browser,id,displayName);this.searchConditions=searchConditions;this.el.innerHTML+="<span class='gtdi-count></span>"},unload:function(){if(this._currentThreadContainer){var listeners=[glThreadContainer.NEW_SEARCH,glThreadContainer.LOADED,
glThreadContainer.LOADING_UPDATE,glThreadContainer.CHANGED];for(var i=0;i<listeners.length;i++)this._currentThreadContainer.removeEventListener(listeners[i],this._threadContainerChanged,this);this._currentThreadContainer=null}if(this._threadContainer){this._threadContainer.unload();this._threadContainer=null}if(this.threadList){this.threadList.disconnect();this.threadList=null}this._threads=null;this.base()},getThreads:function(forCount){var oldThreadContainer=this._currentThreadContainer;if(!this._threads){var gotThreads=
false;if(this._isStatusConstrained())try{threads=this._browser.getFilteredStatusThreads();this._threads=[];for(var i=0;i<threads.length;i++)if(this.searchConditions.matchThread(threads[i]))this._threads.push(threads[i]);this._currentThreadContainer=this._main.statusThreadsContainer;gotThreads=true}catch(e){giLogger.logConcern("(Acceptable) impossible match on status-threads with query "+this.searchConditions.toString()+". Switching to a thread download.","gtdBrowserThreads_ThreadListTab.getThreads",
this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);this._threads=null}if(!gotThreads){if(!this._threadContainer&&!forCount){var search=new glSearch(this._main.gmail);search.addCondition(this.searchConditions);search.addCondition(this._browser.searchConditions);this._threadContainer=new glThreadContainer(this._main,search);this._threadContainer.search(25)}if(this._threadContainer){this._threads=[];for(var i=0;i<this._threadContainer.threads.length;i++)this._threads.push(this._threadContainer.threads[i])}this._currentThreadContainer=
this._threadContainer}}if(oldThreadContainer!=this._currentThreadContainer){var listeners=[glThreadContainer.NEW_SEARCH,glThreadContainer.LOADED,glThreadContainer.LOADING_UPDATE,glThreadContainer.CHANGED];if(oldThreadContainer)for(var i=0;i<listeners.length;i++)oldThreadContainer.removeEventListener(listeners[i],this._threadContainerChanged,this);if(this._currentThreadContainer)for(var i=0;i<listeners.length;i++)this._currentThreadContainer.addEventListener(listeners[i],this._threadContainerChanged,
this)}return this._threads||[]},refreshCount:function(force){var forCount=force?false:true;var threads=this.getThreads(forCount);if(this._currentThreadContainer)if(this._currentThreadContainer.isComplete())this.setTabCount(threads.length);else this.setTabCount(threads.length+"+");else this.setTabCount("?")},refreshThreadList:function(){if(this.threadList){var threads=this.getThreads();this.threadList.setThreads(threads,this._currentThreadContainer)}},_threadContainerChanged:function(evt){this._threads=
null;if(this._browser.getActiveTab()==this)this.refreshThreadList();this.refreshCount()},_browserSearchChanged:function(evt){if(this._threadContainer)this._threadContainer=null;this._threads=null;if(this._browser.getActiveTab()==this)this.refreshThreadList();this.refreshCount()},_isStatusConstrained:function(searchConditions){if(this.__isStatusConstrained!==null)return this.__isStatusConstrained;var rootItem=false;if(!searchConditions){rootItem=true;searchConditions=this.searchConditions}var pass=
this._main.statusThreadsContainer.isStatusConstrained(searchConditions);if(rootItem)this.__isStatusConstrained=pass;return pass},setTabCount:function(count){var elTabCount=this._main.gmail.canvasDocument.evaluate(".//span[@class='gtdi-count']",this.el,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(elTabCount)elTabCount.innerHTML=count}});
