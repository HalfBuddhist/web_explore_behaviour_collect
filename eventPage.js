function Hashtable() {
	this._hashValue = new Object();
	this._iCount = 0;
}

Hashtable.prototype._getCellByIndex = function(iIndex, bIsGetValue) {
	vari = 0;
	if (bIsGetValue == null)
		bIsGetValue = true;
	for ( var key in this._hashValue) {
		if (i == iIndex) {
			return bIsGetValue ? this._hashValue[key] : key;
		}
		i++;
	}
	return null;
}

Hashtable.prototype.get = function(key) {
	if (typeof (key) == "string"
			&& this._hashValue[key] != typeof ('undefined')) {
		return this._hashValue[key];
	}
	if (typeof (key) == "number")
		return this._getCellByIndex(key);
	else
		throw "hash value not allow null!";

	return null;
}

Hashtable.prototype.containsKey = function(key) {
	return this.get(key) != null;
}

Hashtable.prototype.put = function(strKey, value) {
	if (typeof (strKey) == "string") {
		if (!(this.containsKey(strKey))){
			this._iCount++;
		}
		this._hashValue[strKey] = typeof (value) != "undefined" ? value : null;
		return true;
	} else
		throw "hash key not allow null!";
}

Hashtable.prototype.findKey = function(iIndex) {
	if (typeof (iIndex) == "number")
		return this._getCellByIndex(iIndex, false);
	else
		throw "find key parameter must be a number!";
}

Hashtable.prototype.size = function() {
	return this._iCount;
}


Hashtable.prototype.remove = function(key) {
	for ( var strKey in this._hashValue) {
		if (key == strKey) {
			delete this._hashValue[key];
			this._iCount--;
		}
	}
}

Hashtable.prototype.clear = function() {
	for ( var key in this._hashValue) {
		delete this._hashValue[key];
	}
	this._iCount = 0;
}

Hashtable.prototype.isEmpty = function(){
	return this._iCount > 0 ? false : true;
}

Hashtable.prototype.keys = function(){
	var keys = new Array();
	for ( var key in this._hashValue) {
		if (this._hashValue[key] != null)
			keys.push(key);
	}	
	return keys;
}

Hashtable.prototype.toString = function(){
	var result = '';
	for ( var key in this._hashValue) {
		if (this._hashValue[key] != null)
			result += '{' + key + '},{' + this._hashValue[key] + '}\n';
	}
	return result;
}


Hashtable.prototype.values = function(){
	var values = new Array();
	for ( var key in this._hashValue) {
		if (this._hashValue[key] != null)
			values.push(this._hashValue[key]);
	}	
	return values;
}


Hashtable.prototype.containsValue = function(value) {
	var contains = false;
	if (value != null) {
		for ( var key in this._hashValue) {
			if (this._hashValue[key] == value) {
				contains = true;
				break;
			}
		}
	}
	return contains;
}

/**
 * JSHash Function.
 * @param {String} str
 * @param {Boolean} caseSensitive
 * @return {Number} hashCode
 */
function getHashCode(str, caseSensitive) {
	if (!caseSensitive) {
		str = str.toLowerCase();
	}
	// 1315423911=b'1001110011001111100011010100111'
	var hash = 1315423911, i, ch;
	for (i = str.length - 1; i >= 0; i--) {
		ch = str.charCodeAt(i);
		hash ^= ((hash << 5) + ch + (hash >> 2));
	}
	return (hash & 0x7FFFFFFF);
}


/**
 * The Class TabTimeCount.
 * @param {Object} tab_id
 * @param {Object} start_time
 * @param {Object} accumulate_time
 * @memberOf {TypeName} 
 */
function TabTimeCount(tab_id, start_time, accumulate_time, tab_url, tab_title, begin_time, searchpage_tab_hash_id) {
	this.tab_id = tab_id;
	this.last_start_time = start_time;
	this.accumulate_time = accumulate_time;
	this.tab_url = tab_url;
	this.tab_title = tab_title;
	this.begin_time = begin_time;
	this.searchpage_tab_hash_id = searchpage_tab_hash_id;
	this.endtime = 0;
	this.click_num = 0;
}



/**
 * stop the time count for the tab with tab id: p_tab_id;
 * @param {Object} p_tab_id
 */
