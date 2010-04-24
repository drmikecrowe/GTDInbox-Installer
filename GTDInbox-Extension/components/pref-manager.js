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

// This is really giPrefData.mozilla.js


// Constants
const CLASS_ID = Components.ID("{05aac0f1-503c-11de-8a39-0800200c9a66}");
const CLASS_NAME = "GTDInbox Preference Manager";
const CONTRACT_ID = "@gtdinbox.com/pref-manager;1";
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const nsIJSON = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON)

/**
 * Pref manager service class. Implemented as an XPCOM component to ensure only
 * one instance is ever in existence, it provides an interface to all preference
 * management required by the extension.
 *
 * @class giPrefManager
 */
function PrefManager() {
    // Required for pure JS XPCOM
    this.wrappedJSObject = this;

    // Initialize pref manager
    this._prefBranch = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("extensions.gtdinbox.");
    this._prefBranch.QueryInterface(Ci.nsIPrefBranch2);
    this._changed = false;

    this._saveTimer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    this.notify = this.save; // Alias them so that "this" can be used as callback

    // Call load to load prefs out of Firefox into memory
    this._load();
}

PrefManager.prototype = {
    /**
     * Loads the settings stored in Firefox pref manager and unserializes the
     * stored JSON.
     * @function ?
     */
    _load: function() {
        // Grab and unserialize account pref data
        this.prefs = this._jsonRead('account_prefs', {});

        // Populate _accounts from _prefs
        //this.accounts = [];
        //for(var account in this.prefs) this.accounts.push(account);

        // Grab and unserialize account default prefs (for creating new accounts and reseting existing ones)
        this.defaults = this._jsonRead('account_default', {});

        // Grab and unserialize plugin version data
        this.pluginVersions = this._jsonRead('plugin_versions', {});
    },

    /**
     * Saves the in-memory prefs to the FF pref branch
     * @function ?
     */
    save: function() {
        this._prefBranch.setCharPref('account_prefs', nsIJSON.encode(this.prefs));
        this._prefBranch.setCharPref('account_default', nsIJSON.encode(this.defaults));
        this._prefBranch.setCharPref('plugin_versions', nsIJSON.encode(this.pluginVersions));

        this._saveTimer.cancel();
        this._changed = false;
    },


    /**
     * Marks the prefs as being changed and schedules a save for 1 seconds from now
     * Used for cases where multiple setPref writes in quick succession. 
     * @function ?
     */
    requestSave: function() {
        this._changed = true;
        this._saveTimer.cancel();
        this._saveTimer.initWithCallback(this, 1*1000, Ci.nsITimer.TYPE_ONE_SHOT);
    },

    /**
     * Reads the given pref from the pref branch and decodes it, returning the
     * default if it fails
     * @function {Object} ?
     * @param {String} pref The pref path to read from
     * @param {Object} defaultValue The object to return if reading fails
     * @return The pref value
     */
    _jsonRead: function(pref, defaultValue) {
        var prefData = defaultValue;
        try {
            var prefString = this._prefBranch.getCharPref(pref);
            var prefData = nsIJSON.decode(prefString);
        } catch(e) {}
        return prefData;
    },

    QueryInterface: function(aIID) {
        if (!aIID.equals(Ci.nsISupports)) throw Cr.NS_ERROR_NO_INTERFACE;
        return this;
    }
};

// Other methods
function log(msg) {
    Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService).logStringMessage(msg);
}

// Factory Definition
var gPrefManagerSingleton = null;
var PrefManagerFactory = {
    createInstance: function (aOuter, aIID) {
        if (aOuter != null) throw Cr.NS_ERROR_NO_AGGREGATION;

        if(!gPrefManagerSingleton) gPrefManagerSingleton = new PrefManager();
        return gPrefManagerSingleton.QueryInterface(aIID);
    }
};

// Module definition
var PrefManagerModule = {
    registerSelf: function(aCompMgr, aFileSpec, aLocation, aType) {
        aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
        aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, CONTRACT_ID, aFileSpec, aLocation, aType);
    },

    unregisterSelf: function(aCompMgr, aLocation, aType) {
        aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
        aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);
    },

    getClassObject: function(aCompMgr, aCID, aIID) {
        if (!aIID.equals(Components.interfaces.nsIFactory)) throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
        if (aCID.equals(CLASS_ID)) return PrefManagerFactory;

        throw Components.results.NS_ERROR_NO_INTERFACE;
    },

    canUnload: function(aCompMgr) { return true; }
};
function NSGetModule(aCompMgr, aFileSpec) { return PrefManagerModule; }