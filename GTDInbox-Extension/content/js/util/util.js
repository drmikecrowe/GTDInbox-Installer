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
 * Stephen Augenstein
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */


/**
 * Static utility class. Contains useful methods that don't really have a home
 * elsewhere.
 *
 * @class ?
 */
var giUtil = giBase.extend(null, {
    

	decodeEntities: function(s) {
		if( !s ) return "";
		s = s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&hellip;/g, String.fromCharCode(133));
		var m = s.match(/&#(\d+);/g);
		if( m ) {
			for( var i = 0; i < m.length; i++ ) {
				var m2 = m[i].match(/&#(\d+);/);
                if( m2 ) {
                    s = s.replace(m2[0], String.fromCharCode(m2[1]));
                }
			}
		}
		return s;
	},

	realEmail: function(email) {
		if( email && email.replace ) {
			return email.replace(/\+([^ \.]*?)@/g, "@");
		}
	},

    getEmailRE: function(freeMatch, incEnclosingQuotes, global) {
        if( global ) {
            if( freeMatch ) {
                // Find it anywhere in string
                return /([a-zA-Z0-9])+([\.a-zA-Z0-9\+_-])*@([a-zA-Z0-9\-])+(\.[a-zA-Z0-9_-]+)+/g;
            } else {
                if( incEnclosingQuotes ) {
                    return /^\"?([a-zA-Z0-9])+([\.a-zA-Z0-9\+_-])*@([a-zA-Z0-9\-])+(\.[a-zA-Z0-9_-]+)+\"?$/g;
                } else {
                    return /^([a-zA-Z0-9])+([\.a-zA-Z0-9\+_-])*@([a-zA-Z0-9\-])+(\.[a-zA-Z0-9_-]+)+$/g;
                }
            }
        } else {
            if( freeMatch ) {
                // Find it anywhere in string
                return /([a-zA-Z0-9])+([\.a-zA-Z0-9\+_-])*@([a-zA-Z0-9\-])+(\.[a-zA-Z0-9_-]+)+/;
            } else {
                if( incEnclosingQuotes ) {
                    return /^\"?([a-zA-Z0-9])+([\.a-zA-Z0-9\+_-])*@([a-zA-Z0-9\-])+(\.[a-zA-Z0-9_-]+)+\"?$/;
                } else {
                    return /^([a-zA-Z0-9])+([\.a-zA-Z0-9\+_-])*@([a-zA-Z0-9\-])+(\.[a-zA-Z0-9_-]+)+$/;
                }
            }
        }
    },

	testEmailAddress: function(e, allowEnclosingQuotes, freeMatch) {
        return giUtil.getEmailRE(freeMatch, allowEnclosingQuotes).test(e);
	},

	stripTags: function(s) {
		return s? s.replace(/\<[^>]+?\>/g, "") : "";
	},

	prepRE: function(s) {
		return s.replace(/([\"\'\*\=\|\!\:\{\}\\\.\+\-\?\&\[\]\^\$])/g, "\\$1");
	},

	bind: function(object, method) {
		return function() {
			return method.apply(object, arguments);
		};
	},

	hashLength: function(h) {
		var c = 0;
		for( i in h ) c++;
		return c;
	},

	hashKeysToArray: function(h) {
		var a = [];
		for( i in h ) a.push(i);
		return a;
	},

	arrayToHash: function(a, forceLowerCase, h) {
		h = h || {};
		for( var i = 0; i < a.length; i++ ) {
			if( forceLowerCase ) a[i] = a[i].toLowerCase();
			h[a[i]] = true;
		}
		return h;
	},

	hashToArray: function(h) {
		var a = [];
		for( k in h ) a.push( h[k] );
		return a;
	},

	stopEvent: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.returnValue = false;
			event.cancelBubble = true;
		}
	},
    
    createCookie: function(doc, name,value,days) {
        // Sourced from http://www.quirksmode.org/js/cookies.html
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        doc.cookie = name+"="+value+expires+"; path=/";
    },

    
    readCookie: function(doc, name, domain) {
        // Sourced from http://www.quirksmode.org/js/cookies.html
        if( !domain ) {
            // Find using regular cookie retrieval
            var nameEQ = name + "=";
            var ca = doc.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
            }
        }
        
        // Could not find. Is it hidden by HttpOnly or on another domain? Firefox can still detect.
        var domain = domain || doc.domain;
        var cookieMonster = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
        var cookies = cookieMonster.enumerator;
        while( cookies.hasMoreElements() ){
            var cookie = cookies.getNext();
            if( cookie instanceof Components.interfaces.nsICookie ) {
                if( cookie.host==("."+domain) || cookie.host==domain ) {
                    giLogger.log('COOKIE LOG HOST: ' + cookie.host);
                    if( cookie.name==name ) return decodeURIComponent(cookie.value);
                }
            }
        }
        
        return null;
    },
    
    deleteCookie: function(doc, name, domain) {
        giUtil.createCookie(doc, name, '', -1);
        
        var cookieMonster = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
        var cookies = cookieMonster.enumerator;
        while( cookies.hasMoreElements() ){
            var cookie = cookies.getNext();
            if( cookie instanceof Components.interfaces.nsICookie ) {
                if( cookie.host==(domain || doc.domain) ) {
                    if( cookie.name==name ) {
                        cookieMonster.remove(cookie.host, cookie.name, cookie.path, cookie.blocked);
                    }
                }
            }
        }
    },
});