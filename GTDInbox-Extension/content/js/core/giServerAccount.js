var giServerAccount=giBase.extend({_username:null,_passwordHash:null,_token:null,_isLoaded:false,_accountType:null,_loggedIn:false,_errorLog:null,pageId:null,version:null,eb:null,constructor:function(pageId,tmpGrace_allow){this.tmpGrace_allow=tmpGrace_allow;this.pageId=pageId},load:function(username,passwordHash){this._username=username;this._errorLog=[];if(passwordHash){this._passwordHash=passwordHash;this._isLoaded=false;var xhr=new giXMLHttpRequest;xhr.open("GET","http://www.gtdinbox.com/account/login_ws.php?email="+
escape(this._username)+"&passwordHash="+escape(this._passwordHash)+"&browser="+giPluginManager.browserName,true);var me=this;xhr.onreadystatechange=function(evt){me._onreadystatechange_load(evt)};xhr.send(null)}else this._isLoaded=true},_onreadystatechange_load:function(evt){giLogger.log("server response for "+this._username,"giServerAccount._onreadystatechange_load",this.pageId);var xhr=evt.target;if(xhr.readyState==4){try{giLogger.log("server response 4 [complete] from "+this._username+", status: "+
xhr.status,"giServerAccount._onreadystatechange_load",this.pageId);var error=null;if(xhr.status==200){this._loggedIn=false;giLogger.log("server data for "+this._username+": "+xhr.responseText,"giServerAccount._onreadystatechange_load",this.pageId);var data=giJson.decode(xhr.responseText);if(data.success==true){this._loggedIn=true;switch(data.accountType){case "plus":this._accountType=giServerAccount.TYPES.PLUS;break;case "free":this._accountType=giServerAccount.TYPES.FREE;break;default:error={type:"unrecognisedAccount"};
this._loggedIn=false}}else{error={type:data.errorType};switch(data.errorType){case "db":if(this.tmpGrace_allow)error.tmpGrace=true;break;case "unknownCredentials":break;default:error={type:"unrecognisedErrorType"}}}this.version=data.version;this.eb=data.eb}else{error={type:"serverFail"};error.tmpGrace=true;switch(xhr.status){case 404:error.msg="Page not found";break;case 500:error.msg="Internal server error";break;default:error.msg=xhr.status}}}catch(e){error={type:"exception",msg:e.toString()}}if(error&&
error.tmpGrace&&this.tmpGrace_allow){this._loggedIn=true;this._accountType=giServerAccount.TYPES.PLUS;error=null}if(error)this._errorLog.push(error);this._isLoaded=true;this.dispatchEvent({name:giServerAccount.LOADED})}},unload:function(){},getUsername:function(){return this._username},getPasswordHash:function(){return this._passwordHash},isLoaded:function(){return this._isLoaded},isLoggedIn:function(){if(!this._isLoaded)return false;return this._loggedIn},getAccountType:function(){return this._accountType},
getErrorLog:function(){return this._errorLog},isRegistered:function(){if(this._passwordHash)return true;else return false}},{TYPES:{FREE:"account_type_free",PLUS:"account_type_plus"},LOADED:"server_account_loaded"});giServerAccount.implement(giEventDispatcher);
