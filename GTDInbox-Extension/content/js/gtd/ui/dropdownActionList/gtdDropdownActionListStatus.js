var gtdDropdownActionListStatus=gtdDropdownActionList.extend({connect:function(main){giLogger.log("st","gtdDropdownActionListStatus.connect",main.pageId);this.base(main)},disconnect:function(){this._main.labelsData.removeEventListener(gtdLabelsData.LABEL_CHANGED,this._labelChanged,this);this._main.gmail.actions.removeEventListener(glActionManager.THREAD_CHANGED,this._threadChanged,this);if(this.elPinCollection&&this.elPinCollection.parentNode)this.elPinCollection.parentNode.removeChild(this.elPinCollection);
this.elPinCollection=null;this.base()},init:function(elButton,elButtonTitle,elContent,useMouseover,id,usePin){giLogger.log("st","gtdDropdownActionListStatus.init",this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(elButton,elButtonTitle,elContent,useMouseover,id,usePin);giUIObject.addClassName(this.elButton,"gtdi-dropdown-actionlist-status")},_threadLoaded:function(evt){var thread=this._thread;var activeStatuses=[];var f=function(elRow,item){if(thread.hasLabel(item)){giUIObject.addClassName(elRow,
"gtdi-active");activeStatuses.push(item)}else giUIObject.removeClassName(elRow,"gtdi-active")};this._applyToContentRows(f);this._applyToPinCollectionRows(f);if(activeStatuses.length==0)this.elButtonTitle.innerHTML="No Status";else if(activeStatuses.length==1){var prefix=this._main.prefs.getPref("labels.types.statuses.prefix");this.elButtonTitle.innerHTML=activeStatuses[0].replace(prefix,"")}else this.elButtonTitle.innerHTML=activeStatuses.length+" Statuses"},_threadChanged:function(evt){if(evt.name==
glActionManager.THREAD_CHANGED&&this._thread&&this._thread.hasId(evt.thread)){this._thread.updateFromEvent(evt);this._threadLoaded()}},_labelChanged:function(evt){if(this._main.labelsData.getLabelType(evt.label)=="statuses")this.base(evt)},_reloadContent:function(){this.elContent.innerHTML="";var statuses=this._main.labelsData.getLabelsArray("statuses",true);var statusData=this._main.labelsData.getStatusData(true);if(statuses.length>0)for(var i=0;i<statuses.length;i++){var elRow=this._createRow(statuses[i],
statuses[i].replace(statusData.prefix,""));if(this._thread&&this._thread.hasLabel(statuses[i]))giUIObject.addClassName(elRow,"gtdi-active");this.elContent.appendChild(elRow)}else;},_reloadPinCollection:function(){},_createRow:function(label,displayName){var elRowItem=this._main.gmail.canvasDocument.createElement("DIV");elRowItem.innerHTML=displayName;elRowItem.className="gtdi-dropdown-actionlist-status-row-item";var elRow=this.base(elRowItem);elRow.setAttribute("gtdi-item",label);return elRow},_clickContentOrPinCollection:function(evt){try{}catch(e){giLogger.warn(e,
"gtdDropdownActionListStatus._click",null,this._main?this._main.pageId:giLogger.UNKNOWN_PAGE_ID)}this.base(evt)}},{});