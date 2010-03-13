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
var giVersionCompare = giBase.extend(null, {
    
    /**
     * Compare two version numbers
     * @function {Boolean} ?
     * @param {String} first e.g. 1.1.1
     * @param {String} second e.g. 1.1.0
     * @return True if first is higher than second (in the example, true)
     */
    greaterThan: function(first, second) {
        // Must handle input like 1.1 vs 1.1.1 (the second is greater), and 1.1.1 vs 1.1 (the first is greater)
        
        var splitFirst = first.split(".");
        var splitSecond = second.split(".");
        
        for( var i = 0; i <= splitFirst.length; i++ ) { // NOTE the <= - proceed 1 passed end of splitFirst
            
            if( splitFirst[i] && isNaN(splitFirst[i]) ) throw new Error("Cannot compare number part '"+splitFirst[i]+"'");
            if( splitSecond[i] && isNaN(splitSecond[i]) ) throw new Error("Cannot compare number part '"+splitSecond[i]+"'");
            
            splitFirst[i] = parseInt(splitFirst[i]);
            splitSecond[i] = parseInt(splitSecond[i]);
            
            if( !splitFirst[i] && splitSecond[i+1] ) { // e.g. 1.1 vs 1.1.1. First is lower. 
                return false;
            } else if( splitFirst[i] && !splitSecond[i] ) { // e.g. 1.1.1 vs 1.1 First is higher
                return true;
            } else if( splitFirst[i]>splitSecond[i] ) { // e.g. 1.2 vs 1.1. First is higher. 
                return true;
            } else if( splitFirst[i]<splitSecond[i] ) { // e.g. 1.1 vs 1.2. First is lower.
                return false;
            } else if( splitFirst[i]==splitSecond[i] ) { // e.g. 1.1 vs 1.1. Not greater.
                if( i==splitFirst.length-1 ) {
                    return false; // Total equality. 
                }
                // Progress next.
            }
        }
        throw new Error("Could not compare greaterThan on versions");
    }
    
})

/*
console.log( 'false: '+greaterThan("1.1", "1.2") );
console.log( 'true: '+greaterThan("1.2", "1.1") );
console.log( 'true: '+greaterThan("1.1.1", "1.1") );
console.log( 'false: '+greaterThan("1.1", "1.1.1") );
console.log( 'false: '+greaterThan("1", "2") );
console.log( 'true: '+greaterThan("2", "1") );
console.log( 'false: '+greaterThan("2", "2.0") );
console.log( 'true: '+greaterThan("1.1.1", "1.1.0") );
console.log( 'true: '+greaterThan("1.1.2", "1.1.1") );
console.log( 'false: '+greaterThan("1.1.1", "1.1.0") );
console.log( 'fail: '+greaterThan("1.2.1", "1.27a") );
*/