function stop_time_count(p_tab_id){
	//stop the former
	if (tab2url.containsKey(p_tab_id.toString())) {
		var str_tab_hash_id = tab2tab_hash_id.get(p_tab_id.toString());
		//alert(tab_id);
		var timecount = hashTable.get(str_tab_hash_id);
		if (timecount != null){
			if (timecount.last_start_time != -1){
				var myDate = new Date();
				timecount.accumulate_time = timecount.accumulate_time
						+ myDate.getTime() - timecount.last_start_time;
				timecount.last_start_time = -1;
			}
		}
	} else {
		//alert("SIF Extension Error 005: activate tab error, no tab to url mapping item found : p_tab_id.");
	}
}


/**
 * start the time count for the tab with tab id: p_tab_id;
 * @param {Object} p_tab_id
 * @return {TypeName} 
 */
function start_time_count(p_tab_id){
	//start the newer
	if (tab2url.containsKey(p_tab_id.toString())) {
		chrome.tabs.get(p_tab_id,function(tab){
			if (typeof (tab) != "undefined"){
				if (tab.status == "loading")
					return;
			}else{
				return;
			}	
			
			var str_tab_hash_id = tab2tab_hash_id.get(p_tab_id.toString());
			//alert(tab_id);
			var timecount = hashTable.get(str_tab_hash_id);
		
			if (timecount != null){
				if (timecount.last_start_time == -1){
					var myDate = new Date();
					timecount.last_start_time = myDate.getTime();
				}
			}		
		});	
	} else {
		//may be the unmatched urls.
		//alert("SIF Extension Error 005: activate tab error, no tab to url mapping item found : current_active_tab_id");
	}
}


/**
 * initialize the xmlhttprequest object.
 * @return {xmlhttprequest object} 
 */
