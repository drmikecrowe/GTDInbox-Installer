var gtdConversationReplyToSelf=giUIObject.extend({_replyHandler:null,_eventsContainer:null,_replyToSelfTabs:null,connect:function(main){giLogger.log("st","gtdConversationReplyToSelf.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main);this._replyToSelfTabs={};this._eventsContainer=new giEventsContainer(this);this._replyHandler=this._main.gmail.getCurrentViewObject().getReplyHandler();this._replyHandler.addEventListener(glConversationReplyHandler.SHOW_REPLY_FULL,this._showReply,this);
this._replyHandler.addEventListener(glConversationReplyHandler.HIDE_REPLY_FULL,this._hideReply,this);this._replyHandler.addEventListener(glConversationReplyHandler.ADD_REPLY_ROW,this._addRow,this);this._integrateTabs()},disconnect:function(){for(id in this._replyToSelfTabs)if(this._replyToSelfTabs[id])this._replyToSelfTabs[id].elTab.parentNode.removeChild(this._replyToSelfTabs[id].elTab);this._replyToSelfTabs=null;this._replyHandler.removeEventListener(glConversationReplyHandler.SHOW_REPLY_FULL,this._showReply,
this);this._replyHandler.removeEventListener(glConversationReplyHandler.HIDE_REPLY_FULL,this._hideReply,this);this._replyHandler.removeEventListener(glConversationReplyHandler.ADD_REPLY_ROW,this._addRow,this);this._replyToSelfTabs=null;this._replyHandler=null;this._eventsContainer.reset();this.base()},_integrateTabs:function(){try{var doc=this._main.gmail.canvasDocument;for(var i=0;i<this._replyHandler.replies.length;i++){var reply=this._replyHandler.replies[i];if(!this._replyToSelfTabs[reply.id]){var elTab=
doc.createElement("TD");elTab.setAttribute("gtdi-replytoself","1");elTab.innerHTML="<div role='button' tabindex='0' class='mD'><img src='images/cleardot.gif' class='mL'/> <span class='mG'>"+giI18N.getString("ReplyToSelf")+"</span></div>";var elTd=doc.evaluate("..//TR/TD[3]",reply.elHeader,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;elTd.parentNode.insertBefore(elTab,elTd);this._eventsContainer.observe(reply.elHeader,"click",this._clickTabs,false);this._replyToSelfTabs[reply.id]=
{elTab:elTab}}}}catch(e){giLogger.warn(e,"gtdConversationReplyToSelf._integrateTabs",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_clickTabs:function(evt){try{var el=evt.target;var reply=this._replyHandler.getReplyByEl(el);while(el.parentNode&&el.nodeName!="TD")el=el.parentNode;if(el.nodeName=="TD")if(el==this._replyToSelfTabs[reply.id].elTab)if(this._replyHandler.isFullShowing(reply.elRoot))this._setReplyToSelf(reply,null,true);else{this._requestShow=reply.id;giUIObject.simulateMouseEvent(el.parentNode.firstChild.firstChild,
"click")}else if(this._replyHandler.isFullShowing(reply.elRoot))this._setReplyToSelf(reply,null,false)}catch(e){giLogger.warn(e,"gtdConversationReplyToSelf._clickTabs",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_setReplyToSelf:function(reply,el,v){try{var doc=this._main.gmail.canvasDocument;if(!reply)reply=this._replyHandler.getReplyByEl(el);var elTo=this._replyHandler.getToField(reply.elRoot);var elTr=elTo;while(elTr.parentNode&&elTr.nodeName!="TR")elTr=elTr.parentNode;if(v){elTr.style.display=
"none";this._replyToSelfTabs[reply.id].email=elTo.value;var filterName=this._main.prefs.getPref("components.conversation.reply_to_self.filter_name");if(filterName)filterName="+"+filterName;elTo.value=this._main.gmail.environment.getAccount().replace("@",filterName+"@");var elTdActive=doc.evaluate("..//tr/td[@class='mC']",reply.elHeader,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;giUIObject.removeClassName(elTdActive,"mC");giUIObject.addClassName(this._replyToSelfTabs[reply.id].elTab,
"mC")}else{elTo.value=this._replyToSelfTabs[reply.id].email;elTr.style.display="";giUIObject.removeClassName(this._replyToSelfTabs[reply.id].elTab,"mC")}}catch(e){giLogger.warn(e,"gtdConversationReplyToSelf._setReplyToSelf",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_showReply:function(evt){if(this._requestShow&&this._requestShow==evt.id){var reply=this._replyHandler.getReplyById(evt.id);this._setReplyToSelf(reply,null,true);this._requestShow=null}},_hideReply:function(evt){if(this._replyToSelfTabs[evt.id])giUIObject.removeClassName(this._replyToSelfTabs[evt.id].elTab,
"mC")},_addRow:function(evt){this._integrateTabs()}});
