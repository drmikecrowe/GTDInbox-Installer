var gtdStoredSearch=giBase.extend({_main:null,_searches:null,constructor:function(main){this._main=main;this._searches={};this._searches["scheduled/Today"]="<deadline.days.0>";this._searches["scheduled/Overdue"]="<deadline.overdue>";this._searches["scheduled/Tomorrow"]="<deadline.days.1>";this._searches["scheduled/Upcoming"]="(<deadline.days.1> OR <deadline.days.2> OR <deadline.days.3> OR <deadline.days.4>)";this._searches["scheduled/All"]="<deadline.all>";this._searches["cleanup/Unprocessed"]="(in:inbox OR is:unread) -<status.finished>"},
unload:function(){},getSearchesByType:function(searchType){var searchIds=[];for(sid in this._searches)if(sid.indexOf(searchType)==0)searchIds.push(sid);return searchIds},getSearchTypes:function(){return["scheduled","cleanup"]},getSearchText:function(searchId){return gtdStoredSearch.compile(this._searches[searchId],this._main.labelsData)},hasSearch:function(searchId){return!!this._searches[searchId]}},{compile:function(str,labelsData){var date=new Date;if(/<deadline\.all>/i.test(str)){var days=[];
for(var i=1;i<32;i++)days.push(glSearch.l(labelsData.getDeadlineDay(i)));var months=[];for(var i=1;i<13;i++)months.push(glSearch.l(labelsData.getDeadlineMonth(i)));var term="(("+days.join(" OR ")+") ("+months.join(" OR ")+"))";str=str.replace(/<deadline\.all>/ig,term)}if(/<deadline\.overdue>/i.test(str)){var term="";var days=[];for(var i=1;i<date.getDate();i++)days.push(glSearch.l(labelsData.getDeadlineDay(i)));term+="("+glSearch.l(labelsData.getDeadlineMonth(date.getMonth()+1))+" ("+days.join(" OR ")+
"))";var days=[];for(var i=1;i<32;i++)days.push(glSearch.l(labelsData.getDeadlineDay(i)));var months=[];var count=0;var month=date.getMonth();while(++count<3){months.push(glSearch.l(labelsData.getDeadlineMonth(month)));if(--month<1)month=12}term+=" OR (("+months.join(" OR ")+") ("+days.join(" OR ")+"))";str=str.replace(/<deadline\.overdue>/ig,"("+term+")")}if(/<deadline\.days\.\d+>/i.test(str))while(m=str.match(/<deadline\.days\.(\d+)>/i)){var days=m[1];var ms=date.valueOf();ms+=days*24*60*60*1E3;
var futureDate=new Date(ms);var term=glSearch.l(labelsData.getDeadlineMonth(futureDate.getMonth()+1))+" "+glSearch.l(labelsData.getDeadlineDay(futureDate.getDate()));var re=new RegExp("<deadline\\.days\\."+days+">","ig");str=str.replace(re,"("+term+")")}if(/<status\.\w+>/i.test(str)){var statusData=this._main.labelsData.getStatusData();while(m=str.match(/<status\.(\w+)>/i)){var re=new RegExp("<status\\."+m[1]+">","ig");str=str.replace(re,glSearch.l(statusData[m[1]]))}glSearch.l(statusData.finished)}return str}});
