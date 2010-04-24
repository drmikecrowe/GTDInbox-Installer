var boxSection=giUIObject.extend({id:null,el:null,_eventsContainer:null,_elExpand:null,_rows:null,_expanded:true,_currentRow:null,connect:function(main){giLogger.log("St boxSection (id: "+this.id+")","boxSection.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main);this._rows=[];this._eventsContainer=new giEventsContainer(this);this.el=this._main.gmail.doc.createElement("DIV");this.el.className="gtdi-box-section";this._eventsContainer.observe(this.el,"mouseover",this._mouseover,false);
this._eventsContainer.observe(this.el,"click",this._click,false)},disconnect:function(){if(this.el.parentNode)this.el.parentNode.removeChild(this.el);if(this._eventsContainer){this._eventsContainer.reset();this._eventsContainer=null}if(this._currentRow){if(this._currentRow.elPopout.parentNode)this._currentRow.elPopout.parentNode.removeChild(this._currentRow.elPopout);this._currentRow=null}this.base()},_addRow:function(id,content,popout,clickMode){var el=this._main.gmail.doc.createElement("DIV");el.setAttribute("gtdi-box-row-id",
id);el.className="gtdi-box-row gtdi-box-row-"+id;if(content)el.appendChild(content);if(popout){popout.setAttribute("gtdi-box-row-id",id);giUIObject.addClassName(popout,"gtdi-box-row-popout")}var data={id:id,el:el,elContent:content,elPopout:popout,clickMode:clickMode};this._rows.push(data);this.el.appendChild(el);this._refreshExpanded();return data},_isExpandable:function(v){if(typeof v=="undefined")return!!this._elExpand;if(v){if(!this._elExpand){this._elExpand=this._main.gmail.doc.createElement("DIV");
this._elExpand.className="gtdi-box-section-expand";this._elExpand.innerHTML=this.id?giI18N.getString("Box.expander."+this.id):"";if(this.el.firstChild)this.el.insertBefore(this._elExpand,this.el.firstChild);else this.el.appendChild(this._elExpand);this._eventsContainer.observe(this._elExpand,"click",this._clickExpand,false);var expanded=this.id?this._main.prefs.getPref("expanded_sections."+this.id):true;if(expanded!==true&&expanded!==false)expanded=true;this.expanded(expanded)}}else if(this._elExpand){this._elExpand.parentNode.removeChild(this._elExpand);
this._elExpand=null;this._eventsContainer.stopObserving(this._elExpand,"click",this._clickExpand,false);this.expanded(true)}},expanded:function(v){if(typeof v=="undefined")return this._expanded;if(v){this._expanded=true;giUIObject.addClassName(this._elExpand,"gtdi-box-section-expanded")}else{this._expanded=false;giUIObject.removeClassName(this._elExpand,"gtdi-box-section-expanded")}if(this.id)this._main.prefs.setPref("expanded_sections."+this.id,v)},_refreshExpanded:function(){if(this._elExpand)this.expanded(this.expanded())},
_clickExpand:function(evt){try{this.expanded(!this.expanded())}catch(e){giLogger.warn(e,"boxSection._clickExpand",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_click:function(evt){try{var el=evt.target;var elRow=null;while(el.parentNode&&!elRow){if(el==this.el)break;if(el.getAttribute("gtdi-box-row-id"))elRow=el;el=el.parentNode}if(elRow)for(var i=0;i<this._rows.length;i++)if(this._rows[i].el===elRow)if(this._rows[i].elPopout&&this._rows[i].clickMode==true)if(this._currentRow==this._rows[i])this._hidePopout();
else this._showPopout(this._rows[i])}catch(e){giLogger.warn(e,"boxSection._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_mouseover:function(evt){try{var el=evt.target;var elRow=null;while(el.parentNode&&!elRow){if(el==this.el)break;if(el.getAttribute&&el.getAttribute("gtdi-box-row-id"))elRow=el;el=el.parentNode}if(elRow)for(var i=0;i<this._rows.length;i++)if(this._rows[i].el===elRow){if(this._rows[i].elPopout&&!this._rows[i].clickMode){if(this._popupTimeout){clearTimeout(this._popupTimeout);
this._popupTimeout=null}if(!this._currentRow||this._currentRow.elPopout!=this._rows[i].elPopout){if(this._currentRow){this._nextPopout=this._rows[i];setTimeout(giUtil.bind(this,this._tryNextPopout),150);return}this._showPopout(this._rows[i])}}break}}catch(e){giLogger.warn(e,"boxSection._mouseover",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},_tryNextPopout:function(){if(this._nextPopout)if(this._currentRow!=this._nextPopout)this._showPopout(this._nextPopout)},_showPopout:function(row){this._hidePopout();
this._currentRow=row;giUIObject.addClassName(this._currentRow.el,"gtdi-box-row-popped-out");this._main.gmail.canvasDocument.body.appendChild(this._currentRow.elPopout);var borderWidth=giUIObject.getBorderWidth(this._currentRow.el);var offset=giUIObject.cumulativeOffset(this._currentRow.el);offset[1]=offset[1]+parseInt(borderWidth[3])+parseInt(borderWidth[1]);var dims=giUIObject.getDimensions(this._currentRow.el);var xy=[offset[0]+dims.width,offset[1]];this._currentRow.elPopout.style.left=xy[0]+"px";
this._currentRow.elPopout.style.top=xy[1]+"px";if(row.clickMode==true)this._eventsContainer.observe(this._main.gmail.canvasDocument.body,"mousedown",this._clickWindow,false);else this._eventsContainer.observe(this._main.gmail.canvasDocument.body,"mousemove",this._mouseoverWindow,false);this.dispatchEvent({name:boxSection.POPOUT,row:this._currentRow});xy=giUIObject.boundsCheckXY(this._currentRow.elPopout,xy[0],xy[1]);this._currentRow.elPopout.style.left=xy[0]+"px";this._currentRow.elPopout.style.top=
xy[1]+"px";this._currentRow.elPopout.style.maxHeight=xy[3]+"px"},_hidePopout:function(){if(this._currentRow){if(this._popupTimeout){clearTimeout(this._popupTimeout);this._popupTimeout=null}this._nextPopout=null;giUIObject.removeClassName(this._currentRow.el,"gtdi-box-row-popped-out");this.dispatchEvent({name:boxSection.POPOUT_HIDE,row:this._currentRow});this._currentRow.elPopout.parentNode.removeChild(this._currentRow.elPopout);this._currentRow=null;this._eventsContainer.stopObserving(this._main.gmail.canvasDocument.body,
"mousemove",this._mouseoverWindow,false);this._eventsContainer.stopObserving(this._main.gmail.canvasDocument.body,"mousedown",this._clickWindow,false)}},_mouseoverWindow:function(evt){var el=evt.target;var elRow=null;var currentId=this._currentRow.id;while(el.parentNode&&!elRow){if(el==this.el)break;if(el.hasAttribute("gtdi-box-row-id")&&el.getAttribute("gtdi-box-row-id")==currentId){elRow=el;this._nextPopout=null}if(this._nextPopout&&this._nextPopout.el==el)elRow=el;el=el.parentNode}if(elRow){if(this._popupTimeout){clearTimeout(this._popupTimeout);
this._popupTimeout=null}}else if(!this._popupTimeout)this._popupTimeout=setTimeout(giUtil.bind(this,this._hidePopout),150)},_clickWindow:function(evt){try{var el=evt.target;var clickedWithin=false;while(el.parentNode){if(el==this.el)break;if(el==this._currentRow.elPopout){clickedWithin=true;break}el=el.parentNode}if(!clickedWithin)this._hidePopout()}catch(e){giLogger.warn(e,"boxSection._clickWindow",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}},isCacheable:function(){return true}},
{POPOUT:"popout",POPOUT_HIDE:"popout_hide"});boxSection.implement(giEventDispatcher);
