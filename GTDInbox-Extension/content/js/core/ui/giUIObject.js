var giUIObject=giBase.extend({_main:null,_isConnected:null,constructor:function(){if(this.constructor===giUIObject)throw new Error("Cannot be instantiated");},connect:function(main){this._isConnected=true;this._main=main},disconnect:function(){this._isConnected=false;this._main=null},isCacheable:function(){return false},isConnected:function(){return this._isConnected}},{addClassName:function(el,cn){if(giUIObject.hasClassName(el,cn))return;if(el.className)cn=el.className+" "+cn;el.className=cn},removeClassName:function(el,
cn){el.className=el.className.replace(cn,"");el.className=el.className.replace(/\s+$/,"")},hasClassName:function(el,cn){var re=new RegExp("(^|\\s)"+cn+"(\\s|$)");return re.test(el.className)},createGmailButton:function(name,v,options,gmail){var doc=gmail.canvasDocument;var elButton=doc.evaluate(".//td[@class='bN bM']/div[contains(@class, 'J-C41vtd-I')]",doc.body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;var styleA=elButton?true:false;var version=gmail.page.getGlobal(2);if(version>=
15395824)switch(name){case "gmail-send-button":case "gmail-header-button":var el=doc.createElement("DIV");if(name=="gmail-send-button")el.className="J-Zh-I J-J5-Ji Bq L3 J-C41vtd-I-JW";else el.className="J-Zh-I J-J5-Ji L3";el.setAttribute("role","button");if("gmail-header-button")el.setAttribute("tabindex","0");else el.setAttribute("tabindex","1");el.setAttribute("onfocus","javascript:this.className+=' J-C41vtd-I-JW'");el.setAttribute("onblur","javascript:this.className=this.className.replace(' J-C41vtd-I-JW', '')");
el.setAttribute("gtdimade","1");el.innerHTML=v;giUIObject.adornGmailButton(el,options,gmail);return{el:el,elTitle:el}}else if(version>=15016801&&styleA)switch(name){case "gmail-send-button":case "gmail-header-button":var el=doc.createElement("DIV");if(name=="gmail-send-button")el.className="J-C41vtd-I J-J5-Ji Bq L3 J-C41vtd-I-JW";else el.className="J-C41vtd-I J-J5-Ji L3";el.setAttribute("role","button");if("gmail-header-button")el.setAttribute("tabindex","0");else el.setAttribute("tabindex","1");
el.setAttribute("onfocus","javascript:this.className+=' J-C41vtd-I-JW'");el.setAttribute("onblur","javascript:this.className=this.className.replace(' J-C41vtd-I-JW', '')");el.setAttribute("gtdimade","1");el.innerHTML=v;giUIObject.adornGmailButton(el,options,gmail);return{el:el,elTitle:el}}else if(version>=14155931)switch(name){case "gmail-send-button":case "gmail-header-button":var el=doc.createElement("DIV");if(name=="gmail-send-button")el.className="J-K-I J-J5-Ji Bq L3";else el.className="J-K-I J-J5-Ji J-K-I-Js-Kc J-K-I-Js-KK ";
el.setAttribute("role","button");if("gmail-header-button")el.setAttribute("tabindex","0");else el.setAttribute("tabindex","1");el.setAttribute("onfocus","javascript:this.className+=' J-K-I-JO'");el.setAttribute("onblur","javascript:this.className=this.className.replace(' J-K-I-JO', '')");el.setAttribute("gtdimade","1");el.innerHTML="<div class='J-J5-Ji J-K-I-Kv-H'><div class='J-J5-Ji J-K-I-J6-H'><div class='J-K-I-KC'><div class='J-K-I-K9-KP'> </div><div class='J-K-I-Jz'>"+v+"</div></div></div></div>";
var elTitle=el.getElementsByClassName("J-K-I-Jz")[0];giUIObject.adornGmailButton(el,options,gmail);return{el:el,elTitle:elTitle}}else if(version>=13110601)switch(name){case "gmail-send-button":case "gmail-header-button":var el=doc.createElement("DIV");el.className="J-K-I J-J5-Ji ipG21e";el.setAttribute("role","button");if("gmail-header-button")el.setAttribute("tabindex","0");else el.setAttribute("tabindex","1");el.setAttribute("onfocus","javascript:this.className+=' J-K-I-JO'");el.setAttribute("onblur",
"javascript:this.className=this.className.replace(' J-K-I-JO', '')");el.setAttribute("gtdimade","1");el.innerHTML="<div class='J-J5-Ji J-K-I-Kv-H'><div class='J-J5-Ji J-K-I-J6-H'><div class='J-K-I-KC'><div class='J-K-I-K9-KP'> </div><div class='J-K-I-Jz'>"+v+"</div></div></div></div>";var elTitle=el.getElementsByClassName("J-K-I-Jz")[0];giUIObject.adornGmailButton(el,options,gmail);return{el:el,elTitle:elTitle}}else switch(name){case "gmail-send-button":case "gmail-reply-button":case "gmail-header-button":var el=
doc.createElement("DIV");el.className="goog-imageless-button goog-inline-block";if(name=="gmail-send-button")el.className+=" B8wEwc ipG21e";if(name=="gmail-reply-button")el.className+=" B8wEwc ipG21e";el.setAttribute("role","button");if("gmail-header-button")el.setAttribute("tabindex","0");else el.setAttribute("tabindex","1");el.setAttribute("onfocus","javascript:this.className+=' goog-imageless-button-focused'");el.setAttribute("onblur","javascript:this.className=this.className.replace(' goog-imageless-button-focused', '')");
el.setAttribute("gtdimade","1");if(options&&options.collapseLeft)el.className+=" "+"goog-imageless-button-collapse-left";if(options&&options.collapseRight)el.className+=" "+"goog-imageless-button-collapse-right";el.innerHTML="<div class='goog-inline-block goog-imageless-button-outer-box'><div class='goog-inline-block goog-imageless-button-inner-box'><div class='goog-imageless-button-pos'><div class='goog-imageless-button-top-shadow'> </div><div class='goog-imageless-button-content'>"+v+"</div></div></div></div>";
var elTitle=el.getElementsByClassName("goog-imageless-button-content")[0];giUIObject.adornGmailButton(el,options,gmail);return{el:el,elTitle:elTitle}}},adornGmailButton:function(el,options,gmail){var doc=gmail.canvasDocument;var elButton=doc.evaluate(".//td[@class='bN bM']/div[contains(@class, 'J-C41vtd-I')]",doc.body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;var styleA=elButton?true:false;var version=gmail.page.getGlobal(2);if(version>=15395824){if(options&&options.collapseLeft)giUIObject.addClassName(el,
"J-Zh-I-Js-Zq");if(options&&options.collapseRight)giUIObject.addClassName(el,"J-Zh-I-Js-Zj");if(options&&options.dropdown)el.innerHTML+="<div class='AZ J-J5-Ji'></div>"}else if(version>=15016801&&styleA){if(options&&options.collapseLeft)giUIObject.addClassName(el,"J-C41vtd-I-Js-I3Yihd");if(options&&options.collapseRight)giUIObject.addClassName(el,"J-C41vtd-I-Js-CpWD9d");if(options&&options.dropdown)el.innerHTML+="<div class='AZ J-J5-Ji'></div>"}else if(version>=14155931){if(options&&options.collapseLeft)giUIObject.addClassName(el,
"J-K-I-Js-I3Yihd");if(options&&options.collapseRight)giUIObject.addClassName(el,"J-K-I-Js-CpWD9d");if(options&&options.dropdown){var elInner=el.getElementsByClassName("J-K-I-Jz")[0];if(elInner)elInner.innerHTML+="<div class='AZ J-J5-Ji'>&nbsp;</div>"}}else{if(options&&options.collapseLeft)el.className+=" "+"goog-imageless-button-collapse-left";if(options&&options.collapseRight)el.className+=" "+"goog-imageless-button-collapse-right";if(options&&options.dropdown){var elInner=el.getElementsByClassName("goog-imageless-button-content")[0];
if(elInner)elInner.innerHTML+="<div class='AZ J-J5-Ji'>&nbsp;</div>"}}},cumulativeOffset:function(element,boundaryElement){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;if(boundaryElement&&element==boundaryElement)break}while(element);return[valueL,valueT]},getDimensions:function(element){var doc=element.ownerDocument;if(element.style.display!="none")return{width:element.offsetWidth,height:element.offsetHeight};return{width:0,height:0}},
pageScrollOffset:function(doc){doc=doc||document;var deltaX=window.pageXOffset||doc.documentElement.scrollLeft||doc.body.scrollLeft||0;var deltaY=window.pageYOffset||doc.documentElement.scrollTop||doc.body.scrollTop||0;return[deltaX,deltaY]},viewport:function(doc,useScrollOffset,incScrollBars){var win=doc.defaultView;var browserWidth=0;var browserHeight=0;if(incScrollBars){browserWidth=win.innerWidth;browserHeight=win.innerHeight}else{browserWidth=doc.documentElement.clientWidth;browserHeight=doc.documentElement.clientHeight}if(useScrollOffset){browserWidth-=
win.pageXOffset;browserHeight-=win.pageYOffset}return[browserWidth,browserHeight]},shallowestSnapshotItem:function(results,elContainer){var lowestCount=-1;var lowestEl=null;for(var i=0;i<results.snapshotLength;i++){var el=results.snapshotItem(i);var count=0;while(el.parentNode&&el!=elContainer){el=el.parentNode;count++}if(lowestEl){if(count<lowestCount){lowestEl=results.snapshotItem(i);lowestCount=count}}else{lowestCount=count;lowestEl=results.snapshotItem(i)}}return lowestEl},getBorderWidth:function(el){var css=
el.ownerDocument.defaultView.getComputedStyle(el,null);if(css.borderWidth){var width=css.borderWidth;return[width,width,width,width]}var widths=[];widths.push(css.borderTopWidth||"0px");widths.push(css.borderRightWidth||"0px");widths.push(css.borderBottomWidth||"0px");widths.push(css.borderLeftWidth||"0px");return widths},getPadding:function(el){var css=el.ownerDocument.defaultView.getComputedStyle(el,null);if(css.padding){var padding=css.padding;return[padding,padding,padding,padding]}var paddings=
[];paddings.push(css.paddingTop||"0px");paddings.push(css.paddingRight||"0px");paddings.push(css.paddingBottom||"0px");paddings.push(css.paddingLeft||"0px");return paddings},boundsCheckXY:function(elPopup,x,y,ignoreX,ignoreY){var popupDims=giUIObject.getDimensions(elPopup);var viewport=giUIObject.viewport(elPopup.ownerDocument);var scroll=giUIObject.pageScrollOffset(elPopup.ownerDocument);viewport[0]+=scroll[0];viewport[1]+=scroll[1];if(!ignoreX)if(x+popupDims.width>viewport[0])x=viewport[0]-popupDims.width-
18;if(!ignoreY)if(y+popupDims.height>viewport[1])y=viewport[1]-popupDims.height;if(x<0)x=0;if(y<0)y=0;return[x,y,viewport[0],viewport[1]]}});
