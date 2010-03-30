var giServerErrorReport=giBase.extend(null,{sendError:function(doc,pageId,emailHash,email,userLevelInfo,systemLevelInfo,successCallback,failCallback){giLogger.logServerSubmit(pageId,userLevelInfo,systemLevelInfo);var gmailversion="not found";try{gmailversion=glPageWrapper.getGlobalStatic(doc,pageId,"gmailversion")}catch(e){}var log=giLogger.getErrorLog(pageId,false,true);if(log)if(giLogger.getHTMLLogCount(pageId,true)>0){var confirmStr="GTDInbox would like to include your Gmail layout.\n\nHowever, as it may include some text from your emails, we would like to check this is okay with you. (We do not store this information for more than 14 days - just while we fix the problem, then we delete it from our systems - and it's extremely useful).\n\n\nOkay to include Gmail layout information?";
try{confirmStr=giI18N.getString("ServerErrorReport.confirmApproveHTML")}catch(e){}if(!confirm(confirmStr))giLogger.removeUnapprovedHTML(pageId)}if(!email)try{var re=giUtil.getEmailRE(true,false,true);for(var i=0;i<log.length;i++)if(typeof log[i]=="string")log[i]=log[i].replace(re,"");else if(typeof log[i]=="object")for(p in log[i])if(typeof log[i][p]=="string")log[i][p]=log[i][p].replace(re,"")}catch(e){}var encoded=giJson.encode(log);if(encoded.length>28E3){var desiredLength=parseInt(log.length/
2);var log2=log.splice(desiredLength);var nextStep=function(){giServerErrorReport._sendError(doc,pageId,emailHash,email,userLevelInfo,systemLevelInfo,successCallback,failCallback,gmailversion,log2)};giServerErrorReport._sendError(doc,pageId,emailHash,email,userLevelInfo,systemLevelInfo,nextStep,nextStep,gmailversion,log)}else giServerErrorReport._sendError(doc,pageId,emailHash,email,userLevelInfo,systemLevelInfo,successCallback,failCallback,gmailversion,log)},_sendError:function(doc,pageId,emailHash,
email,userLevelInfo,systemLevelInfo,successCallback,failCallback,gmailversion,log){var version=giPluginManager?giPluginManager.version:"not-found";var userAgent=navigator?navigator.userAgent:"not-found";var params={log:log,dataFormatVersion:"3.0.1",email:email,emailHash:emailHash,pageId:pageId,version:version,gmailversion:gmailversion,userAgent:userAgent};var paramsStr="dataFormatVersion="+encodeURIComponent(params.dataFormatVersion)+"&json="+encodeURIComponent(giJson.encode(params));var xhr=new giXMLHttpRequest;
xhr.open("POST","http://www.gtdinbox.com/log_error.php",true);xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");xhr.setRequestHeader("Content-length",paramsStr.length);xhr.setRequestHeader("Connection","close");var me=this;xhr.onreadystatechange=function(evt){if(xhr.readyState==4)if(xhr.status==200){if(successCallback)successCallback(xhr)}else if(failCallback)failCallback(xhr)};xhr.send(paramsStr)}});