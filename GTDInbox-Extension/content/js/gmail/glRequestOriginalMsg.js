var glRequestOriginalMsg=glRequest.extend({messageId:null,data:null,_requestCallback:function(){try{var m=this._xmlRequest.responseText.match(/Message-ID: <([^>]+)>/i);if(m)this.data=m[1]}catch(e){giLogger.warn("Error in parse: "+e,"glRequestOriginalMsg._requestCallback","url: "+this.url,this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);this.errors.push(e.toString())}try{this.dispatchEvent({name:glRequest.COMPLETED})}catch(e){giLogger.warn(e,"glRequestOriginalMsg._requestCallback COMPLETED",
null,this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID)}}},{createRequest:function(gmail,messageID){return new glRequestOriginalMsg(gmail,{view:"om",th:messageID})}});