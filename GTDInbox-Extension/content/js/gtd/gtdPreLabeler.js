var gtdPreLabeler=giBase.extend({_main:null,_labelRequests:null,constructor:function(main){giLogger.log("st","gtdPreLabeler.constructor",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this._main=main;this._labelRequests=[];this._main.gmail.environment.addEventListener(glEnvironment.EMAIL_SENT,this._emailSent,this)},unload:function(){this._main=null;this._labelRequests=[]},labelNextSent:function(labels,subject){var timestamp=(new Date).valueOf();this._labelRequests.push({labels:labels,subject:subject,
timestamp:timestamp});var me=this;setTimeout(function(){me._processFailSafe(timestamp)},4E3)},_emailSent:function(evt){if(this._labelRequests.length!=1)return;var request=this._labelRequests.shift();request.threadId=evt.threadId;var me=this;setTimeout(function(){me._processLabelRequest(request)},100)},_processLabelRequest:function(request){for(var j=0;j<request.labels.length;j++){var label=request.labels[j];this._main.gmail.actions.performAction(glActionManager.ADD_LABEL,request.threadId,glActionManager.USE_AJAX,
label)}var me=this;setTimeout(function(){me._main.gmail.environment.requestRefreshTL()},750)},_processFailSafe:function(timestamp){for(var i=0;i<this._labelRequests.length;i++)if(this._labelRequests[i].timestamp==timestamp){var request=this._labelRequests[i];this._labelRequests.splice(i,1);var search=new glSearch(this._main.gmail);search.addEventListener(glSearch.COMPLETED,this._processFailSafe_searchComplete,this);search.preLabelRequest=request;search.find("in:sent subject:"+request.subject);search.runBackground(0,
5);break}},_processFailSafe_searchComplete:function(evt){var search=evt.target;var threads=search.getResults();var found=false;if(threads.length>0)if(threads[0].timestampJS>=search.preLabelRequest.timestamp)found=true;if(found){search.preLabelRequest.threadId=threads[0].threadId;this._processLabelRequest(search.preLabelRequest)}else{var now=(new Date).valueOf();if(now-search.preLabelRequest.timestamp>1E3*60*2)giLogger.warn("No viable match found in search results","gtdPreLabeler._processFailSafe_searchComplete",
"For: "+search.getQuery()+" ("+threads.length+" threads found)",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);else{giLogger.log("Try again for "+search.getQuery()+" (number threads: "+threads.length+")","gtdPreLabeler._processFailSafe_searchComplete",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);this._labelRequests.push(search.preLabelRequest);var me=this;setTimeout(function(){me._processFailSafe(search.preLabelRequest.timestamp)},5E3)}}}});
