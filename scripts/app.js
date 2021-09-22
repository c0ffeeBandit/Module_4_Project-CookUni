let hashRoute = undefined; // explicit paranioa
let userObj = undefined;
let user = undefined;

function listen() {
	// main loop!
	let current = getCurrent();
	// console.log( window.location.hash );
	if (current !== hashRoute) {
		// user request page change || current !== ""
		// this always trigger the first time, hashRout inits to undefined.
		// console.log( window.location.hash );
		hashRoute = current;
		renderNav();
		if (hashRoute == "#home") {
			// of a user
			home();
		} else if (hashRoute == "#register") {
			// console.log( "Run register()" );
			// window.location.hash = "#register";
			register();
		} else if (hashRoute == "#logout") {
      reset();
		} else if (hashRoute.includes("recepie")) {
			// console.log("Run recepieInfo()");
			let [i, idStr] = hashRoute.split("/");
      console.log( idStr );
			recepieInfo(idStr);
		} else if (hashRoute == "#edit" || hashRoute == "#share") {
			console.log("Run recepieEdit()");
			recepieEdit();
		} else if (!user || window.location.hash == "" || hashRoute == "#login" ) {
			// console.log( "Run login()" );
			// window.location.hash = "#login";
			login();
		}
	}
	setTimeout(listen, 200);
}
function reset() {
	logout(); // kill data and route
	renderNav(); // default the nav
	login(); // login!
}
function render(html) {
  document.getElementById("container").innerHTML = html;
}
function renderNav(){
	if( !user && !userObj ){ // render logged out nav
		// let src = document.getElementById("navLoggedOut").innerHTML;
		// let template = Handlebars.compile(src);
		// let context = {}; // {{ N/A }}
		// let html = template(context);
		document.getElementById("nav").innerHTML = document.getElementById("navLoggedOut").innerHTML;
	}else{ // render logged in nav
		console.log( userObj.firstName );
		let src = document.getElementById("navLoggedIn").innerHTML;
		let template = Handlebars.compile(src);
		let context = { name: userObj.firstName };
		let html = template(context);
		document.getElementById("nav").innerHTML = html;
	}
}
function getCurrent() {
  return window.location.hash;
}
function getCatImgURL(category) {
  switch (category) {
    case "Vegetables and legumes/beans":
      return "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg";
    case "Fruits":
      return "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg";
    case "Grain Food":
      return "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg";
    case "Milk, cheese, eggs and alternatives":
      return "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg";
    case "Lean meats and poultry, fish and alternatives":
      return "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg";
  }
}
function login() {
	// and loginClick()
	let src = document.getElementById("loginTemplate").innerHTML;
	let template = Handlebars.compile(src);
	let context = {}; // {{ N/A }}
	let html = template(context);
	render(html);
	let loginButton = document.getElementById("loginButton");
	loginButton.addEventListener("click", (e) => {
		e.preventDefault();
		loginClick();
	});
}
function loginClick() {
	// console.log( "Login button clicked." );
	let userName = document.getElementById("loginFormUserName").value;
	let passWord = document.getElementById("loginFormPassword").value;
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/users.json";
	let headers = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};
	let users = {};
	fetch(url, headers)
		.then(function (response) {
			// if( response.status == 200 ){
			return response.json();
			// }
		})
		.then(function (data) {
			console.log(data);
			users = data;
			// console.log( Object.entries(users) );
			let newUsers = Object.entries(users);
			for (let idx in newUsers) {
				// console.log( idx, newUsers[idx], newUsers[idx][1].userName, newUsers[idx][1].password );
				if (
					newUsers[idx][1].userName == userName &&
					newUsers[idx][1].password == passWord
				) {
					// console.log( idx, "matches", newUsers[idx][0] );
					user = newUsers[idx][0];
					userObj = newUsers[idx][1];
					window.location.hash = "#home";
					console.log(
						"logged in",
						userObj.firstName,
						user,
						JSON.stringify(userObj)
					);
				}
			}
		});
}
function logout() {
  userObj = undefined;
  user = undefined;
  window.location.hash = "";
}
function register() {
	// and registerClick()
	let src = document.getElementById("registerTemplate").innerHTML;
	let template = Handlebars.compile(src);
	let context = {}; // {{ N/A }}
	let html = template(context);
	render(html);
	let registerButton = document.getElementById("registerButton");
	registerButton.addEventListener("click", (e) => {
		e.preventDefault();
		registerClick();
	});
}
function registerClick() {
	// console.log( "Register button clicked." );
	// TODO ( use the login code to find user, and if NOT, register )
	let firstName = document.getElementById("defaultRegisterFormFirstName");
	let lastName = document.getElementById("defaultRegisterFormLastName");
	let userName = document.getElementById("defaultRegisterFormUsername");
	let firstPass = document.getElementById("defaultRegisterFormPassword");
	let secondPass = document.getElementById("defaultRegisterRepeatPassword");
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/users.json";
	let userError =
		"This username is already taken. Please retry your request with a different username.";
	let passError =
		"Passwords do not match. Please retry your request with matching passwords.";
	let users = {};
	let valid = true;
	// check parts for required entries ( TODO )
	if (!firstName.value) {
		valid = false;
		firstName.style.borderColor = "red";
	} else {
		firstName.style.borderColor = "green";
	}
	if (!lastName.value) {
		valid = false;
		lastName.style.borderColor = "red";
	} else {
		lastName.style.borderColor = "green";
	}
	if (!userName.value) {
		valid = false;
		userName.style.borderColor = "red";
	} else {
		userName.style.borderColor = "green";
	}
	if (!firstPass.value) {
		valid = false;
		firstPass.style.borderColor = "red";
	} else {
		firstPass.style.borderColor = "green";
	}
	if (!secondPass.value) {
		valid = false;
		secondPass.style.borderColor = "red";
	} else {
		secondPass.style.borderColor = "green";
	}
	if (firstPass.value != secondPass.value) {
		alert(passError);
		return;
	} else {
		fetch(url)
			.then(function (response) {
				// if( response.status == 200 ){
				return response.json();
				// }
			})
			.then(function (data) {
				// console.log( data );
				// console.log( Object.entries(data) );
				let newUsers = Object.entries(data);
				for (let idx in newUsers) {
					// console.log( idx, newUsers[idx], newUsers[idx][1].userName, newUsers[idx][1].password );
					if (
						newUsers[idx][1].userName == userName.value &&
						newUsers[idx][1].password == firstPass.value
					) {
						firstPass.value = "";
						secondPass.value = "";
						alert(userError);
						return;
					}
				}
			});
	}
	let body = {
		userName: userName.value,
		password: firstPass.value,
		firstName: firstName.value,
		lastName: lastName.value,
	};
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	};
	console.log(JSON.stringify(body));
	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			user = data.name;
			return data;
		});
  alert( "Registration success, you can log in now." );
  reset();
}
function home() {
	console.log("I'm home!");
	if (!user) {
		reset();
	}
	// load recepies
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/recepies.json";
	fetch(url)
		.then(function (response) {
			console.log(response.status);
			if (response.status > 200) {
				let src = document.getElementById("fnf").innerHTML;
				let template = Handlebars.compile(src);
				let context = {}; // {{ N/A }}
				let html = template(context);
				render(html);
				return;
			}
			return response.json();
		})
		.then(function (data) {
			// console.log("RecepieID", data.name); // recepie ID
			console.log("All data", JSON.stringify(data));
			render(JSON.stringify(data));
			let finalData = [];
			let initData = Object.entries(data);
			for (const entry of initData) {
				let recepieID = entry[0];
				let recepieObj = entry[1];
				recepieObj.recepieID = recepieID;
				finalData.push(recepieObj);
			}
			console.log("FinalData", JSON.stringify(finalData));
			let src = document.getElementById("recepieCards").innerHTML;
			let template = Handlebars.compile(src);
			let context = { recepie: finalData };
			let html = template(context);
			// console.log( html );
			render(html);
			// // manipilate data into a form the template will like
			// process each id into a card template
			return data;
		});
	// if none, go fnf, return;
	// else render list of recepie cards into container
}
function recepieEdit(idStr) {
	// aka: share recepie AND function sendRecepie()
  if (!user){ reset(); }
	let src = document.getElementById("recepieEdit").innerHTML;
	let template = Handlebars.compile(src);
	let context = {}; // {{ N/A }}
	let html = template(context);
	render(html);
	let editButton = document.getElementById("editButton");
	editButton.addEventListener("click", (e) => {
		e.preventDefault();
		sendRecepie();
	});
}
function sendRecepie(){ // aka: recepieEditClick
  if ( !user ){ reset(); }
	let meal = document.getElementById("editMeal");
	let ingredients = document.getElementById("editIngredients");
	let preparation = document.getElementById("editPreparation");
	let foodImgURL = document.getElementById("editFoodImageURL");
	let description = document.getElementById("editDescription");
	let category = document.getElementById("editCategory");
	let catImgURL = getCatImgURL(category[category.selectedIndex].value); // string
	let valid = true;
	// validate items, highlight bad in red and stay on page
	// TODO validate better?!
	if (!meal.value) {
		valid = false;
		meal.style.borderColor = "red";
	} else {
		meal.style.borderColor = "green";
	}
	if (!ingredients.value) {
		valid = false;
		ingredients.style.borderColor = "red";
	} else {
		ingredients.style.borderColor = "green";
	}
	if (!preparation.value) {
		valid = false;
		preparation.style.borderColor = "red";
	} else {
		preparation.style.borderColor = "green";
	}
	if (!foodImgURL.value) {
		valid = false;
		foodImgURL.style.borderColor = "red";
	} else {
		foodImgURL.style.borderColor = "green";
	}
	if (!description.value) {
		valid = false;
		description.style.borderColor = "red";
	} else {
		description.style.borderColor = "green";
	}
	if (idx == 0) {
		valid = false;
		category.style.borderColor = "red";
	} else {
		category.style.borderColor = "green";
	}
	if (!valid) {
		return;
	}
	// construct data item for recepie body
	let body = {
		meal: meal.value,
		ingredients: ingredients.value,
		prepMethod: preparation.value,
		description: description.value,
		foodImageURL: foodImgURL.value,
		category: category[category.selectedIndex].value,
		likesCounter: 0,
		categoryImageURL: catImgURL,
		creator: user,
	};
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/recepies.json";
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	};
	console.log(JSON.stringify(body));
	fetch(url, headers)
		.then(function (response) {
			// console.log(response.status);
			return response.json();
		})
		.then(function (data) {
			console.log(data.name); // recepie ID
			// add data.name to recepie data as "recepieID" (post)
			// user = data.name;
			return data;
		});
}

function recepieInfo(idStr) {
	if (!user) {
		reset();
	}
	console.log("Get recepie:", idStr, "and render in recepieInfo template");
	if (!user) {
		window.location.hash = "#login";
	}
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
	fetch(url)
  .then(function (response) {
    // console.log(response.status);
    return response.json();
  })
  .then(function (data) {
    console.log("Recepie Info Data:", JSON.stringify(data)); // recepie ID
    let src = document.getElementById("recepieInfo").innerHTML;
    let template = Handlebars.compile(src);
    let context = data;
    context.recepieID = idStr;
    let html = template(context);
    console.log(html);
    render(html);
    return data;
  });
}


function moveDiv(div) { // empty
}
function fixDiv(div) { // empty
}
