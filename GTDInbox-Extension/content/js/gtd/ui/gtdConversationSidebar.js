var gtdConversationSidebar=giUIObject.extend({el:null,_elTitle:null,_elContent:null,_menuSections:null,connect:function(main){giLogger.log("st","gtdConversationSidebar.connect",main.pageId);this.base(main);var doc=this._main.gmail.canvasDocument;this.el=doc.createElement("DIV");this.el.className="gtdi-conversationsidebar";this._elTitle=doc.createElement("DIV");this._elTitle.className="gtdi-conversationsidebar-title";this._elTitle.innerHTML="<img src='"+giUrl.getURL("skin/gtd/i/gtdi-logo-mini.png")+
"'/>";this.el.appendChild(this._elTitle);this._elContent=doc.createElement("DIV");this._elContent.className="gtdi-conversationsidebar-content";this.el.appendChild(this._elContent);this._menuSections={};this._menuSections["status"]=this._main.getUIObject("menuSectionStatus");this._elContent.appendChild(this._menuSections["status"].el);var elSidebar=doc.evaluate(".//div[@class='nH']/div[@class='hj']",doc.body,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(!elSidebar)giLogger.error("Could not find sidebar",
"gtdConversationSidebar.connect",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);elSidebar.insertBefore(this.el,elSidebar.firstChild)},disconnect:function(){for(sid in this._menuSections)this._menuSections[sid].disconnect();this._menuSections=null;if(this.el&&this.el.parentNode)this.el.parentNode.removeChild(this.el);this.base()},setThread:function(thread){for(sid in this._menuSections)this._menuSections[sid].setThread(thread)},setServerActionType:function(serverActionType){for(sid in this._menuSections)this._menuSections[sid].setServerActionType(serverActionType)}});