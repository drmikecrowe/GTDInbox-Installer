var glThread=giBase.extend({_gmail:null,_loading:false,threadId:null,labels:null,subjectSnippet:null,subjectSnippetHtml:null,bodySnippetHtml:null,date:null,dateSnippetHtml:null,attachmentsCSV:null,contactsSnippetHtml:null,knownContacts:null,timestamp:null,timestampJS:null,_lastUpdateFromEvent:null,messages:null,isRead:false,isStarred:false,constructor:function(gmail){this._gmail=gmail},toString:function(){return this.threadId+": "+this.subjectSnippetHtml+" - "+this.date},hasLabel:function(labelname){return this.labels.indexOf(labelname)>
-1},hasSearchTerm:function(term){if(this.subjectSnippetHtml.indexOf(term)>-1)return true;if(this.bodySnippetHtml.indexOf(term)>-1)return true;if(this.hasContact(term))return true;if(this.messages)for(var i=0;i<this.messages.length;i++)if(this.messages[i].hasSearchTerm(term))return true},hasContact:function(contacts,isSender,isRecipient){if(typeof contacts=="string")contacts=[contacts];if(typeof isSender=="undefined"&&typeof isRecipient=="undefined")for(var i=0;i<contacts.length;i++)if(giUtil.testEmailAddress(contacts[i],
true)){if(m=/^\"(.+)\"$/.exec(contacts[i]))contacts[i]=m[1];for(var j=0;j<this.knownContacts.length;j++)if(this.knownContacts[j].email==contacts[i])return true}else for(var j=0;j<this.knownContacts.length;j++)if(glThread._hasContact_checkName(contacts[i],this.knownContacts[j].name))return true;if(this.messages)for(var i=0;i<this.messages.length;i++)if(this.messages[i].hasContact(contacts,isSender,isRecipient))return true;return false},isPersonal:function(){if(this.knownContacts.length==1){if(this.knownContacts[0].email==
this._gmail.environment.getAccount())return true}else return false},isDeleted:function(){return this.labels.indexOf("^k")>-1},isSpam:function(){return this.labels.indexOf("^s")>-1},hasId:function(id){if(id==this.threadId)return true;if(this.messages)for(var i=0;i<this.messages.length;i++)if(this.messages[i].messageId==id)return true;return false},getRecentId:function(){if(this.messages){var msg=this.messages[this.messages.length-1];return msg?msg.messageId:this.threadId}return this.threadId},updateFromEvent:function(evt){if(evt.name==
glActionManager.THREAD_CHANGED){if(evt.threadObject){if(!evt.threadObject.hasId(this.threadId))return false}else if(evt.thread!=this.threadId)return false;if(this._lastUpdateFromEvent===evt)return false;this._lastUpdateFromEvent=evt;switch(evt.action){case glActionManager.ADD_LABEL:if(this.labels.indexOf(evt.label)==-1)this.labels.push(evt.label);break;case glActionManager.REMOVE_LABEL:var index=this.labels.indexOf(evt.label);if(index!=-1)this.labels.splice(index,1);break;case glActionManager.STAR:this.isStarred=
true;break;case glActionManager.UNSTAR:this.isStarred=false;break;case glActionManager.ARCHIVE:var index=this.labels.indexOf("^i");if(index!=-1)this.labels.splice(index,1);break;case glActionManager.MOVE_INBOX:var index=this.labels.indexOf("^i");if(index==-1)this.labels.push("^i");break;case glActionManager.REPORT_SPAM:if(this.labels.indexOf("^s")==-1)this.labels.push("^s");break;case glActionManager.NOT_SPAM:var index=this.labels.indexOf("^s");if(index!=-1)this.labels.splice(index,1);break;case glActionManager.DELETE:if(this.labels.indexOf("^k")==
-1)this.labels.push("^k");break}return true}else return false},updateFromEnvironmentEvent:function(evt){var updated=false;switch(evt.name){case glEnvironment.RENAME_LABEL:var index=this.labels.indexOf(evt.label);if(index!=-1)this.labels.splice(index,1,evt.newLabel);updated=true;break;case glEnvironment.DELETE_LABEL:var index=this.labels.indexOf(evt.label);if(index!=-1)this.labels.splice(index,1);updated=true;break}return updated},isBasicLoaded:function(){if(this.threadId&&this.labels)return true;
return false},isSimpleLoaded:function(){if(this.threadId&&this.labels&&this.subjectSnippetHtml)return true;return false},isCompleteLoaded:function(){if(this.messages&&!this._loading)return true;return false},setLabels:function(labels){this.labels=labels},loadComplete:function(){if(this._loading)return;if(!this.threadId)giLogger.error("No thread id","glThread.load",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);this._loading=true;var request=new glRequest(this._gmail,{view:"cv",th:this.threadId,
prf:"1",rt:"j",search:"query",q:""});request.addEventListener(glRequest.COMPLETED,this._loadCompleteCallback,this);request.run()},_loadCompleteCallback:function(event){var request=event.target;if(!request.data)giLogger.error("Could not find request.data for glRequest with url: "+request.url,"glThread._loadCallback",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var data=request.data.getThreadData(true);this._loadFromData(data);this.messages=request.data.getThreadMessages();this._loading=
false;this.dispatchEvent({name:glThread.THREAD_LOADED})},_loadFromData:function(threadData){for(p in threadData)if(threadData.hasOwnProperty(p))this[p]=threadData[p];if(!this.subjectSnippetHtml)this.subjectSnippetHtml="";this.subjectSnippet=giUtil.decodeEntities(this.subjectSnippetHtml.replace(/<.+?>/g,"")).replace(/\s{2,}/g," ");if(!this.labels)this.labels=[];if(!this.knownContacts)this.knownContacts=[];for(var i=0;i<this.labels.length;i++)this.labels[i]=decodeURIComponent(this.labels[i]);if(this.timestamp){var timestampJS=
new String(this.timestamp);timestampJS=timestampJS.substring(0,timestampJS.length-3);this.timestampJS=parseInt(timestampJS)}this._isLoaded=true;this._loading=false;this.dispatchEvent({name:glThread.THREAD_SIMPLE_LOADED})}},{THREAD_SIMPLE_LOADED:"simple_loaded",THREAD_LOADED:"loaded",createBasic:function(threadId,labels,gmail){var thread=new glThread(gmail);thread.threadId=threadId;thread.labels=labels;return thread},createSimpleFromData:function(threadData,gmail){var thread=new glThread(gmail);thread._loadFromData(threadData);
return thread},createCompleteFromId:function(threadId,gmail){var thread=new glThread(gmail);thread.threadId=threadId;thread.loadComplete();return thread},_hasContact_checkName:function(testName,knownName){if(m=/^\"(.+)\"$/.exec(testName))if(m[1].indexOf(" ")>-1)return knownName.indexOf(m[1])>-1;else testName=m[1];var tokensName=testName.split(" ");var tokensKnown=knownName.split(" ");for(var k=0;k<tokensName.length;k++)for(var l=0;l<tokensKnown.length;l++)if(tokensName[k]==tokensKnown[l])return true}});
glThread.implement(giEventDispatcher);