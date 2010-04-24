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
 * TODO Given the problems with sandboxing, when we truly do need it, we could just pass it into the Gmail DOM and let it execute there (assuming that's where it comes from). 
 *
 * @class ?
 */
var giSafeJS = giBase.extend(null, {
    
    /**
     * Return an object (in mozilla, a sandbox; in chrome, just a simple object)
     * @function {Object} ?
     * @paramset 1
     * @param {String} v
     * @paramset 2
     * @param {Window} v
     * @return The definition object for safe execution
     */
    create: function(v) {
        
        // Use an Iframe. This works because this code runs in a Chrome contentScript, and is therefore a) cleaned up when tab closes, b) has guaranteed security to protect overall browser + page DOM
        // It is slightly limited, because Mozilla Sandbox can do things like "sb.window = window" (same for document) to enclose another environment; and iframe cannot. 
        // This seems to fail. They exist (can see them in debugger); but seem impossible to assign to a variable.
        //  No, it's Chrome blocking access to contentWindow/contentDocument.defaultView in this security space.
        //  Could throw it up to backgroundPage but is it worth it? No. And it's even crazier as that is much less secure.
        
        /*
        var iframe = document.createElement("IFRAME");
        console.log("iframe:"); // DEBUG
        console.log(iframe); // DEBUG
        iframe.id = 'glSandbox_'+(new Date()).valueOf();
        //iframe.style.display = "none";
        document.documentElement.appendChild(iframe);
        iframe.contentDocument.innerHTML = "<body></body>";
        
        // In Chrome, the 'container' is the iframe's Window, so it behaves the same as a Mozilla Sandbox
        var container = iframe.contentDocument.defaultView;
        //var container = iframe.contentWindow
        return container;
        */
        
        // SHOULD WORK IF WE USE AN IFRAME, COMMUNICATE VIA DOM EVENT FIRING, AND EXPLICITLY STATE THE VARIABLE NAME TO RETRIEVE (in .eval)
        
        return {};
    },
    
    
    /**
     * Safely execute code.
     * Results can be accessed via 'container'
     * @function {} ?
     * @param {String} code The code to safely execute
     * @param {Object} container The container returned by .create
     */
    eval: function(code, container) {
        
        /*
        var elScript = container.contentDocument.createElement("SCRIPT");
        elScript.innerHTML = code;
        console.log("add script"); // DEBUG
        container.contentDocument.body.appendChild(elScript);
        container.contentDocument.body.removeChild(elScript); // 'code' is expected to update global variables
        */
        
        container.result = null;
        try {
            var id = parseInt((new Date()).valueOf()*Math.random());
            var codeContained = "window.giSafeJSResult"+id+" = ("+code+")";
            eval(codeContained);
            container.result = window["giSafeJSResult"+id];
            window["giSafeJSResult"+id] = null;
            delete window["giSafeJSResult"+id];
        } catch(e) {
            giLogger.error(e, "giSafeJS.eval"); // Raise
        }
        
        
    },
    
})