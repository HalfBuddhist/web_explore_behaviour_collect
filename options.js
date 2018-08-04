window.onload = function() {

	document.getElementById('btnSave').addEventListener("click", login);
	document.getElementById('a_regist').addEventListener("click",
			showRegistPanel);
	document.getElementById('a_login')
			.addEventListener("click", showLoginPanel);
	document.getElementById('btnSave_regist').addEventListener("click", regist);

	var name = localStorage["sif_username"];
	var password = localStorage["sif_password"];
	if (name != null) {
		txtName.value = name;
		document.getElementById('current_user').innerHTML="currently login as: <b><i>" +  name + "</i></b>";
	}

	if (password != null) {
		txtPassword.value = password;
	}

};

function showRegistPanel() {
	document.getElementById("div_user_regist").style.display = "block";
	document.getElementById("div_user_login").style.display = "none";
}

function showLoginPanel() {
	document.getElementById("div_user_regist").style.display = "none";
	document.getElementById("div_user_login").style.display = "block";
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

var g_destination = "http://tu069177.ip.tsinghua.edu.cn:8080/SIFServer";

function login() {

	localStorage.removeItem("sif_username");
	localStorage.removeItem("sif_password");
	localStorage.removeItem("looptime");

	if (txtName.value == null || txtName.value == "") {
		alert("Pleae input the name!");
		return;
	}

	if (txtPassword.value == null || txtPassword.value == "") {
		alert("Pleae input the password!");
		return;
	}

	var xmlhttp = new createXMLHttp();
	var URL = g_destination + "/servlet/UserService";
	var data_send = "type=login&username=" + txtName.value + "&password="
			+ txtPassword.value;
	xmlhttp.open("POST", URL, true); //async style
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (xmlhttp.responseText == "true") {
				alert("login success");
				localStorage["sif_username"] = txtName.value;
				localStorage["sif_password"] = txtPassword.value;
				localStorage["login_status"] = "true";
				localStorage["looptime"] = 0;
				window.close();
			} else {
				alert("login failure!");
			}
		}
	};
	//xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
	//to store the user data via ajax by imitating the form, the second parameter is a must.
	xmlhttp.setRequestHeader('Content-Type',
			'application/x-www-form-urlencoded;charset=UTF-8');
	xmlhttp.send(data_send);
}

function regist() {

	if (txtName_regist.value == null || txtName_regist.value == "") {
		alert("Pleae input the name!");
		return;
	}

	if (txtPassword_regist.value == null || txtPassword_regist.value == ""
			|| txtPassword_regist_2.value == null
			|| txtPassword_regist_2.value == "") {
		alert("Pleae input the password!");
		return;
	}

	if (txtPassword_regist.value != txtPassword_regist_2.value) {
		alert("The two passwords you typed do not match!");
		return;
	}

	var xmlhttp = new createXMLHttp();
	var URL = g_destination + "/servlet/UserService";
	var data_send = "type=regist&username=" + txtName_regist.value + "&password="
			+ txtPassword_regist.value;
	xmlhttp.open("POST", URL, true); //async style
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (xmlhttp.responseText == "regist success!") {
				alert("regist success!");
				showLoginPanel();
			} else {
				alert(xmlhttp.responseText);
			}
		}
	};
	//xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
	//to store the user data via ajax by imitating the form, the second parameter is a must.
	xmlhttp.setRequestHeader('Content-Type',
			'application/x-www-form-urlencoded;charset=UTF-8');
	xmlhttp.send(data_send);
}