function createXMLHttp() {
	var XMLHttp;
	// alert( 'createXMLHttp....' );	
	if (window.XMLHttpRequest) {
		// alert( 'XMLHttpRequest....' );	 
		XMLHttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {// ie seris
		//alert('ActiveXObject....');
		var versions = [ "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0",
				"MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp" ];
		for ( var i = 0; i < versions.length; i++) {
			try {
				XMLHttp = new ActiveXObject(versions[i]);
				if (XMLHttp) {
					break;
				}
			} catch (e) {
				//alert("exeption");
			}
		}
	}
	// alert( XMLHttp );
	return XMLHttp;
}


/**
 * translate the url.
 * @param {Object} p_url
 * @return {TypeName} 
 */
function translate_url(p_url){
	//return (decodeURI(p_url)).replace(/&/g, " ");
	var ret_url = p_url.replace(/&/g, "{");
	ret_url = ret_url.replace(/%/g, "}");
	return ret_url;
}


var g_destination = "http://tu069177.ip.tsinghua.edu.cn:8080/SIFServer";


/**
 * store the time count for the item page.
 * @param {Object} p_time_count - the timcount object.
 * @param {Object} p_url - the url of the tab.
 */
function store_time_count(p_time_count, p_url){
	//must make sure, there is user login in
//	var login_status = localStorage["login_status"];
//	if(typeof(login_status) == "undefined" || login_status == null || login_status == "false"){
//		return;
//	}	
	var name = localStorage["sif_username"];
	var password = localStorage["sif_password"];	
	if (name == null || password == null) {
		alert("Please login the SIF first, thanks:)");
		return;
	}
	
	if (typeof(p_time_count) == "object" ){
		var xmlhttp = new createXMLHttp();
		var t_p_url = translate_url(p_url);
		var URL = g_destination + "/servlet/StoreTimeCount";
		var data_send = "url=" + t_p_url + "&title=" + p_time_count.tab_title + "&tab_hash_id=" + p_time_count.tab_id + 
		"&searchpage_tab_hash_id=" + p_time_count.searchpage_tab_hash_id + "&begin_time=" + p_time_count.begin_time + 
		"&reading_time=" + p_time_count.accumulate_time + "&end_time=" + p_time_count.end_time + "&click_num=" + p_time_count.click_num 
		+ "&username=" + name + "&password=" + password + "&version=2.2";
		//var URL = "http://localhost:8080/SIFServer/servlet/HelloWorld?test=helloworld";
		xmlhttp.open("POST",URL, true);   //async style
		//xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
		//to store the user data via ajax by imitating the form, the second parameter is a must.
		xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
		xmlhttp.send(data_send);
//		xmlhttp.onreadystatechange = function() {
//				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//					alert(xmlhttp.responseText);
//				}
//			};
		//xmlhttp.SetRequestHeader ("Content-Type","text/xml; charset=utf-8");   
		//xmlhttp.SetRequestHeader ("SOAPAction","http://tempuri.org/SayHelloTo");   
		//xmlhttp.send(null);   
		//var result = xmlhttp.status;   
		//OK  
		//if(result==200) {   
		//	document.write(xmlhttp.responseText);   
		//}   
		//xmlhttp = null; 
	 }
}

var flag
var hashTable = new Hashtable();
/**
 * store the tab2url map array, 
 * 1, to cache and avoid the get method every time you want to search. 
 * 2, sometime the url may be deleted, updated and replaced.
 */
var tab2url = new Hashtable(); //the required url mapping in the tabs currently.
var tab2tab_hash_id = new Hashtable(); //the required tab hash id mapping in the tabs currently. 

var last_active_tab_id = -2;
var current_active_tab_id = -2;
var current_active_url = "chrome://newtab/"; 	//the current active url, which is corresponding to the current active tab id.
var last_active_url = "chrome://newtab/";		//the last active url, not corresponding to the last acitve tab id.

var last_active_window_id = -2;
var current_active_window_id = -2;

var first_open = true; //whether first to open the chrome.


/**
 * add the parent page click_number.
 * @param {Object} p_parent_hash_id
 */
function add_to_parent_page(p_parent_hash_id){
	if (hashTable.containsKey(p_parent_hash_id)){
		var temp_timecount = hashTable.get(p_parent_hash_id);
		temp_timecount.click_num = temp_timecount.click_num + 1;
	}
}


function add_new_tab_time_count(tabId, tab){
	var hash_value, tab_id, timecount, myDate, temp_tab_time_count, tabId_key;			
	hash_value = getHashCode(tab.url, true);
	tab_id = tabId + "_" + hash_value;	
	tabId_key = tabId.toString(); 
	
	
	/**
	 * parent resolve
	 */
	var parent_hash_id = "no_parrent_tab_id";
	//modify reasons just as follows in the onreplaced method.
	if (tab2url.containsKey(tabId_key)){ //update in the same tab
	//	parent_hash_id = tabId_key + "_" + getHashCode(last_active_url, true);
	}else{ //update in the new tab
		//has invoked the onactive event, the parent tab is the last active tab.
		//may be the chrome://newtab.
		if (current_active_url != "chrome://newtab/"){
			//this is the first situation exactly.
			if (tab.active && last_active_tab_id != -2 && tab2url.containsKey(last_active_tab_id.toString())){//foreground
				parent_hash_id = tab2tab_hash_id.get(last_active_tab_id.toString()); 
			}else{//background
				if (current_active_tab_id != -2 && tab2url.containsKey(current_active_tab_id.toString()))
					parent_hash_id = tab2tab_hash_id.get(current_active_tab_id.toString()); 
			}
		}	
	}
	add_to_parent_page(parent_hash_id);	
	
	
	
	myDate = new Date();
	temp_tab_time_count = new TabTimeCount(tab_id, -1, 0, tab.url, tab.title, myDate.getTime(), parent_hash_id);				
	hashTable.put(tab_id, temp_tab_time_count);
	//update the mapping array.
	tab2url.put(tabId_key,tab.url);
	tab2tab_hash_id.put(tabId_key, tab_id);
	
	//update the last and current active url.
	//this is the first situation in the loading event, and this mapping update is not done in the activate and old tab update
	//resolve procedure. The second situation, this is done in the activate event. 
	if (current_active_url == "chrome://newtab/"){
		last_active_url = current_active_url;
		current_active_url = tab.url;
	}	
}


function resetTitle(p_tab_id, tab){
	if (tab2url.containsKey(p_tab_id.toString())) {
		var str_tab_hash_id = tab2tab_hash_id.get(p_tab_id.toString());
		//alert(tab_id);
		var timecount = hashTable.get(str_tab_hash_id);
		timecount.tab_title = tab.title;		
	} else {
		//may be the unmatched urls.
		//alert("SIF Extension Error 005: activate tab error, no tab to url mapping item found : current_active_tab_id");
	}
}



/**
 * the resolve method for tab remove event.
 * @param {Object} tabId
 * @param {Object} removeInfo
 */
function tabsOnRemovedListener(tabId, removeInfo){
	//alert("tabsOnRemovedListener");
	if (tab2url.containsKey(tabId.toString())){
			var tab_id = tab2tab_hash_id.get(tabId.toString());
			var timecount = hashTable.get(tab_id);
			if (timecount != null) {
				var myDate = new Date();
				if (timecount.last_start_time != -1) {//closed the tab not from the background					
					timecount.accumulate_time = timecount.accumulate_time
							+ myDate.getTime() - timecount.last_start_time;
					//alert(timecount.accumulate_time);
					timecount.last_start_time = -1;
				}
				//alert(timecount.accumulate_time);
				timecount.end_time = myDate.getTime();

				//sent the value
				store_time_count(timecount, timecount.tab_url);

				//delete the tab from the hash time account array, and delete the corresponding tab url mapping information.
				hashTable.remove(tab_id);
				tab2url.remove(tabId.toString());
				tab2tab_hash_id.remove(tabId.toString());
			} else {
				tab2url.remove(tabId.toString());
				tab2tab_hash_id.remove(tabId.toString());
				//alert("SIF Extension Error 002: Remove tab error, no time count record found for the current tab.");
			}
		} else {
			//alert("SIF Extension Error 001: Remove tab error, no tab to url mapping item found and it shoud be.");
		}
}


/**
 * the resove method for windows remove event.
 * @param {Object} windowId
 */
//function windowsOnRemovedListener(windowId){
//	//alert("windowsOnRemovedListener");
////	chrome.windows.get(windowId, {"populate":true}, function (window){
////		var _l_arr_tabs = window.tabs;
////		for (var _iter_tab in _l_arr_tabs){
////			tabsOnRemovedListener(_iter_tab.id, {});
////		}
////	});
//}

/**
 * the newly opened tabs resolve method.
 * @param {Object} tabId
 * @param {Object} changeInfo
 * @param {Object} tab
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//alert("onUpdated");
		//alert(changeInfo.url);
		//alert(tab.url);
		if (tab.url != "chrome://newtab/" && changeInfo.status == "complete") {
			//alert("complete" + tab.url + " id: " + tabId);			
			//just start the timer, in this block the tab must be loaded in the tab2url array.			
			if (tab.active){
				start_time_count(tabId);
			}	
			resetTitle(tabId, tab);
		} else if (tab.url != "chrome://newtab/"
				&& changeInfo.status == "loading") {
			//alert("loading");
			//to resove when open the url and chrome directly from other place, such as qq and word
			//but the operation is a repeat when the second conditon meets and the latter update event, only meaningful 
			//in the last cited situation.
			if (first_open){
				current_active_tab_id = tabId;
				current_active_url = tab.url;
				current_active_window_id = tab.windowId;
				first_open = false;
			}
			
			var tabId_key = tabId.toString();
			if (tab2url.containsKey(tabId_key)){
				var temp_url = tab2url.get(tabId_key);			
//				alert("loading tab." + tab.url + tabId + " last url:"
//						+ temp_url);
				//replace tab event, comprise the last two event in the loading events.				
				var hash_value, tab_id, timecount, myDate, temp_tab_time_count;
				if ((temp_url != tab.url)) {
					//judge whether the operation is  the fresh operation and self-fresh operation of the page itself.
					//remove and store the former
					//alert("replace tab event");
					hash_value = getHashCode(temp_url, true);
					tab_id = tabId + "_" + hash_value;
					timecount = hashTable.get(tab_id);

					myDate = new Date();
					if (timecount != null && timecount.last_start_time != -1) {						
						timecount.accumulate_time = timecount.accumulate_time
								+ myDate.getTime() - timecount.last_start_time;
						timecount.last_start_time = -1;
					} else {
						//alert("SIF Extension Error: the tab is not active while the start the loading event.");
					}
					if (timecount != null && typeof (timecount) != "undefined")
					timecount.end_time = myDate.getTime();
					//alert(timecount.accumulate_time);
					
					//sent the value to the server.
					store_time_count(timecount, temp_url);
					
					//remove in the hashtable
					hashTable.remove(tab_id);
					
					//change the last and current tab url
					last_active_url = temp_url;
					current_active_url = tab.url;	
					
					//add the new tab of the last two situations, the last half operations of the last two situation.
					add_new_tab_time_count(tabId, tab);
				} else {
					//alert("the same url in loading phase.");
					//this is a fresh operation
					stop_time_count(tabId);
				}				
			}else{		
				//replace tab event, comprise all the operation of the first two situation in the loading events, which have no former tab to resolve
				//resolved the first two events in the loading function could insert the tab to the hashtable more quickly and 
				//could help maintain the parent tab relationship.
				add_new_tab_time_count(tabId, tab);
			}
		}
	});

/**
 * the tab close resolve method.
 * @param {Object} tabId
 * @param {Object} removeInfo
 */
chrome.tabs.onRemoved.addListener(tabsOnRemovedListener);


/**
 * the resolve method for the onactivated event.
 * @param {Object} activeInfo
 */
chrome.tabs.onActivated.addListener(function(activeInfo) {
	//alert("onActivated.\t " + activeInfo.tabId);
	last_active_tab_id = current_active_tab_id;
	last_active_url = current_active_url;
	current_active_tab_id = activeInfo.tabId;
	chrome.tabs.get(current_active_tab_id,function(tab){
		if (typeof (tab) != "undefined"){
			current_active_url = tab.url;
		}else{
			current_active_url = "chrome://newtab/";
		}		
	});

	//stop the former
	stop_time_count(last_active_tab_id);

	//start the newer
	start_time_count(current_active_tab_id);
});

//chrome.tabs.onHighlighted.addListener(function(highlightInfo) {
//	alert("chrome.tabs.onHighlighted.addListener method.");	
//});

/**
 * the tab replaced resolve method.
 * @param {Object} addedTabId
 * @param {Object} removedTabId
 */
chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
	//alert("onreplaced method.");

	var hash_value, tab_id, timecount, myDate, temp_tab_time_count;
	var addedTabId_str = addedTabId.toString();
	var removedTabId_str =  removedTabId.toString();

	//alert(addedTabId);
	//alert(removedTabId);
	//alert(tab2url[addedTabId]);

		chrome.tabs
				.get(addedTabId, function(tab) {
					//alert("in function: " + removedTabId);
						if (!(tab2url.containsKey(removedTabId_str)) || tab2url.get(removedTabId_str) != tab.url) {
							//not the refresh operation.

						//add the new tab.
						if (tab.url != "chrome://newtab/"){					
							//to resove when open the url and chrome directly from other place, such as qq and word
							//but the operation is a repeat when the second conditon meets and the latter update event, only meaningful 
							//in the last cited situation.
							if (first_open){
								current_active_window_id = tab.windowId;
								first_open = false;
							}							
							hash_value = getHashCode(tab.url, true);
							tab_id = addedTabId + "_" + hash_value;
							myDate = new Date();
							
							var parent_hash_id = "no_parrent_tab_id";
							//this is the general appoach to get the parent tab, but the correctness cant't be 
							//always guranteed, so this is doomed to be a failure.
							//but the limited to the shopping portal situation, it could be guranteed to be correct.
							//so ,commented.
//							if (tab2url.containsKey(removedTabId_str)){
//								parent_hash_id = removedTabId + "_" + getHashCode(tab2url.get(removedTabId_str),true); 
//							}
//							add_to_parent_page(parent_hash_id);
	
							if (tab.active) {
								temp_tab_time_count = new TabTimeCount(tab_id, myDate.getTime(), 0, tab.url, tab.title, myDate.getTime(), parent_hash_id);
							} else {
								temp_tab_time_count = new TabTimeCount(tab_id, -1, 0, tab.url, tab.title, myDate.getTime(), parent_hash_id);
							}						
							hashTable.put(tab_id, temp_tab_time_count);
							tab2url.put(addedTabId_str,tab.url);
							tab2tab_hash_id.put(addedTabId_str, tab_id);
						}
						

						//store the information of the removedTabId.
						//alert("removedID: " + tab2url[removedTabId]);
						if (tab2url.containsKey(removedTabId_str)) {
							tab_id = tab2tab_hash_id.get(removedTabId_str);
							timecount = hashTable.get(tab_id);

							if (timecount != null) {
								myDate = new Date();
								if (timecount.last_start_time != -1) {//closed the tab not from the background									
									timecount.accumulate_time = timecount.accumulate_time
											+ myDate.getTime()
											- timecount.last_start_time;
									timecount.last_start_time = -1;
								} else {
									//alert("SIF Extension Error 008: Replace tab error, the last start account time is -1.");
								}
								timecount.end_time = myDate.getTime();
								//alert("time: " + timecount.accumulate_time);
								
								//sent the value to the server.
								store_time_count(timecount, timecount.tab_url);

								//delete the tab from the hash time account array, and delete the corresponding tab url mapping information.
								hashTable.remove(tab_id);
								tab2url.remove(removedTabId_str);
								tab2tab_hash_id.remove(removedTabId_str);
							} else {
								tab2url.remove(removedTabId_str);
								tab2tab_hash_id.remove(removedTabId_str);
								//alert("SIF Extension Error 007: Replace tab error, no time count record found for the current tab.");
							}
						} else {
							//may be the unmatched urls.
							//alert("SIF Extension Error 006: Replace tab error, no tab to url mapping item found.");
						}

					}
				});
	});


