var gtdViews=giBase.extend({_main:null,_views:null,constructor:function(main){this._main=main;this._views={};this._reloadInbuiltViews();this._main.labelsData.addEventListener(gtdLabelsData.LABEL_CHANGED,this._labelChanged,this)},_reloadInbuiltViews:function(){this._views["all"]={search:new glSearchAndConditions("")};this._views["files"]={search:new glSearchAndConditions("has:attachment")}},_labelChanged:function(evt){this._reloadInbuiltViews();for(i in this._views)this.dispatchEvent({name:gtdViews.VIEW_EDITED,
viewId:i})},getViews:function(){var ids=[];for(i in this._views)ids.push(i);return ids},getViewSearch:function(id){return this._views[id]?this._views[id].search:null},getViewName:function(id){return giI18N.getString("Views."+id+".name",id)},hasView:function(id){return this._views[id]?true:false}},{VIEW_EDITED:"view_edited"});gtdViews.implement(giEventDispatcher);
