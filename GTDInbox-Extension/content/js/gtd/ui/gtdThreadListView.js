var gtdThreadListView=giUIObject.extend({_threadListCommands:null,_deadlineButton:null,connect:function(main){try{giLogger.log("st","gtdThreadListView.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this.base(main);if(main.prefs.getPref("components.thread_list.preview_button.enabled")||main.prefs.getPref("components.thread_list.preview_button.enabled")){giLogger.log("connect threadListCommands","gtdThreadListView.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID);this._threadListCommands=main.getUIObject("threadListCommands");
giLogger.log("connected threadListCommands","gtdThreadListView.connect",main?main.pageId:giLogger.UNKNOWN_PAGE_ID)}if(this._main.gmail.page.location("hash").indexOf("#create-filter")!=0)if(this._main.serverAccount.getAccountType()==giServerAccount.TYPES.PLUS){var threadListView=this._main.gmail.getCurrentViewObject();var threadListTables=threadListView.getThreadListTables();for(var i=0;i<threadListTables.length;i++)if(threadListTables[i].isMain){this._deadlineButton=this._main.getUIObject("deadlineButton");
this._deadlineButton.setActionsHeader(threadListTables[i].actionsHeader);if(!threadListTables[i].actionsHeader.labelsDropdownButton)giLogger.warn("Could not find labelsDropdownButton in actionsHeader to add deadlineButton","gtdThreadListView.connect",null,main?main.pageId:giLogger.UNKNOWN_PAGE_ID);else{threadListTables[i].actionsHeader.labelsDropdownButton.parentNode.appendChild(this._deadlineButton.el);giUIObject.adornGmailButton(threadListTables[i].actionsHeader.labelsDropdownButton,{collapseRight:true},
this._main.gmail)}break}}}catch(e){giLogger.warn(e,"gtdThreadListView.connect",null,main?main.pageId:giLogger.UNKNOWN_PAGE_ID)}},disconnect:function(){if(this._deadlineButton){this._deadlineButton.disconnect();this._deadlineButton=null}if(this._threadListCommands){this._threadListCommands.disconnect();this._threadListCommands=null}this.base()}});
