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
 * Andy Mitchell (andy@gtdinbox.com)
 *
 * ***** END LICENSE BLOCK ***** */


/**
 * Manages pages loads, page base class initialization, and plugin initialization.
 *
 * @class ?
 */
var giPageManager = giBase.extend(null ,{
    // Static Properties {
    /**
     * Stores all page instances currently loaded in the browser. Used to prevent
     * redundant instances and make garbage collection easier.
     * @property {static Array} ?
     */
    _pageInstances: [],
    
    /**
     * True if first Gmail page has been loaded
     * @type {static boolean}
     */
    _firstLoad: false,
    
    /**
     * Set to true by giLoadFailMonitor when the first instance of GTDInbox is successful loaded.
     * Used to detect a complete failure of GTDInbox, or just a failure for a given page document.
     * @type {static boolean}
     */
    hasSuccessfulLoad: false,
    
    /**
     * @type {giI18NBackground}
     */
    i18NBackground: null,

    //}

    // Static Methods {
    /**
     * Called by {giPageManager} once it's ready, it sets up page load event listeners.
     * @function {static} ?
     */
    initialize: function() {
        try {
            giLogger.log('st', 'giPageManager.initialize');
            var appcontent = document.getElementById("appcontent");
            if( !appcontent ) {
                appcontent = window.document.getElementById("browser_content"); // Prism
            }
            appcontent.addEventListener("DOMContentLoaded", giPageManager._pageLoad, true);
        } catch(e) {
            giLogger.warn(e, 'giPageManager.initialize');
        }
    },

    /**
     * Called when a browser page is loaded. It tries to determine if it's a
     * gmail page load and then determines if there are plugins registered for
     * that type of gmail page load. If there are, it instantiates the page base
     * class and then loads all the plugins for that page type.
     * @function {static} ?
     * @param {Event} evt The DOMContentLoaded event
     */
    _pageLoad: function(evt) {
        
        var doc = evt.originalTarget;
        if( doc._gtdiStarted ) return; // Caused by dest= looping.
        var url = (doc && doc.location && doc.location.href) ? doc.location.href : '';
        if(!giPageManager._validPageLoad(evt, url)) return;
        try {
        
            // Extract doc and URL
            
            var url = (doc && doc.location && doc.location.href) ? doc.location.href : '';
            
            if( !giPageManager._firstLoad ) {
                // First load, load the i18n:
                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
                var curLocale = "en-US";
                try {
                    curLocale = prefs.getCharPref("general.useragent.locale");
                }
                catch (e) {}
                giPageManager.i18NBackground = new giI18NBackground();
                giPageManager.i18NBackground.setUserLocales([curLocale]);
                giPageManager.i18NBackground.load("chrome://gtdinbox/");
            }
            // Load it
            giLogger.log("Start page load: " + url, "giPageManager._pageLoad");
            doc._gtdiStarted = true;
            giPluginManager.startLoadPage(doc, 'mozilla');
            
            giPageManager._firstLoad = true;
            
            
            
            
            /*
            // Instantiate debugAutoSubmit - used for people who don't see anything in Gmail (not even the yellow box) and don't want to use Error Console.
            var pageId = "";
            var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
            try {
                var debugAutoSubmit = prefs.getCharPref("extensions.gtdinbox.debugAutoSubmit");
                if( debugAutoSubmit ) {
                    giLogger.log("Setting up debugAutoSubmit timeout.", "giPageManager._pageLoad", pageId);
                    setTimeout( function() { // 1 min timeout to submit data to the server
                        try {
                            giLogger.warn("debugAutoSubmit is active - generating fake error for server", "giPageManager._pageLoad", null, pageId);
                            var email = glPageWrapper.getGlobalStatic(doc, null, "account");
                            var emailHash = email? gihex_md5(email) : "";
                            var stopMsg = "\n\n\nIf you want to stop sending debug information automatically everytime you load Gmail (and stop this message), in Firefox go to 'about:config' (no quotes), find the setting 'extensions.gtdinbox.debugAutoSubmit', right click it, and select Reset. Then restart Firefox.";
                            var successCallback = function(xhr) {
                                alert("Thank you - debug information from your account ("+email+") was submitted to the GTDInbox Team."+stopMsg);
                            };
                            var failCallback = function(xhr) {
                                alert("Oh oh, there was a problem.\n\nWe could not send your debug information to the GTDInbox Team.\n\nPlease email support@gtdinbox.com with the following error information\n:"+xhr.responseText+stopMsg);
                            };
                            giServerErrorReport.sendError(doc, pageId, emailHash, email, "", "giPageManager._pageLoad [debugAutoSubmit]", successCallback, failCallback);
                        } catch(e) {
                            alert("Oh oh, there was a problem.\n\nWe could not send your debug information to the GTDInbox Team.\n\nPlease email support@gtdinbox.com with the following error information\n:"+e.toString()+stopMsg);
                            giLogger.warn(e, "giPageManager._pageLoad [debugAutoSubmit]", null, pageId);
                        }
                    }, 60000); 
                }
            } catch(e) {
                giLogger.logConcern("Could not retrieve the debugAutoSubmit preference. ("+e+")", "giPageManager._pageLoad", pageId);
            }
            */
            
        } catch(e) {
            giLogger.warn(e, 'giPageManager._pageLoad');
        }
    },

    

    /**
     * Checks whether the page load event target is a valid page load. Must be as
     * quick as possible, as it is called every page load.
     * @function {static Boolean} ?
     * @param {Event} evt The page load event
     * @param {String} url The url to load
     * @return Whether the page load is valid
     */
    _validPageLoad: function(evt, url) {
        var doc = evt.originalTarget;
        if( !url ) url = (doc && doc.location && doc.location.href) ? doc.location.href : '';
        
        if( url.indexOf("dest=")>-1 ) {
            // With dest=, it happens from mail.mfried.com (Michael Lebor), and Gmail never loads (because dest= is refused). We could set a timeout if we detect test= and try again (if we risk loading too soon). Or we can extract the url from 'dest' and use that.
            // Most probable cause - bookmarking during load (which is what Michael did).
            // url: "http://blah.com/?dest=http%3A%2F%2Fmail.google.com"
            // real url: https://mail.google.com/a/mfried.com/?dest=http%3A%2F%2Fmail.google.com%2Fa%2Fmfried.com%2F#advanced-search/from=me&to=andy&subset=all&has=gtd&within=1d/1272e8b387782c0e
            // The problem is, it's not just during loading. dest= can stay permantely in place; with the hash staying put at the end. We need to permit it fully.
            
            /*
            // No need to do this - the doc loads fine; just make sure the same doc can't be loaded twice.
            if( !doc._gtdiRetry ) doc._gtdiRetry = 0;
            if( doc._gtdiRetry>20 ) {
                return false;
            } else {
                doc._gtdiRetry++;
                setTimeout( function() {
                    giPageManager._pageLoad(evt);
                }, 500)
            }
            */
            
            // Beware URLs like https://mail.google.com/a/mfried.com/login_complete.html?dest=http%3A%2F%2Fmail.google.com%2Fa%2Fmfried.com%2F&auth=DQAAAJkAAAC7z555puIpkM0XNKhOLHApUaTy3wxF27rWAfB340yneKo8dR1fVSdHBYg3b8ZxXjs3vRi5tHyGdnOd7g_Qi0KFNIttkcbe1PaAMaUbxLMe4JRut5yZCJTXowoJWQfhh8Zuh7p4vf-djLkxHjHlPOfgyTSF2IVglMKxY_ZEdImuHNJBsmHB62rrIwpwFHlpAgMpKibFwyDRWtBXZiTL6doT&husr=mlebor%40mfried.com need to be stoped.
            // Keep standard URLs, but permit dest=, with additional restrictions. 
            //var splitter = url.split("dest=");
            //url = decodeURIComponent(splitter[1]);
        }

        // Is it roughly a gmail page?
        if(!/^http(s?):\/\/mail.google.com/.test(url)) return false;

        // Are we working with a real page load?
        var found = false;
        if( typeof gBrowser=="undefined" ) { // Prism
            var browser = document.getElementById("browser_content");
            if( doc==browser.contentDocument ) {
                found = true;
            }
        } else {
            var browsers = gBrowser.browsers;
            for(var i = browsers.length - 1; i>=0; i--) {
                if(doc == browsers[i].contentDocument) {
                    found = true;
                    break;
                }
            }
        }
        if( found ) {
            if( doc.defaultView.top!=doc.defaultView ) { // Double test not an iframe
                found = false; 
            }
        }
        
        
        if(found) {
            return true;
        } else {
            return false;
        }

    },


    
    //}
});