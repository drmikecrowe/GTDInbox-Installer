var gtdThread=giUIObject.extend({_eventsContainer:null,el:null,_elSubject:null,_elMessages:null,thread:null,_labellingBox:null,_serverActionType:null,connect:function(main){giLogger.log("st","gtdThread.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this._eventsContainer=new giEventsContainer(this);this.base(main);var doc=main.gmail.canvasDocument;this.el=doc.createElement("DIV");this.el.id="gtdi-thread";this.el.setAttribute("gtdi-resizable","1");var elH1=doc.createElement("H1");elH1.className=
"gtdi-thread-subject";this.el.appendChild(elH1);this._elSubject=doc.createElement("SPAN");elH1.appendChild(this._elSubject);var elLink=doc.createElement("IMG");elLink.src=giUrl.getURL("skin/gtd/goto.png");elLink.className="gtdi-open-in-gmail";elLink.title=giI18N.getString("Browser.Popup.openInGmail");elH1.appendChild(elLink);this._labellingBox=main.getUIObject("labellingBox");this.el.appendChild(this._labellingBox.el);this._elMessages=doc.createElement("DIV");this._elMessages.id="gtdi-messages";this._elMessages.setAttribute("gtdi-resizable",
"1");this.el.appendChild(this._elMessages);this._eventsContainer.observe(this.el,"click",this._click,false);this._main.gmail.actions.addEventListener(glActionManager.THREAD_CHANGED,this._threadChanged,this)},disconnect:function(){if(this.el&&this.el.parentNode)this.el.parentNode.removeChild(this.el);this.el=null;for(p in this)if(this[p]&&this[p].nodeName&&this[p].nodeType)this[p]=null;this._main.gmail.actions.removeEventListener(glActionManager.THREAD_CHANGED,this._threadChanged,this);if(this.thread)this.thread.removeEventListener(glThread.THREAD_LOADED,
this._refresh,this);this.thread=null;this._labellingBox.disconnect();this._labellingBox=null;this._eventsContainer.reset();this._eventsContainer=null;this.base()},load:function(thread){if(this.thread)this.thread.removeEventListener(glThread.THREAD_LOADED,this._refresh,this);this.thread=thread;this.thread.addEventListener(glThread.THREAD_LOADED,this._refresh,this);if(this.thread.isBasicLoaded())this._refresh();if(!this.thread.isCompleteLoaded())this.thread.loadComplete()},_refresh:function(){this._elSubject.innerHTML=
this.thread.subjectSnippetHtml;this._labellingBox.load(this.thread,true,null,"popupcv");var doc=this.el.ownerDocument;this._elMessages.innerHTML="";if(this.thread.isCompleteLoaded()){var messages=this.thread.messages;for(var i=0;i<messages.length;i++){var elMessage=this._createMessageEl(messages[i]);if(i<messages.length-1)elMessage.className+=" gtdi-closed";else elMessage.className+=" gtdi-final";this._elMessages.appendChild(elMessage)}}},_createMessageEl:function(message){var doc=this.el.ownerDocument;
var elMessage=doc.createElement("DIV");elMessage.className="gtdi-message";var elMessageHead=doc.createElement("DIV");elMessageHead.className="gtdi-messagehead";elMessage.appendChild(elMessageHead);var elUl=doc.createElement("UL");elMessageHead.appendChild(elUl);var elMessageFrom=doc.createElement("LI");elMessageFrom.className="gtdi-messagefrom";elMessageFrom.innerHTML="<span email='"+message.sender.email+"'>"+message.sender.name+"</span>";elUl.appendChild(elMessageFrom);var elMessageSnippet=doc.createElement("LI");
elMessageSnippet.className="gtdi-messagesnippet";elMessageSnippet.innerHTML="<span>"+message.message+"</span>";elUl.appendChild(elMessageSnippet);var elMessageDate=doc.createElement("LI");elMessageDate.className="gtdi-messagedatetime";elMessageDate.innerHTML="<span>"+message.date+"</span>";elUl.appendChild(elMessageDate);var elMessageBody=doc.createElement("DIV");elMessageBody.className="gtdi-messagebody";elMessage.appendChild(elMessageBody);elMessageContent=doc.createElement("DIV");elMessageContent.className=
"gtdi-messagecontent";elMessageContent.innerHTML=message.message;elMessageBody.appendChild(elMessageContent);return elMessage},_click:function(event){try{var el=event.target;if(el.className=="gtdi-open-in-gmail")this.dispatchEvent({name:gtdThread.CLICK_OPEN,thread:this.thread,newWindow:event.shiftKey});else{while(el.parentNode&&!giUIObject.hasClassName(el,"gtdi-message"))el=el.parentNode;if(giUIObject.hasClassName(el,"gtdi-message"))if(giUIObject.hasClassName(el,"gtdi-closed"))giUIObject.removeClassName(el,
"gtdi-closed");else giUIObject.addClassName(el,"gtdi-closed")}}catch(e){giLogger.warn(e,"gtdThread._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},setServerActionType:function(type){this._serverActionType=type;this._labellingBox.setServerActionType(type)},getLabellingBox:function(){return this._labellingBox},_threadChanged:function(event){if(this.thread&&this.thread.hasId(event.thread))switch(event.action){case glActionManager.ADD_LABEL:var typeSettings=this._main.prefs.getPref("labels.types");
if(gtdLabelsData.testPrefix(event.label,typeSettings.statuses.prefix)){var statusData=this._main.labelsData.getStatusData(true);if(!this._main.labelsData.allowMultipleStatuses(event.label,statusData,typeSettings)){var statuses=this._main.labelsData.getLabelsArray("statuses",false,true);for(var i=statuses.length-1;i>=0;i--){var key=statusData.reverseLookup[statuses[i]];if(event.label==statuses[i]||key&&typeSettings.statuses.core[key].notExclusive)statuses.splice(i,1)}for(var i=0;i<statuses.length;i++)if(!event.threadObject||
event.threadObject.hasLabel(statuses[i]))this._main.gmail.actions.performAction(glActionManager.REMOVE_LABEL,event.threadObject||event.thread,this._serverActionType,statuses[i])}}break}}},{CLICK_OPEN:"clickOpen"});gtdThread.implement(giEventDispatcher);
