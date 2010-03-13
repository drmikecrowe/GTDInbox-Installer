/*
 * Code is almost directly copied from firebug-http-observer.js in the Firebug
 * extension
 */

// Constants
const CLASS_ID = Components.ID("{40004b06-77ac-41ef-be0a-cd910679b86e}");
const CLASS_NAME = "GTDInbox Gmail HTTP Observer Service";
const CONTRACT_ID = "@gtdinbox.com/glgmail-http-observer;1";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
var categoryManager = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);


// HTTP Request Observer implementation
function HttpRequestObserver() {
    this.observers = [];
}

HttpRequestObserver.prototype = {
    initialize: function() {
        observerService.addObserver(this, "quit-application", false);
        observerService.addObserver(this, "http-on-modify-request", false);
        observerService.addObserver(this, "http-on-examine-response", false);
    },

    shutdown: function() {
        observerService.removeObserver(this, "quit-application");
        observerService.removeObserver(this, "http-on-modify-request");
        observerService.removeObserver(this, "http-on-examine-response");
    },

    /* nsIObserve */
    observe: function(subject, topic, data) {
        if (topic == "app-startup") {
            this.initialize();
            return;
        } else if (topic == "quit-application") {
            this.shutdown();
            return;
        }

        try {
            if (topic == "http-on-modify-request" || topic == "http-on-examine-response") {
                this.notifyObservers(subject, topic, data);
            }
        } catch (err) {}
    },

    /* nsIObserverService */
    addObserver: function(observer, topic, weak) {
        if (topic != "glgmail-http-event") throw Cr.NS_ERROR_INVALID_ARG;

        this.observers.push(observer);
    },

    removeObserver: function(observer, topic) {
        if (topic != "glgmail-http-event") throw Cr.NS_ERROR_INVALID_ARG;

        for (var i=0; i<this.observers.length; i++) {
            if (this.observers[i] == observer) {
                this.observers.splice(i, 1);
                break;
            }
        }
    },

    notifyObservers: function(subject, topic, data) {
        for(var i=0; i<this.observers.length; i++) this.observers[i].observe(subject, topic, data);
    },

    enumerateObservers: function(topic) { return null; },

	/* nsISupports */
	QueryInterface: function(iid) {
        if (iid.equals(Ci.nsISupports) || iid.equals(Ci.nsIObserverService) || iid.equals(Ci.nsIObserver)) {
 		    return this;
 		}

		throw Cr.NS_ERROR_NO_INTERFACE;
	}
}

function safeGetName(request) {
    try {
        return request.name;
    } catch (exc) {
        return null;
    }
}


// Service factory
var gHttpObserverSingleton = null;
var HttpRequestObserverFactory = {
    createInstance: function (outer, iid) {
        if (outer != null) throw Cr.NS_ERROR_NO_AGGREGATION;

        if (iid.equals(Ci.nsISupports) || iid.equals(Ci.nsIObserverService) || iid.equals(Ci.nsIObserver)) {
            if (!gHttpObserverSingleton) gHttpObserverSingleton = new HttpRequestObserver();

            return gHttpObserverSingleton.QueryInterface(iid);
        }

        throw Cr.NS_ERROR_NO_INTERFACE;
    },

	QueryInterface: function(iid) {
		if (iid.equals(Ci.nsISupports) || iid.equals(Ci.nsISupportsWeakReference) || iid.equals(Ci.nsIFactory)) return this;

		throw Cr.NS_ERROR_NO_INTERFACE;
	}
};


// Module implementation
var HttpRequestObserverModule = {
    registerSelf: function (compMgr, fileSpec, location, type) {
        compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
        compMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, CONTRACT_ID, fileSpec, location, type);

        categoryManager.addCategoryEntry("app-startup", CLASS_NAME, "service," + CONTRACT_ID, true, true);
    },

    unregisterSelf: function(compMgr, fileSpec, location) {
        compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
        compMgr.unregisterFactoryLocation(CLASS_ID, location);

        categoryManager.deleteCategoryEntry("app-startup", CLASS_NAME, true);
    },

    getClassObject: function (compMgr, cid, iid) {
        if (!iid.equals(Ci.nsIFactory)) throw Cr.NS_ERROR_NOT_IMPLEMENTED;
        if (cid.equals(CLASS_ID)) return HttpRequestObserverFactory;

        throw Cr.NS_ERROR_NO_INTERFACE;
    },

    canUnload: function(compMgr) {
        return true;
    }
};


function NSGetModule(compMgr, fileSpec) {
    return HttpRequestObserverModule;
}