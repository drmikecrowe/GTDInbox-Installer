var gtdBrowserThreadsLabel=gtdBrowserThreads.extend({connect:function(main){giLogger.log("st","gtdBrowserThreadsLabel.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main)},disconnect:function(){this.base()},load:function(type,item){var searchConditions=new glSearchAndConditions;searchConditions.addCondition(glSearch.l(item));searchConditions.strictMode(false,true);this.base(type,item,searchConditions);var statusPrefix=this._main.prefs.getPref("labels.types.statuses.prefix");if(!gtdLabelsData.testPrefix(item,
statusPrefix))this._createTabsFromStatuses();this._createTabsFromViews();this.selectTab()}});
