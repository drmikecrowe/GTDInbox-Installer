var gtdEnvironment=giBase.extend({_main:null,_eventsContainer:null,_lastCheckedRows:null,_currentThread:null,constructor:function(main){this._main=main;this._eventsContainer=new giEventsContainer(this);this._attachedListeners={};this._attachListeners();this._main.gmail.page.addEventListener(glPageWrapper.VIEW_CHANGED,this._viewChanged,this)},unload:function(){this._eventsContainer.reset();this._eventsContainer=null;this._main=null},_attachListeners:function(){try{if(!this._attachedListeners["main"]){this._eventsContainer.observe(this._main.gmail.canvasDocument.body,
"contextmenu",this._context,true);this._eventsContainer.observe(this._main.gmail.canvasDocument.body,"mousedown",this._click,true);this._attachedListeners["main"]=true}}catch(e){var hasBody=this._main&&this._main.gmail&&this._main.canvasDocument&&this._main.canvasDocument.body;giLogger.warn(e,"gtdEnvironment._attachListeners","Error loading main. Has body: "+body,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_viewChanged:function(evt){if(this._main.gmail.page.getActiveViewType()=="ct"){setTimeout(giUtil.bind(this,
this._attachListeners),2E3);setTimeout(giUtil.bind(this,this._attachListeners),6E3)}},_click:function(event){try{if(event.button!=2&&!event.ctrlKey)return;event.preventDefault();var el=event.target;var details=this._getDetails(el);if(details){giUtil.stopEvent(event);if(!details.specificCmd){if(details.type==gtdBrowser.TYPES.CONTACT){if(!this._main.prefs.getPref("components.right_click.contact_popup.enabled"))return}else if(!this._main.prefs.getPref("components.right_click.label_popup.enabled"))return;
giLogger.log("Request popup browser, details.item: "+details.item+", details.type: "+details.type,"gtdEnvironment._click",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);var popup=this._main.getUIObject("browserPopup");popup.load(gtdBrowser.createBrowser(this._main,details.item,details.type))}else if(details.specificCmd=="loadTlThread"){if(!this._main.prefs.getPref("components.right_click.thread_preview.enabled")||this._main.gmail.offline.isUnstable())return;var threadListPreviewer=this._main.getUIObject("threadListPreviewer");
threadListPreviewer.load(el,event,false)}}}catch(e){giLogger.warn(e,"gtdEnvironment._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_context:function(event){try{var el=event.target;var el2=el;var i=10;while(--i>=0&&el2.parentNode){if(el2.className=="lightbox"||el2.id=="gtdi-browser-container"){giUtil.stopEvent(event);return}el2=el2.parentNode}var details=this._getDetails(el);if(details)giUtil.stopEvent(event)}catch(e){giLogger.warn(e,"gtdEnvironment._context",null,this._main?
this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_getDetails:function(el){var loopCount=5;var viewType=this._main.gmail.page.getActiveViewType();if(viewType=="tl")loopCount=10;while(loopCount-- >=0&&el.parentNode){if(el.nodeName=="SPAN"&&(el.className=="vs"||el.className=="HHshnc"))return{type:gtdBrowser.TYPES.CONTACT,item:el.innerHTML};if(el.getAttribute("email"))return{type:gtdBrowser.TYPES.CONTACT,item:el.getAttribute("email")};if(el.nodeName=="DIV"&&el.className=="av")return{type:gtdBrowser.TYPES.LABEL,
item:giUtil.decodeEntities(el.innerHTML)};if(el.nodeName=="SPAN"&&el.className=="hN")return{type:gtdBrowser.TYPES.LABEL,item:el.innerHTML};if(el.nodeName=="A")if(el.href.indexOf("#label/")>-1){var m=el.href.match("#label/([^/]+?)$");if(m){var label=decodeURIComponent(m[1]);return{type:gtdBrowser.TYPES.LABEL,item:label}}}if(el.getAttribute("gtdi-type")&&el.getAttribute("gtdi-item"))return{type:el.getAttribute("gtdi-type"),item:el.getAttribute("gtdi-item")};if(el.className=="text"&&giUtil.testEmailAddress(el.title))return{type:gtdBrowser.TYPES.CONTACT,
item:el.title};if(el.nodeName=="A"&&giUtil.testEmailAddress(el.innerHTML))return{type:gtdBrowser.TYPES.CONTACT,item:el.innerHTML};if(viewType=="tl")if(el.nodeName=="TR"&&el.className.indexOf("zA")>-1)return{specificCmd:"loadTlThread"};el=el.parentNode}}});
