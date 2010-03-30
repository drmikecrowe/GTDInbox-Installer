/*
 * ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is GTDInbox.
 *
 * The Initial Developer of the Original Code is
 * Andy Mitchell (andy@gtdinbox.com)
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * 
 * Originally developed for GTDInbox for Gmail. http://www.gtdinbox.com
 * Find out more about developing with this codebase at http://www.gtdinbox.com/development.htm
 * Anyone who utilises this code is required to include this license notice in all covered code.
 * 
 * ***** END LICENSE BLOCK ***** */

/**
 * Static utility class.
 *
 *
 * @class ?
 */
var giJson = giBase.extend(null, {
    
    _json: null,
    _jsonMoz: null,
    
    _testJson: function() {
        if( !giJson._json ) {
            // Try native JSON for FF3.5+ and Chrome:
            if( (typeof JSON != 'undefined') && JSON.stringify ) giJson._json = JSON;
        }
        if( !giJson._json ) {
            // Otherwise, default to older Mozilla inbuilt
            if( typeof Components != 'undefined' ) giJson._jsonMoz = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
        }
        if( !giJson._json ) {
            giJson._json = {};
            var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;
            function quote(string) {escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a) {var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}
            function str(key,holder) {var i,k,v,length,mind=gap,partial,value=holder[key];if(typeof rep==='function') {value=rep.call(holder,key,value)}switch(typeof value) {case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value) {return'null'}gap+=indent;partial=[];if(typeof value.length == "number" && typeof value.splice != "undefined") {length=value.length;for(i=0;i<length;i+=1) {partial[i]=str(i,value)||'null'}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v}if(rep&&typeof rep==='object') {length=rep.length;for(i=0;i<length;i+=1) {k=rep[i];if(typeof k==='string') {v=str(k,value);if(v) {partial.push(quote(k)+(gap?': ':':')+v)}}}} else {for(k in value) {if(Object.hasOwnProperty.call(value,k)) {v=str(k,value);if(v) {partial.push(quote(k)+(gap?': ':':')+v)}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v}}
            if(typeof giJson._json.stringify!=='function') {giJson._json.stringify=function(value,replacer,space) {var i;gap='';indent='';if(typeof space==='number') {for(i=0;i<space;i+=1) {indent+=' '}} else if(typeof space==='string') {indent=space}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')) {throw new Error('JSON.stringify');}return str('',{'':value})}}
            if(typeof giJson._json.parse!=='function') {giJson._json.parse=function(text,reviver) {var j;function walk(holder,key) {var k,v,value=holder[key];if(value&&typeof value==='object') {for(k in value) {if(Object.hasOwnProperty.call(value,k)) {v=walk(value,k);if(v!==undefined) {value[k]=v} else {delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)) {text=text.replace(cx,function(a) {return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))) {j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j}throw new SyntaxError('JSON.parse');}};
        }
        
    },
    
    decode: function(s) {
        giJson._testJson();
        if( giJson._json ) return giJson._json.parse.apply(giJson._json, arguments);
        else return giJson._jsonMoz.decode.apply(giJson._jsonMoz, arguments);
    },
    
    encode: function(o) {
        giJson._testJson();
        if( giJson._json ) return giJson._json.stringify.apply(giJson._json, arguments);
        else return giJson._jsonMoz.encode.apply(giJson._jsonMoz, arguments);
    },
    
})