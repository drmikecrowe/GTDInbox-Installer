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
        return Components.utils.Sandbox(v);
    },
    
    
    /**
     * Safely execute code.
     * Results can be accessed via 'container'
     * @function {} ?
     * @param {String} code The code to safely execute
     * @param {Object} container The container returned by .create
     */
    eval: function(code, container) {
        var codeContained = "var result = ("+code+")";
        Components.utils.evalInSandbox(codeContained, container);
        return container.result;
    },
    
})