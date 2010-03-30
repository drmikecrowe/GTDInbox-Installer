var glActionBuffer=giBase.extend({async:true,_gmail:null,_requests:null,constructor:function(gmail){this._gmail=gmail;this._requests=[]},archiveThread:function(threadId){this.removeLabelFromThread(threadId,"^i")},addLabelToThread:function(threadId,label,callback){this._fireRequest(glRequest.createAddLabelRequest(this._gmail,label,threadId),callback)},removeLabelFromThread:function(threadId,label,callback){this._fireRequest(glRequest.createRemoveLabelRequest(this._gmail,label,threadId),callback)},
addStarToThread:function(threadId,callback){this._fireRequest(glRequest.createAddStarRequest(this._gmail,threadId),callback)},removeStarFromThread:function(threadId,callback){this._fireRequest(glRequest.createRemoveStarRequest(this._gmail,threadId),callback)},deleteThread:function(threadId,callback){this._fireRequest(glRequest.createDeleteThreadRequest(this._gmail,threadId),callback)},spamThread:function(threadId,callback){this._fireRequest(glRequest.createSpamThreadRequest(this._gmail,threadId),
callback)},notSpamThread:function(threadId,callback){this._fireRequest(glRequest.createNotSpamThreadRequest(this._gmail,threadId),callback)},markThreadRead:function(threadId,callback){this._fireRequest(glRequest.createMarkThreadRequest(this._gmail,threadId),callback)},createLabel:function(label,callback){this._fireRequest(glRequest.createCreateLabelRequest(this._gmail,label),callback)},renameLabel:function(label,newLabel,callback){this._fireRequest(glRequest.createRenameLabelRequest(this._gmail,label,
newLabel),callback)},deleteLabel:function(label,callback){this._fireRequest(glRequest.createDeleteLabelRequest(this._gmail,label),callback)},_fireRequest:function(request,callback){this._requests.push({request:request,callback:callback});request.addEventListener(glRequest.COMPLETED,this._requestCompletedCallback,this);request.run(this.async)},_requestCompletedCallback:function(evt){for(var i=0;i<this._requests.length;i++)if(evt.target===this._requests[i].request){this._requests[i].request.removeEventListener(glRequest.COMPLETED,
this._requestCompletedCallback);if(this._requests[i].callback)this._requests[i].callback();this._requests.splice(i,1);break}},shutdown:function(){}});