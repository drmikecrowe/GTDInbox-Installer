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
 * Provides internal tracing and debugging functionality. It supports object
 * dumping, fast message logging, error/stack trace logging, and it can be easilly
 * disabled for release builds.
 *
 * TODO For full debugging power (and performance monitoring), prior to plugin instantiation:
 *      Detect all class properties in window that start with gi|gl|gtd|box etc.
 *      For each property on those classes that is a function, but in a proxy function.
 *      That proxy function records the parameters, records the function was called, adds an error handler, and records performance (run time, average run time, #calls, compounded run time)
 *      Put a button into Gmail (for x-browser) that outputs all the debugging info for performance (Error Console should show enough about errors - except parameters). 
 *
 * @class ?
 */
var giLogger = giBase.extend(null, {
    // Static Properties {
    /**
     * Whether or not logging is enabled
     * @property {static} ?
     */
    disabled: false,
    disabledLogs: false,
    
    /**
     * PageIDs (strings) that point to an array of logs, which can be a string (simple log) or error report. 
     * @type {Object.<string, Array>}
     */
    _pageLog: {},
    
    
    _listenerFuncs: [],

    /**
     * Used when no pageId passed in. General.
     * @type {string}
     */
    NO_PAGE_ID: 'no-page-id',
    
    /**
     * Used when code wanted to pass pageId in, but could not find pageId (e.g. reference to this._main.pageId failed)
     * @type {string}
     */
    UNKNOWN_PAGE_ID: 'unknown-page-id',
    
    /**
     * @type {event}
     */
    ERROR_REPORT_CREATED: 'error_report_created',

    //}

    // Static Methods {
    /**
     * Logs the given message to the console
     * @function {static} ?
     * @param {String} msg The message to log. 
     * @param {String} [context] The context of where the message originated
     * @param {String} [pageId] unique identifier for GTDInbox instance
     */
    log: function(msg, context, pageId) {
        // TODO Have no-page-id items added to recentLog of everything; preserves chronology. 
        if(giLogger.disabled) return;

        var logMsg = "";
        if(msg && msg.constructor == String) {
            if(context != undefined) {
                logMsg = context+': '+msg;
            } else {
                logMsg = msg;
            }
        }
        var d = new Date();
        logMsg += " [t: "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds()+"]";
        
        // Store as recently seen (used in 'warn')
        if( !pageId || pageId==giLogger.UNKNOWN_PAGE_ID ) {
            logMsg += " [pid: "+pageId+"]"; // Conserve space, only output if peculiar
            pageId = giLogger.NO_PAGE_ID;
        }
        if( !giLogger._pageLog[pageId] ) giLogger._pageLog[pageId] = [];
        giLogger._pageLog[pageId].push(logMsg);

        if(giLogger.disabledLogs) return;
        giLogger._output(logMsg);
    },

    /**
     * Logs the given message to the console, includings '[concern]' suffix on context.
     * @function {static} ?
     * @param {String} msg The message to log
     * @param {String} [context] The context of where the message originated
     * @param {String} [pageId] unique identifier for GTDInbox instance
     */
    logConcern: function(msg, context, pageId) {
        if( !context ) context = "";
        giLogger.log(msg, context + " [concern]", pageId);
    },

    /**
     * Logs the passed in message as an error and throws an exception
     * @function {static} ?
     * @param {String} msg The message to log
     * @param {String} [context] The context of where the error originated
     * @param {String} [pageId] unique identifier for GTDInbox instance
     */
    error: function(msg, context, pageId) {
        if(giLogger.disabled) return;
        if( !msg || !msg.toString ) return;
        msg = msg.toString();
        
        msg = msg.replace(/\n/g, '');
        giLogger.warn(msg, context, null, pageId);

        throw new Error(msg.toString()); // After error message logged, throw an exception
    },
    
    /**
     * Logs the passed in message as an error
     * @function {static} ?
     * @param {String} msg The message to log
     * @param {String} [context] The context of where the error originated
     * @param {String} [details] Additional details about the problem. 
     * @param {String} [pageId] unique identifier for GTDInbox instance
     */
    warn: function(msg, context, details, pageId) {
        if(giLogger.disabled) return;

        // Check integrity of message:
        if( !msg ) msg = "";
        if( !msg.toString ) return;

        msg = msg.toString();
        if( details && details.toString ) details = details.toString();
        
        msg = msg.replace(/\n/g, '');
        
        // TODO Remove #HOLIDAY
        if( msg.indexOf("chunk[")>-1 ) return;
        if( msg.indexOf("threads[")>-1 ) return;
        if( msg.indexOf("Parsing HTML")>-1 ) return;
        if( msg.indexOf("illegal character")>-1 ) return;
        if( msg.indexOf("inner data extraction")>-1 ) return;
        //if( msg.indexOf("SyntaxError")>-1 ) return;
        // End of #HOLIDAY
    

        var errorMsg = "";
        if(context != undefined) {
            errorMsg = "Error in "+context+": "+msg;
        } else {
            errorMsg = "Error: "+msg;
        }

        var stackMessage = "";
        try {
            throw new Error();
        } catch(e) {
            var stack = e.stack.toString().split("\n");
            stackMessage = "Exception thrown\n"+stack.slice(2).join("\n");
        }
        var d = new Date();
        errorMsg += " [t: "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds()+"]";

        if( !pageId || pageId==giLogger.UNKNOWN_PAGE_ID ) {    
            errorMsg += " [pid: "+pageId+"]"; // Only output if a problem
            pageId = giLogger.NO_PAGE_ID;
        }
        
        // Output:
        giLogger._output(errorMsg+"\n"+details+"\n"+stackMessage);
        
        // Generate error report:
        var errorReport = {
            'objType': 'errorReport',
            'stackTrace': stackMessage,
            'details': details,
            'errorMsg': errorMsg
        };
        if( !giLogger._pageLog[pageId] ) giLogger._pageLog[pageId] = [];
        giLogger._pageLog[pageId].push(errorReport);
        
        // Dispatch event:
        var evt = {'name': giLogger.ERROR_REPORT_CREATED, 'target':giLogger, 'errorReport':errorReport};
        for( var i = 0; i < giLogger._listenerFuncs.length; i++ ) {
            giLogger._listenerFuncs[i](evt);
        }
    },
    
    /**
     * Record HTML into the log
     * The HTML is generally a snapshot of Gmail in a given state, used to diagnose integration problems.
     * @function {}
     * @param {String} html
     * @param {String} systemLevelInfo Descriptive id for the html
     * @param {String} [userLevelInfo] User input information about why recording HTML
     * @param {boolean} approved True if user has agreed for HTML to be sent (if not, giServerErrorReport will confirm)
     * @param {String} pageId unique identifier for GTDInbox instance
     */
    logHTML: function(html, systemLevelInfo, userLevelInfo, approved, pageId) {
        
        giLogger.log("Logged HTML -> "+systemLevelInfo+". Approved: "+approved, null, pageId);
        
        var d = new Date();
        var timeFormatted = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
        var htmlReport = {'objType': 'logHTML', 'html': html, 'approved': approved, 'userLevelInfo': userLevelInfo, 'systemLevelInfo': systemLevelInfo, 'timeFormatted': timeFormatted};
        
        if( !pageId || pageId==giLogger.UNKNOWN_PAGE_ID ) pageId = giLogger.NO_PAGE_ID;
        if( !giLogger._pageLog[pageId] ) giLogger._pageLog[pageId] = [];
        giLogger._pageLog[pageId].push(htmlReport);
        
        
    },
    
    /**
     * Record the submission of info to the server. Forms part of debug trail.
     * @function {} ?
     * @param {}
     */
    logServerSubmit: function(pageId, userLevelInfo, systemLevelInfo) {
        
        var d = new Date();
        var timeFormatted = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
        var serverReport = {'objType': 'serverSubmit', 'userLevelInfo': userLevelInfo, 'systemLevelInfo': systemLevelInfo, 'timeFormatted': timeFormatted};
        
        if( !pageId || pageId==giLogger.UNKNOWN_PAGE_ID ) pageId = giLogger.NO_PAGE_ID;
        if( !giLogger._pageLog[pageId] ) giLogger._pageLog[pageId] = [];
        giLogger._pageLog[pageId].push(serverReport);
    },

    /**
     * Converts the given object into a printable string and logs it.
     * If doReturn is true, then it returns the string instead of logging it
     * @function {static String} ?
     * @param {Object} obj The object to dump
     * @param {Boolean} [doReturn] Whether or not to return the created string or simply log it
     * @param {int} [level] The indentation level (FOR INTERNAL USE ONLY)
     * @return The logged string if doReturn is true
     */
    dump: function(obj, doReturn, level) {
        if(giLogger.disabled) return null;
        if(doReturn == undefined) doReturn = false;
        if(level == undefined) level = 0;
        
        // TODO Replace with simple json.encode?

        var returnStr = "";
        var indent = "";
        for(var l = 0; l < level; l++) {
            indent += "\t";
        }

        if(obj === null) {
            returnStr = 'null';
        } else if(obj === undefined) {
            returnStr = 'undefined';
        } else if(obj.constructor.name == 'String') {
            returnStr = '"'+obj+'"';
        } else if(typeof obj == 'number') {
            returnStr = obj.toString();
        } else if(typeof obj == 'boolean') {
            returnStr = (obj)?'true':'false';
        } else if(obj.constructor.name == 'Array') {
            var arrayStr = "";
            if(obj.length) {
                arrayStr += "[\n";
                for(var i = 0; i < obj.length; i++) {
                    arrayStr += indent+"\t"+giLogger.dump(obj[i], false, level+1)+",\n";
                }
                arrayStr += indent + "]";
            } else {
                arrayStr += "[]";
            }
            returnStr = arrayStr;
        } else if(obj.constructor.name == 'Object') {
            var objStr = "{\n";
            var foundProps = false;
            for(var prop in obj) {
                foundProps = true;
                objStr += indent+"\t"+prop+": "+giLogger.dump(obj[prop], false, level+1)+",\n";
            }
            objStr += indent + "}";
            if(!foundProps) {
                objStr = "{}";
            }
            returnStr = objStr;
        } else if(obj && obj.toString) {
            returnStr = obj.toString();
        } else if(obj && obj.constructor) {
            returnStr = obj.constructor.toString();
        } else {
            returnStr = 'invalid';
        }

        if(level == 0) {
            if(doReturn) {
                return returnStr;
            } else {
                giLogger._output(returnStr);
                return null;
            }
        } else {
            return returnStr;
        }
    },

    /**
     * Method for logging final strings to the console
     * @function {static} ?
     * @param {String} msg The message to output
     */
    _output: function(msg) {
        if( !giLogger._consoleService ) giLogger._consoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
        giLogger._consoleService.logStringMessage(msg);
    },
    
    /**
     * Subscribe to simple notifications.
     * @function {} ?
     * @param {String} name
     * @param {Function} func
     */
    addEventListener: function(name, func) {
        switch( name ) {
            case giLogger.ERROR_REPORT_CREATED:
                var lf = giLogger._listenerFuncs;
                for( var i = 0; i < lf.length; i++ ) {
                    if( lf[i]==func ) return; // Already got it
                }
                lf.push(func);
                break;
        }
    },
    
    removeEventListener: function(name, func) {
        switch( name ) {
            case giLogger.ERROR_REPORT_CREATED:
                var lf = giLogger._listenerFuncs;
                for( var i = 0; i < lf.length; i++ ) {
                    if( lf[i]==func ) {
                        lf.splice(i,1);
                        return;
                    }
                }
                break;
        }
    },
    
    /**
     * Retrieve (reference) to array of error reports
     * @function {String[]} ?
     * @param {string} pageId - The page id to get error reports for
     * @param {boolean} [excGeneral] If true, do not include general errors (no page id)
     * @param {boolean} [clearLog] If true, delete log items from the array
     * @return Reference to errorReports arrya
     */
    getErrorLog: function(pageId, excGeneral, clearLog) {
        if( !pageId ) pageId = giLogger.NO_PAGE_ID;
        if( giLogger._pageLog[pageId] ) {
            var errorReports = giLogger._pageLog[pageId].slice(); // clone array (will not clone references, just structure)
            if( clearLog ) giLogger._pageLog[pageId].length = 0; // Clear
            if( excGeneral || !giLogger._pageLog[giLogger.NO_PAGE_ID] || pageId==giLogger.NO_PAGE_ID ) {
                return errorReports;
            } else if( giLogger._pageLog[giLogger.NO_PAGE_ID] ) {
                errorReports = errorReports.concat( giLogger._pageLog[giLogger.NO_PAGE_ID] );
                if( clearLog ) giLogger._pageLog[giLogger.NO_PAGE_ID].length = 0; // Clear
                return errorReports;
            }
        } else if( !excGeneral ) {
            var errorReports = giLogger._pageLog[giLogger.NO_PAGE_ID] || [];
            if( clearLog && giLogger._pageLog[giLogger.NO_PAGE_ID] ) giLogger._pageLog[giLogger.NO_PAGE_ID].length = 0; // Clear
            return errorReports;
        }
        return [];
    },
    
    /**
     * Number of Error Report objects created
     * Nb does not care about reports with no page id. Why? Because giPluginManager, if it crashes, should report all errors anyway (that's when errors without pageId really count). 
     * @function {int}
     * @param {string} pageId - The page id
     * @param {boolean} [excGeneral] If true, do not include general errors (no page id)
     * @return Number of Error Report objects created
     */
    getErrorReportCount: function(pageId, excGeneral) {
        if( !pageId ) pageId = giLogger.NO_PAGE_ID;
        
        var count = 0;
        var log = giLogger._pageLog[pageId];
        for( var i = 0; i < log.length; i++ ) {
            if( log[i].objType && log[i].objType=='errorReport' ) {
                count++;
            }
        }
        
        if( !excGeneral && giLogger._pageLog[giLogger.NO_PAGE_ID] ) {
            var log = giLogger._pageLog[giLogger.NO_PAGE_ID];
            for( var i = 0; i < log.length; i++ ) {
                if( log[i].objType && log[i].objType=='errorReport' ) {
                    count++;
                }
            }
        }
        
        return count;
        
    },

    /**
     * Return the number of HTML log objects in the log.
     * @function {int} ?
     * @param {string} pageId The page ID
     * @param {boolean} onlyUnapproved If true, only return count of unapproved
     * @return Number of HTML log objects
     */
    getHTMLLogCount: function(pageId, onlyUnapproved) {
        if( !pageId ) pageId = giLogger.NO_PAGE_ID;
        var count = 0;
        var log = giLogger._pageLog[pageId];
        for( var i = 0; i < log.length; i++ ) {
            if( log[i].objType && log[i].objType=='logHTML' && !log[i].removed ) {
                if( !onlyUnapproved || (onlyUnapproved && !log[i].approved) ) {
                    count++;
                }
            }
        }
        return count;
    },
    
    /**
     * Remove HTML objects that are not approved from the log
     * @function {} ?
     * @param {string} pageId The page ID
     */
    removeUnapprovedHTML: function(pageId) {
        if( !pageId ) pageId = giLogger.NO_PAGE_ID;
        var log = giLogger._pageLog[pageId];
        for( var i = 0; i < log.length; i++ ) {
            if( log[i].objType && log[i].objType=='logHTML' ) {
                if( !log[i].approved ) {
                    log[i].html = "<html><!-- user-denied-approval --></html>";
                    log[i].removed = true;
                }
            }
        }
    },

    /**
     * Delete arrays/objects for page.
     * @function {} ?
     * @param {string} pageId The UID for the page
     */
    removePageLogs: function(pageId) {
        if( giLogger._pageLog[pageId] ) {
            delete giLogger._pageLog[pageId];
        }
    },
    
    /**
     * From a given element, work back to the root, creating a valid HTML
     * structure of nodenames and attributes (but no content).
     * @function {String} ?
     * @param {Element} el the start node
     * @return the html from the root to the el, on a linear path.
     */
    dumpHTMLStructure: function(el) {
        var html = "";
        while( el.parentNode ) {
            var nodeName = el.nodeName;
            var attributes = [];
            for( var i = 0; i < el.attributes.length; i++ ) {
                attributes.push("\""+el.attributes[i].name+"\"=\""+el.attributes[i].value+"\"");
            }
            html = "<"+nodeName+" "+attributes.join(" ")+">"+html+"</"+nodeName+">";
            el = el.parentNode;
        }
        return html;
    }
    
    
    //}
});
