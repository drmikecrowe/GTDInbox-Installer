var gtdRecent=giBase.extend({_main:null,constructor:function(main){this._main=main;this._main.gmail.actions.addEventListener(glActionManager.THREAD_CHANGED,this._threadChanged,this);this._main.gmail.environment.addEventListener(glEnvironment.RENAME_LABEL,this._labelsChanged,this);this._main.gmail.environment.addEventListener(glEnvironment.DELETE_LABEL,this._labelsChanged,this)},_threadChanged:function(evt){if(evt.action===glActionManager.ADD_LABEL){var labelname=evt.label;var foundType="misc";var typeSettings=
this._main.prefs.getPref("labels.types");for(t in typeSettings)if(t!="misc"&&gtdLabelsData.testPrefix(labelname,typeSettings[t].prefix)){foundType=t;break}var recent=this._main.prefs.getPref("recent",true)||{};if(!recent[foundType])recent[foundType]=[];for(var i=0;i<recent[foundType].length;i++)if(recent[foundType][i][0]==labelname){recent[foundType].splice(i,1);break}recent[foundType].splice(0,0,[labelname,(new Date).valueOf()]);if(recent[foundType].length>5)recent[foundType].length=5;this._main.prefs.setPref("recent",
recent)}},getLabels:function(type){var recent=this._main.prefs.getPref("recent",true)||{};if(recent[type])return recent[type];else return[]},_labelsChanged:function(evt){var recent=this._main.prefs.getPref("recent",true)||{};var change=false;for(type in recent)for(var i=recent[type].length-1;i>=0;i--)if(evt.label==recent[type][i][0])if(evt.name==glEnvironment.RENAME_LABEL){var typePrefix=this._main.prefs.getPref("labels.types."+type+".prefix");if(gtdLabelsData.testPrefix(evt.newLabel,typePrefix))recent[type][i][0]=
evt.newLabel;else recent[type].splice(i,1);change=true}else if(evt.name==glEnvironment.DELETE_LABEL){recent[type].splice(i,1);change=true}if(change)this._main.prefs.setPref("recent",recent)}});