//chrome.windows.onCreated.addListener(function(window) {
//	//alert("window oncreated.");
//	
//}); 
 
 
 
chrome.windows.onFocusChanged.addListener(function(windowId) {
	//alert("on focus changed. \t" + windowId);
	last_active_window_id = current_active_window_id;
	current_active_window_id = windowId;		
	last_active_tab_id = current_active_tab_id;
	last_active_url = current_active_url;
	
	if (last_active_window_id != -1){	//-1 to indicate the chrome onblue event.
		// stop the time count of the last active window	
		chrome.tabs.query({"windowId":last_active_window_id, "active":true}, function(tab_array){
			 if (typeof(tab_array) != "undefined" && tab_array.length != 0){
				 var tab_last_active = tab_array[0];
				// alert(tab_last_active.url+ " : " + tab_array.length);
				 stop_time_count(tab_last_active.id);
			 }
		 });
		
	}
		 
	 if (current_active_window_id != -1){//the chrome blur		
		 //beign the timing of the current active window
 		 chrome.tabs.query({"windowId":current_active_window_id, "active":true}, function(tab_array){
 			  if (typeof(tab_array) != "undefined" && tab_array.length != 0){
				 var tab_cur_window_active = tab_array[0];
				 //alert(tab_cur_window_active.url + " : " + tab_array.length);
				 current_active_tab_id = tab_cur_window_active.id;
				 current_active_url = tab_cur_window_active.url;
				 start_time_count(tab_cur_window_active.id);
			 }	 
 		});		
	}else{
		current_active_tab_id = -1;
		current_active_url = "chrome://newtab/";
	}	
}); 

/**
 * the resolve method for the windows remove event, 
 * commented because in this event, the tab remove event is invoked before this event. 
 * @param {Object} details
 */
//chrome.windows.onRemoved.addListener(windowsOnRemovedListener);


/**
 * give it up because it can't resolve the open event initialized from the right-click menu.
 * @param {Object} details
 */
//var _g_parent_tab_id = -1;
//var _g_child_tab_id = -1;
//
//function onCreatedNavigationTargetListener(details){
//	//alert("onCreatedNavigationTargetListener");
//	alert(details.sourceTabId);
//	alert(details.url);
//	_g_parent_tab_id = details.sourceTabId;
//	_g_child_tab_id = details.tabId;
//}
//
//chrome.webNavigation.onCreatedNavigationTarget.addListener(onCreatedNavigationTargetListener);


/**
 * login or give tip to login
 */
//if (true){
//	localStorage["login_status"] = "false";
//	
//	var name = localStorage["sif_username"];
//	var password = localStorage["sif_password"];	
//	if (name == null || password == null) {
//		alert("Please login the SIF first, thanks:)");
//	}else if (name != null && password != null){
//		
//	}
//}

