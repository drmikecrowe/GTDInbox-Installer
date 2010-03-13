var giFileIO = giBase.extend(null,{

    /**
     * Reads the file contents of the given file and returns them as a string.
     * Does not perform any charset conversions, so use at your own risk.
     * @function {} ?
     * @param {String} [relativeUrl] The filename, relative to root of extension, to read
     * @param {String} [localeUrl] The filename, in the user's preferred locale directory, to read
     * @param {String} [absoluteUrl] The filename to read
     * @param {Function} callback The function to call back when loaded, with the file text as a parameter.
     */
    readFile: function(relativeUrl, localeUrl, absoluteUrl, callback) {
        
        if( absoluteUrl ) {
            giFileIO._readFile(absoluteUrl, callback);
        } else if( localeUrl ) {
            giFileIO._readFile(giI18N.getURL(localeUrl), callback);
        } else if( relativeUrl ) {
            giFileIO._readFile(giUrl.getURL(relativeUrl), callback);
        }
        
    },
    
    _readFile: function(filename, callback) {
        var req = new giXMLHttpRequest(); 
        req.open('GET', filename, false);
        req.onload = function() {   // Must use onload+callback as Chrome only has async message passing
            callback(req.responseText);
        };
        req.send(null);
    }

})

