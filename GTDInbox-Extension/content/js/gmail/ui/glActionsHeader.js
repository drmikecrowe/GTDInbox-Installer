var glActionsHeader=glUIWidget.extend({root:null,pagination:null,moveToDropdownButton:null,_moveToDropdownMenu:null,labelsDropdownButton:null,_labelsDropdownMenu:null,moreActionsDropdownButton:null,_moreActionsDropdownMenu:null,_viewType:null,connect:function(gmail){giLogger.log("st","glActionsHeader.connect",gmail.pageId);this.base(gmail);this._viewType=gmail.page.getActiveViewType()},getValidRoot:function(elContainer,viewRoot){if(!elContainer){if(!viewRoot)viewRoot=this._gmail.page.getViewRoot();
elContainer=viewRoot}if(this._viewType=="tl")var results=this._gmail.canvasDocument.evaluate('.//div[contains(@class,"A1 D")]/div[@class="nH"][1]',elContainer,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);else var results=this._gmail.canvasDocument.evaluate('.//div[@class="nH"]/div[contains(@class, "iI D")]',elContainer,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);return giUIObject.shallowestSnapshotItem(results,elContainer)},load:function(elContainer){var viewRoot=this._gmail.page.getViewRoot();
if(!viewRoot)giLogger.error("Could not find view root","glActionsHeader.load",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var doc=this._gmail.canvasDocument;this.root=this.getValidRoot(elContainer,viewRoot);if(!this.root){var url=this._gmail&&this._gmail.page?this._gmail.page.locationHref():"not-found";var additionalErrorInfo="";try{var vrClone=viewRoot.cloneNode(true);var tables=vrClone.getElementsByTagName("TABLE");for(var i=0;i<tables.length;i++)if(tables[i].className.indexOf("cf")==
-1)tables[i].parentNode.removeChild(tables[i]);giLogger.logHTML(vrClone.innerHTML,"this.root error in glActionsHeader.load (HTML for viewRoot minus tables) for url: "+url,"",true,this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID)}catch(e){additionalErrorInfo="Error in vrClone process: "+e}giLogger.error("Could not find the actions header root node (this.root) for view of "+this._viewType+" for url: "+url+". "+additionalErrorInfo,"glActionsHeader.load",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID)}this.pagination=
this.root.childNodes[1];var result=doc.evaluate(".//div[@class='Pl J-J5-Ji']/div[contains(@class, 'L3')][1]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eeCDlc')][2]/div[1]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eeCDlc')][2]/div[starts-with(@class,'goog-imageless-button')][1]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,
null);if(!result.singleNodeValue)result=doc.evaluate(".//div[@class='sGcZQb']//div[starts-with(@class,'eeCDlc')][2]/div[starts-with(@class,'goog-imageless-button')][1] | .//div[@class='Wtoymb']//div[starts-with(@class,'eeCDlc')][2]/div[starts-with(@class,'goog-imageless-button')][1]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.moveToDropdownButton=result.singleNodeValue;if(!this.moveToDropdownButton)new Error("Could not find moveTo dropdown button node [glActionsHeader.load]");var result=
doc.evaluate(".//div[@class='Pl J-J5-Ji']/div[contains(@class, 'L3')][2]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eeCDlc')][2]/div[2]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eeCDlc')][2]/div[starts-with(@class,'goog-imageless-button')][2]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=
doc.evaluate(".//div[@class='sGcZQb']//div[starts-with(@class,'eeCDlc')][2]/div[starts-with(@class,'goog-imageless-button')][2] | .//div[@class='Wtoymb']//div[starts-with(@class,'eeCDlc')][2]/div[starts-with(@class,'goog-imageless-button')][2]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.labelsDropdownButton=result.singleNodeValue;if(!this.labelsDropdownButton)new Error("Could not find labels dropdown button node [glActionsHeader.load]");var result=doc.evaluate(".//div[@class='Pl J-J5-Ji'][3]/div[contains(@class, 'L3')][1]",
this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eeCDlc')][3]/div[1]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eeCDlc')][3]/div[starts-with(@class,'goog-imageless-button')][1]",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[@class='sGcZQb']//div[starts-with(@class,'eeCDlc')][3]/div[starts-with(@class,'goog-imageless-button')][1] | .//div[@class='Wtoymb']//div[starts-with(@class,'eeCDlc')][3]/div[starts-with(@class,'goog-imageless-button')][1]",
this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[@class='QOD9Ec']",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.moreActionsDropdownButton=result.singleNodeValue;if(!this.moreActionsDropdownButton)new Error("Could not find moreActions dropdown button node [glActionsHeader.load]")},disconnect:function(){this.root=null;this.base()},isCacheable:function(){return false},getButton:function(buttonCode){var result=this.root.ownerDocument.evaluate(".//div[@act='"+
buttonCode+"']",this.root,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)giLogger.warn("Could not find button: "+buttonCode,"glActionsHeader.getButton",null,this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);return result.singleNodeValue},clickDropdownMenuAction:function(dropdown,buttonCode){var elMenu=this._getDropdownMenu(dropdown,true);var elAction=this._gmail.canvasDocument.evaluate(".//*[@act='"+buttonCode+"']",elMenu,null,XPathResult.FIRST_ORDERED_NODE_TYPE,
null).singleNodeValue;if(!elAction)giLogger.error("Could not find button element for "+dropdown+" with buttonCode "+buttonCode,"glActionsHeader.clickDropdownMenuAction",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);if(elAction.style.display!="none"){giUIObject.simulateMouseEvent(elAction,"mousedown");giUIObject.simulateMouseEvent(elAction,"mouseup")}},_getDropdownMenuLabels:function(dropdown,leaveOpen){var elDropdownMenu=this._getDropdownMenu(dropdown,leaveOpen);var elDropdownMenuLabels=
this._gmail.canvasDocument.evaluate(".//td//div[starts-with(@class,'J-M-Jz')]",elDropdownMenu,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(!elDropdownMenuLabels)elDropdownMenuLabels=this._gmail.canvasDocument.evaluate(".//td//div[starts-with(@class,'goog-menu-content')]",elDropdownMenu,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(!elDropdownMenuLabels)giLogger.error("Could not find the label container element for "+dropdown,"glActionsHeader._getDropdownMenuLabels",
this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);return elDropdownMenuLabels},_getDropdownMenuLabel:function(dropdown,label,leaveMenuOpen){if(dropdown!=glActionsHeader.LABELS_DROPDOWN&&dropdown!=glActionsHeader.MOVE_TO_DROPDOWN)giLogger.error("This is only for the Labels Dropdown or the Move To Dropdown","glActionsHeader._getDropdownMenuLabel",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var elLabels=this._getDropdownMenuLabels(dropdown,leaveMenuOpen);var elLabel=null;for(var i=
0;i<elLabels.childNodes.length;i++)if(giUtil.decodeEntities(giUtil.stripTags(elLabels.childNodes[i].innerHTML))==label){elLabel=elLabels.childNodes[i];break}if(!elLabel)giLogger.error("Could not find label '"+label+"' for "+dropdown,"glActionsHeader._getDropdownMenuLabel",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);return elLabel},setLabelsDropdownLabelState:function(label,on){var elLabel=this._getDropdownMenuLabel(glActionsHeader.LABELS_DROPDOWN,label,true);var isOn=elLabel.getAttribute("aria-checked")==
"true";if(isOn!=on){giUIObject.simulateMouseEvent(elLabel,"mousedown");giUIObject.simulateMouseEvent(elLabel,"mouseup")}else this._closeDropdownMenu(glActionsHeader.LABELS_DROPDOWN)},_closeDropdownMenu:function(dropdown){var elButton=this[dropdown+"Button"];if(!elButton)giLogger.error("Could not find button for "+dropdown,"glActionsHeader._closeDropdownMenu",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);if(elButton.getAttribute("aria-expanded")=="true"){giUIObject.simulateMouseEvent(elButton,
"mousedown");giUIObject.simulateMouseEvent(elButton,"mouseup")}},_getDropdownMenu:function(dropdown,leaveOpen){if(this["_"+dropdown+"Menu"]){var button=this[dropdown+"Button"];if(!button)giLogger.error("Could not find button for "+dropdown,"glActionsHeader._getDropdownMenu",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);if(button.getAttribute("aria-expanded")!="true"){giUIObject.simulateMouseEvent(button,"mousedown");giUIObject.simulateMouseEvent(button,"mouseup");if(!leaveOpen){giUIObject.simulateMouseEvent(button,
"mousedown");giUIObject.simulateMouseEvent(button,"mouseup")}}}else{var button=this[dropdown+"Button"];if(!button)giLogger.error("Could not find button for "+dropdown,"glActionsHeader._getDropdownMenu",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var hideAgain=false;if(button.getAttribute("aria-expanded")!="true"){hideAgain=true;giUIObject.simulateMouseEvent(button,"mousedown");giUIObject.simulateMouseEvent(button,"mouseup")}var doc=button.ownerDocument;var results=doc.evaluate(".//div[contains(@class,'goog-menu AW')]",
this.root,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);if(results.snapshotLength==0)results=doc.evaluate(".//div[contains(@class,'J-M AW')]",this.root,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);var elem=null;var dropdownMenu=null;for(var i=0;i<results.snapshotLength;i++){var elem=results.snapshotItem(i);if(elem.style.display!="none"&&elem.childNodes.length>0){dropdownMenu=elem;break}}if(hideAgain&&!leaveOpen){giUIObject.simulateMouseEvent(button,"mousedown");giUIObject.simulateMouseEvent(button,
"mouseup")}if(!dropdownMenu)giLogger.error("Could not find dropdown menu node ["+dropdown+"]","glActionsHeader._getDropdownMenu",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);this["_"+dropdown+"Menu"]=dropdownMenu}return this["_"+dropdown+"Menu"]},getCreateLabelInput:function(){var docCreate=this._gmail.canvasDocument.defaultView.top.document;var elInput=docCreate.evaluate(".//div[@class='Kj-JD-Jz']/input[@class='xx']",docCreate.body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
if(!elInput)elInput=docCreate.evaluate(".//div[@class='aw']/div[@class='az']/input",docCreate.body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;return elInput}},{ARCHIVE_BUTTON:7,REPORT_SPAM_BUTTON:9,DELETE_BUTTON:10,MOVE_TO_INBOX_BUTTON:8,DISCARD_DRAFTS_BUTTON:16,DELETE_FOREVER_BUTTON:17,NOT_SPAM_BUTTON:18,REFRESH_BUTTON:20,MARK_AS_READ:1,MARK_AS_UNREAD:2,ADD_STAR:3,REMOVE_STAR:4,ARCHIVE:5,NOT_SPAM:6,CREATE_EVENT:7,FILTER_MESSAGES_LIKE_THESE:8,MUTE:9,MOVE_TO_DRAFTS:10,CREATE_LABEL:14,
BACK_TO_TL:19,MOVE_TO_DROPDOWN:"moveToDropdown",LABELS_DROPDOWN:"labelsDropdown",MORE_ACTIONS_DROPDOWN:"moreActionsDropdown"});
