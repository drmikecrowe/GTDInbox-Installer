var gtdBrowserThreadsOverview=gtdBrowserThreads.extend({connect:function(main){giLogger.log("st","gtdBrowserThreadsOverview.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main)},disconnect:function(){this.base()},load:function(type,item){var searchConditions=new glSearchAndConditions;this.base(type,item,searchConditions);this._createTabsFromStatuses();this.selectTab()}});
