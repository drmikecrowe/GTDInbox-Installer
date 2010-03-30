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
 * Originally developed for GTDInbox for Gmail. http://www.gtdinbox.com
 * Find out more about developing with this codebase at http://www.gtdinbox.com/development.htm
 * Anyone who utilises this code is required to include this license notice in all covered code.
 * 
 * ***** END LICENSE BLOCK ***** */


/**
 * Static class containing the main extension initializer (called when overlay
 * loads).
 *
 * @class ?
 */
var giMain = giBase.extend(null, {
    
    
    /**
     * True if first Gmail page has been loaded
     * @type {static boolean}
     */
    _firstLoad: false,
    
    /**
     * @type {giI18NBackground}
     */
    i18NBackground: null,
    
    
    // Static Methods {
    
    /**
     * giMain main initializer, which is called once on Firefox load for a window.
     * Sets up page load event listeners.
     * @function {static} ?
     */
    initialize: function() {
        giLogger.log('Initializing...', 'giMain');

        /*
         Corrective code for Alpha 14 mistake in defaults-json that completely broke it
         If spot error, wipe out and start over
        */
        /*
        var tmpPrefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        var tmpJs = tmpPrefManager.getCharPref('extensions.gtdinbox.account_prefs');
        if( tmpJs && tmpJs.indexOf('"gtd":{}')>-1 ) {
            // It failed, wipe
            tmpPrefManager.setCharPref('extensions.gtdinbox.account_default', '');
            tmpPrefManager.setCharPref('extensions.gtdinbox.account_prefs', '');
            tmpPrefManager.setCharPref('extensions.gtdinbox.plugin_versions', '');
            tmpPrefManager.clearUserPref('extensions.gtdinbox.account_default');
            tmpPrefManager.clearUserPref('extensions.gtdinbox.account_prefs');
            tmpPrefManager.clearUserPref('extensions.gtdinbox.plugin_versions');
        }
        */
        


        // Listen to Gmail page loads to invoke giPageManager:
        try {
            giLogger.log('st', 'giMain.initialize');
            var appcontent = document.getElementById("appcontent");
            if( !appcontent ) {
                appcontent = window.document.getElementById("browser_content"); // Prism
            }
            appcontent.addEventListener("DOMContentLoaded", giMain._pageLoad, true);
        } catch(e) {
            giLogger.warn(e, 'giMain.initialize');
        }
        

        giLogger.log('Initialized', 'giMain');
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
        
        try {
            var doc = evt.originalTarget;
            var url = (doc && doc.location && doc.location.href) ? doc.location.href : '';
            if(/^http(s?):\/\/mail.google.com\/\w+\/./.test(url)) {
                
                if( !giMain._firstLoad ) {
                    // First load, load the i18n:
                    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
                    var curLocale = "en-US";
                    try {
                        curLocale = prefs.getCharPref("general.useragent.locale");
                    }
                    catch (e) {}
                    giMain.i18NBackground = new giI18NBackground();
                    giMain.i18NBackground.setUserLocales([curLocale]);
                    giMain.i18NBackground.load("chrome://gtdinbox/");
                    
                    
                }
                
                giPageManager.loadPage(doc, 'mozilla');
                
                giMain._firstLoad = true;
            }
        } catch(e) {
            giLogger.warn(e, 'giMain._pageLoad');
        }
        
        
    }
    
    //}
});


// Run giMain.initialize() when ready and remove listener
var _giLoadFunc = function() {
    window.removeEventListener('load', _giLoadFunc, true);
    giMain.initialize();
};
window.addEventListener('load', _giLoadFunc, true);