var gtdActionBox=giUIObject.extend({_id:null,_rows:null,_eventsContainer:null,_thread:null,el:null,_elRows:null,_serverActionType:null,_elExpander:null,connect:function(main){giLogger.log("st","gtdActionBox.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main);this._eventsContainer=new giEventsContainer(this);this._rows={};var doc=this._main.gmail.canvasDocument;this.el=doc.createElement("DIV");this.el.className="gtdi";var elInner=doc.createElement("DIV");elInner.className="gtdi-labelling";
this.el.appendChild(elInner);this._elRows=doc.createElement("UL");elInner.appendChild(this._elRows);var elSpan=doc.createElement("SPAN");elSpan.className="gtdi-clearfix";this.el.appendChild(elSpan);this._eventsContainer.observe(this.el,"click",this._click,false)},disconnect:function(){giLogger.log("st","gtdActionBox.disconnect",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);if(this._thread)this._thread=null;for(idRow in this._rows)this._elRows.removeChild(this._rows[idRow].el);this._rows=
null;if(this.el&&this.el.parentNode)this.el.parentNode.removeChild(this.el);this.el=null;this._elRows=null;this._eventsContainer.reset();this._eventsContainer=null;this.base()},load:function(id,thread){if(this._thread)this._thread=null;this._id=id;this._thread=thread},addRow:function(idRow,elContent){try{giLogger.log("st (id: "+idRow+")","gtdActionBox.addRow",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);if(this._rows[idRow]);var el=this._main.gmail.canvasDocument.createElement("LI");el.className=
"gtdi-row";this._elRows.appendChild(el);el.appendChild(elContent);var row={el:el,elContent:elContent};this._rows[idRow]=row;if(!this._elExpander&&this._getRowCount()>1){this._elExpander=this._main.gmail.canvasDocument.createElement("DIV");this._elExpander.className="gtdi-labelling-expander";var firstRow=null;for(idInner in this._rows){firstRow=this._rows[idInner];break}firstRow.el.insertBefore(this._elExpander,firstRow.el.firstChild);var on=this._main.prefs.getPref("labelling_box.expanded"+this._id);
if(typeof on=="undefined"||on===null)on=true;this._expanded(on)}if(this._elExpander)if(!this._expanded())row.el.style.display="none";return row}catch(e){giLogger.warn(e,"gtdActionBox.addRow","id: "+idRow,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_getRowCount:function(){var count=0;for(idRow in this._rows)count++;return count},setServerActionType:function(type){this._serverActionType=type},_click:function(event){try{var el=event.target;while(el.parentNode){if(el.className.indexOf("gtdi-labelling-expander")>
-1){this._expanded(!this._expanded());break}el=el.parentNode}return false}catch(e){giLogger.warn(e,"gtdActionBox._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_expanded:function(on){giLogger.log("st","gtdActionBox._expanded",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);if(typeof on=="undefined")return giUIObject.hasClassName(this._elExpander,"gtdi-labelling-expander-on");var first=true;for(idRow in this._rows)if(first)first=false;else this._rows[idRow].el.style.display=
on?"":"none";if(on){giUIObject.removeClassName(this._elExpander,"gtdi-labelling-expander-off");giUIObject.addClassName(this._elExpander,"gtdi-labelling-expander-on");this._elExpander.title=giI18N.getString("Labelling.expander.opened");this._elExpander.innerHTML="&minus;";on=true}else{giUIObject.removeClassName(this._elExpander,"gtdi-labelling-expander-on");giUIObject.addClassName(this._elExpander,"gtdi-labelling-expander-off");this._elExpander.title=giI18N.getString("Labelling.expander.closed");this._elExpander.innerHTML=
"+";on=false}this._main.prefs.setPref("labelling_box.expanded"+this._id,on);return on}});
