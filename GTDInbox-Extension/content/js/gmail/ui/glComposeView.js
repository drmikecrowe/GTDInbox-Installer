var glComposeView=glUIView.extend({topSendButton:null,bottomSendButton:null,fromRow:null,toRow:null,subjectField:null,toField:null,ccField:null,composeTable:null,fromSelect:null,bodyPlain:null,bodyRich:null,connect:function(gmail){giLogger.log("st","glComposeView.connect",gmail.pageId);this.base(gmail);var doc=gmail.canvasDocument;var elViewRoot=this._gmail.page.getViewRoot();var result=doc.evaluate(".//select[@name='from']",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.fromSelect=
result.singleNodeValue;var result=doc.evaluate(".//textarea[@name='to']",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.toField=result.singleNodeValue;if(!this.toField)giLogger.error("Could not find To field","glComposeView.connect",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var result=doc.evaluate(".//textarea[@name='cc']",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.ccField=result.singleNodeValue;var result=doc.evaluate(".//input[@name='subject']",
elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.subjectField=result.singleNodeValue;if(!this.subjectField)giLogger.error("Could not find Subject field","glComposeView.connect",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var result=doc.evaluate(".//table[contains(@class,'cf eA')]",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate("//div[@class='uQLZXb']//form//table[contains(@class,'wHcYVb')]",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,
null);this.composeTable=result.singleNodeValue;if(!this.composeTable)giLogger.error("Could not find composeTable","glComposeView.connect",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var result=doc.evaluate(".//div[starts-with(@class,'eh')]//div[@class='dX J-Jw']/div",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'eh')]//div[@role='button'][1]",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
if(!result.singleNodeValue)result=doc.evaluate("//div[starts-with(@class,'LlWyA')]//div[@role='button'][1]",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.topSendButton=result.singleNodeValue;if(!this.topSendButton)giLogger.error("Could not find topSendButton","glComposeView.connect",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);var result=doc.evaluate(".//div[starts-with(@class,'CoUvaf')]//div[@class='dX J-Jw']/div",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
if(!result.singleNodeValue)result=doc.evaluate(".//div[starts-with(@class,'CoUvaf')]//div[@role='button'][1]",elViewRoot,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);this.bottomSendButton=result.singleNodeValue;if(!this.bottomSendButton)giLogger.error("Could not find bottomSendButton","glComposeView.connect",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID)},disconnect:function(){giLogger.log("Disconnecting glComposeView from view","glComposeView",this._gmail?this._gmail.pageId:giLogger.UNKNOWN_PAGE_ID);
this.topSendButton=null;this.bottomSendButton=null;this.fromRow=null;this.toRow=null;this.subjectField=null;this.bodyPlain=null;this.bodyRich=null;this.composeTable=null;this.toField=null;this.ccField=null;this.fromSelect=null;this.base()}});