(function(){var glTrafficWatcherTracerInjected={_isShutdown:false,init:function(){var elem=glTrafficWatcherTracerInjected._getElem();elem.addEventListener("glTrafficWatcherTracerEvent",glTrafficWatcherTracerInjected._receiveEvent,false);var me=glTrafficWatcherTracerInjected;var xhrWin=top.document.getElementById("js_frame").contentDocument.defaultView;if(!xhrWin.XMLHttpRequest.prototype._glTwtSetup){xhrWin.XMLHttpRequest.prototype._glTwtOpen=xhrWin.XMLHttpRequest.prototype.open;xhrWin.XMLHttpRequest.prototype.open=
function(method,url,async,user,password){var d=this._glTwtOpen(method,url,async,user,password);this._glTwtParams={method:method.toString(),url:url.toString()};return d};glTrafficWatcherTracerInjected._xhrLoadFunction=function(evt){var xhr=evt.target;var params=xhr._glTwtParams;xhr._glTwtParams=null;params.responseText=xhr.responseText;if(!me._isShutdown)me._dispatchEvent("receiveXhrResponse",params)};xhrWin.XMLHttpRequest.prototype._glTwtSend=xhrWin.XMLHttpRequest.prototype.send;xhrWin.XMLHttpRequest.prototype.send=
function(body){var d=this._glTwtSend(body);if(this._glTwtParams)this._glTwtParams.body=body;if(!me._isShutdown){var evtResponse=me._dispatchEvent("examineRequest",this._glTwtParams);if(evtResponse&&evtResponse.listenForComplete){var xhr=this;this.addEventListener("load",me._xhrLoadFunction,false)}}return d}}xhrWin.XMLHttpRequest.prototype._glTwtSetup=true;top._glTwtGG_iframeFn=top.GG_iframeFn;glTrafficWatcherTracerInjected._glTwt_iframeData={};glTrafficWatcherTracerInjected._glTwt_iframeCachedData=
[];glTrafficWatcherTracerInjected._glTwt_iframeCachedData.push({responseDataId:1,url:top.location.href,responseData:top.VIEW_DATA});top.GG_iframeFn=function(win,data){var d=top._glTwtGG_iframeFn.apply(this,arguments);var url=win&&win.location?win.location.href:null;if(url&&data&&(url.indexOf("act=")!=-1||url.indexOf("search=")!=-1)){if(!glTrafficWatcherTracerInjected._glTwt_iframeData[url]){var responseDataId=(new Date).valueOf()+parseInt(Math.random()*100);glTrafficWatcherTracerInjected._glTwt_iframeData[url]=
{responseDataId:responseDataId,data:[]};var evtResponse=me._dispatchEvent("examineRequest",{url:url,body:"",responseDataId:responseDataId})}glTrafficWatcherTracerInjected._glTwt_iframeData[url].data.push(data);if(data[0]&&data[0]=="e"){var responseDataId=glTrafficWatcherTracerInjected._glTwt_iframeData[url].responseDataId;glTrafficWatcherTracerInjected._glTwt_iframeCachedData.splice(0,0,{responseDataId:responseDataId,url:url,responseData:glTrafficWatcherTracerInjected._glTwt_iframeData[url].data});
me._dispatchEvent("receiveIframeResponse",{url:url,responseDataId:responseDataId});glTrafficWatcherTracerInjected._glTwt_iframeData[url]=null;delete glTrafficWatcherTracerInjected._glTwt_iframeData[url];if(glTrafficWatcherTracerInjected._glTwt_iframeCachedData.length>10)glTrafficWatcherTracerInjected._glTwt_iframeCachedData.length=10}}return d}},getResponseData:function(responseDataId,previous){for(var i=0;i<glTrafficWatcherTracerInjected._glTwt_iframeCachedData.length;i++){var threadData=glTrafficWatcherTracerInjected._glTwt_iframeCachedData[i];
if(threadData.responseDataId==responseDataId)if(previous){if(glTrafficWatcherTracerInjected._glTwt_iframeCachedData[i+1])return glTrafficWatcherTracerInjected._glTwt_iframeCachedData[i+1].responseData}else return threadData.responseData}return null},_dispatchEvent:function(eventName,data,elem){if(!elem)elem=glTrafficWatcherTracerInjected._getElem();elem.setAttribute("event",eventName);if(data){var d={data:data};if(data.body)try{elem.setAttribute("eventData",glTrafficWatcherTracerInjected.JSON.stringify(d))}catch(e){}else elem.setAttribute("eventData",
glTrafficWatcherTracerInjected.JSON.stringify(d))}var evt=document.createEvent("Event");evt.initEvent("glTrafficWatcherTracerInjectedEvent",true,false);elem.dispatchEvent(evt);var returnValue=null;if(elem.hasAttribute("return")){var returnValueString=elem.getAttribute("return");returnValue=glTrafficWatcherTracerInjected.JSON.parse(returnValueString).data}elem.removeAttribute("event");if(data)elem.removeAttribute("eventData");elem.removeAttribute("return");return returnValue},_receiveEvent:function(evt){var elem=
glTrafficWatcherTracerInjected._getElem();var eventName=elem.getAttribute("event");var argsJson=elem.getAttribute("arguments");var args=[];if(argsJson)args=glTrafficWatcherTracerInjected.JSON.parse(argsJson);var returnValue=null;switch(eventName){case "shutdown":glTrafficWatcherTracerInjected._isShutdown=true;break;case "getResponseData":returnValue=glTrafficWatcherTracerInjected.getResponseData.apply(null,args);break}if(returnValue)try{elem.setAttribute("return",glTrafficWatcherTracerInjected.JSON.stringify({data:returnValue}))}catch(e){window._giPageWrapper._warn("Error in JSON encoding:"+
"\n"+e,"_runFunctionListener")}},_getElem:function(){if(!glTrafficWatcherTracerInjected._elem){var elem=document.createElement("DIV");elem.setAttribute("id","_glTrafficWatcherTracerInjected");elem.firebugIgnore=true;elem.setAttribute("style","display:none");document.documentElement.appendChild(elem);glTrafficWatcherTracerInjected._elem=elem}return glTrafficWatcherTracerInjected._elem},_log:function(data,elem){this._dispatchEvent("log",data,elem)}};if(window.JSON)glTrafficWatcherTracerInjected.JSON=
JSON;else{glTrafficWatcherTracerInjected.JSON={};var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,
function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(typeof rep==="function")value=rep.call(holder,key,value);switch(typeof value){case "string":return quote(value);case "number":return isFinite(value)?String(value):"null";case "boolean":case "null":return String(value);case "object":if(!value)return"null";gap+=indent;partial=[];if(typeof value.length==
"number"&&typeof value.splice!="undefined"){length=value.length;for(i=0;i<length;i+=1)partial[i]=str(i,value)||"null";v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v)partial.push(quote(k)+(gap?": ":":")+v)}}}else for(k in value)if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v)partial.push(quote(k)+
(gap?": ":":")+v)}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof glTrafficWatcherTracerInjected.JSON.stringify!=="function")glTrafficWatcherTracerInjected.JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number")for(i=0;i<space;i+=1)indent+=" ";else if(typeof space==="string")indent=space;rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!==
"number"))throw new Error("JSON.stringify");return str("",{"":value})};if(typeof glTrafficWatcherTracerInjected.JSON.parse!=="function")glTrafficWatcherTracerInjected.JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object")for(k in value)if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined)value[k]=v;else delete value[k]}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text))text=text.replace(cx,
function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse");}}glTrafficWatcherTracerInjected.init()})();