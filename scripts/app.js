let hashRoute = undefined; // explicit paranioa
let userObj = undefined; // copy of user object from firebase, PLUS userID
let user = undefined; // for user ID
var successAlert = document.getElementById("successBox");
var errorAlert = document.getElementById("errorBox");
var infoAlert = document.getElementById("loadingBox");

function listen() { // main loop!
	let current = getCurrent();
	if (current !== hashRoute) {
		// this always trigger the first time, hashRout inits to undefined.
		// console.log( window.location.hash );
		hashRoute = current;
		renderNav();
		if (hashRoute == "#home") {
			console.log("home();");
      home();
		} else if (hashRoute == "#register") {
      console.log("register();");
			register();
		} else if (hashRoute == "#logout") {
      console.log("reset();");
      reset();
		} else if (hashRoute.includes("recepie")) {
			let [i, idStr] = hashRoute.split("/");
      console.log("recepieInfo( idStr );");
			recepieInfo( idStr );
		} else if (hashRoute.includes("edit")) {
			let [i, idStr] = hashRoute.split("/");
      console.log("recepieEdit( idStr );");
			recepieEdit( idStr );
    } else if ( hashRoute == "#share") {
      console.log( "recepieShare();");
			recepieShare();
		} else if (!user || window.location.hash == "" || hashRoute == "#login" ){
      console.log( "login();");
			login();
		}
	}
	setTimeout( listen, 200 );
}
function reset(){
	logout(); // kill data and route
	renderNav(); // default the nav
	login(); // login!
}
function validateUser(){
  if ( !user && !userObj ) {
    console.log("Validate User Fail", user, JSON.stringify(userObj) );
    reset();
    return false;
  }else{
    return true;
  }
}
function render(html){
  document.getElementById("container").innerHTML = html;
}
function renderNav(){
	if( !user && !userObj ){ // render logged out nav
		document.getElementById("nav").innerHTML = document.getElementById("navLoggedOut").innerHTML;
	}else{ // render logged in nav
		console.log( "renderNav for:", userObj.firstName, userObj.lastName, "With ID:", user );
		let src = document.getElementById("navLoggedIn").innerHTML;
		let template = Handlebars.compile( src );
		let context = { name: `${userObj.firstName} ${userObj.lastName}` };
		let html = template( context );
		document.getElementById("nav").innerHTML = html;
	}
}
function getCurrent(){
  return window.location.hash;
}
function getCatImgURL( category ){ // could do this with an object later
  switch ( category ) {
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
function login(){
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
function loginClick(){
	console.log( "Login button clicked." );
	let userName = document.getElementById("defaultRegisterFormUsername").value;
	let password = document.getElementById("defaultRegisterFormPassword").value;
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/users.json";
	setInfoBox();
	fetch( url )
		.then(function (response) {
			if( response.status == 200 ){
        clearInfoBox();
      }
			return response.json();
		})
		.then(function (data) {
			// console.log( Object.entries(data) );
			let newUsers = Object.entries(data);
			for (let idx in newUsers) {
				if ( newUsers[idx][1].userName == userName && newUsers[idx][1].password == password ) {
					userName = "";
					password = "";
					setSuccessBox("Login successful.");
					user = newUsers[idx][0];
					userObj = newUsers[idx][1];
					userObj.userID = newUsers[idx][0];
					console.log("logged in",	userObj.firstName, userObj.lastName, user, JSON.stringify(userObj) );
          setInfoBox();
					window.location.hash = "#home";
				}
			}
		});
}
function logout(){
	setSuccessBox("Logout successful.");
	userObj = undefined;
	user = undefined;
	window.location.hash = "";
}
function register(){
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
function registerClick(){
	let firstName = document.getElementById("defaultRegisterFormFirstName");
	let lastName = document.getElementById("defaultRegisterFormLastName");
	let userName = document.getElementById("defaultRegisterFormUsername");
	let firstPass = document.getElementById("defaultRegisterFormPassword");
	let secondPass = document.getElementById("defaultRegisterRepeatPassword");
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/users.json";
	let userError = "This username is already taken. Please retry your request with a different username.";
	let passError = "Passwords do not match. Please retry your request with matching first and second passwords.";
	let valid = true;
  let errorStr = "";
	if( !firstName.value && firstName.length < 2 ){
		valid = false;
    errorStr += "\n  First Name must be longer than 2 characters.";
		firstName.style.borderColor = "red";
	}else{
		firstName.style.borderColor = "green";
	}
	if( !lastName.value && lastName.length < 2 ){
		valid = false;
    errorStr += "\n  Last Name must be longer than 2 characters.";
		lastName.style.borderColor = "red";
	}else{
		lastName.style.borderColor = "green";
	}
	if( !userName.value && userName.length < 3 ){
		valid = false;
    errorStr += "\n  User Name must be longer than 3 characters.";
		userName.style.borderColor = "red";
	} else {
		userName.style.borderColor = "green";
	}
	if( !firstPass.value && firstPass.length < 6 ){
		valid = false;
    errorStr += "\n  First Password must be longer than 6 characters.";    
		firstPass.style.borderColor = "red";
	} else {
		firstPass.style.borderColor = "green";
	}
	if( !secondPass.value && secondPass.length < 6 ){
		valid = false;
    errorStr += "\n  Second Password must be longer than 6 characters.";    
		secondPass.style.borderColor = "red";
	} else {
		secondPass.style.borderColor = "green";
	}
  if( !valid ){
    setErrorBox(`Please fix as follows and try again; ${errorStr}`);
    return;
  }
	if (firstPass.value != secondPass.value) {
		setErrorBox( passError );
		return;
	} else {
    setInfoBox("Validating...");
		fetch(url)
			.then(function (response) {
				if( response.status == 200 ){
          clearInfoBox();
        }
				return response.json();
			})
			.then(function (data) {
				// console.log( Object.entries(data) );
				let newUsers = Object.entries(data);
				for (let idx in newUsers) {
					// console.log( idx, newUsers[idx], newUsers[idx][1].userName, newUsers[idx][1].password );
					if (
						newUsers[idx][1].userName == userName.value &&
						newUsers[idx][1].password == firstPass.value
					) {
						firstPass.value = "";
						secondPass.value = ""; // snicker, just being mean.
            setErrorBox( userError );
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
	// console.log(JSON.stringify(body));
	fetch(url, headers)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			// console.log(data);
			user = data.name;
      body.userID = data.name;
			return data;
		});
  userName.value = "";
  firstPass.value = "";
  firstName.value = "";
  lastName.value = ""; 
  setSuccessBox("User registration successful.");
  userObj = body;
	window.location.hash = "#home";
  setInfoBox();
}
function home(){
	if ( !validateUser() ){ return; }
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/recepies.json";
  setInfoBox();
	fetch(url)
    .then(function (response) {
      // console.log(response.status);
      clearInfoBox();
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
      // render(JSON.stringify(data)); // just to see what came back on the page
      let finalData = [];
      let initData = Object.entries(data);
      for ( const entry of initData ){ // make it like handlebars expects
        let recepieID = entry[0];
        let recepieObj = entry[1];
        recepieObj.recepieID = recepieID;
        finalData.push(recepieObj);
      }
      // console.log("FinalData", JSON.stringify(finalData));
      let src = document.getElementById("recepieCards").innerHTML;
      let template = Handlebars.compile(src);
      let context = { recepie: finalData };
      let html = template(context);
      render( html );
      return data;
  });
	// TODO test fnf !
}
function recepieShare(){
  if ( !validateUser() ){ return; }
  let src = document.getElementById("recepieEdit").innerHTML;
  let template = Handlebars.compile(src);
  let context = {}; // {{ N/A }}
  let html = template(context);
  render(html);
  let shareButton = document.getElementById("shareButton");
	shareButton.addEventListener("click", (e) => {
		e.preventDefault();
		shareRecepieClick();
	});
}
function shareRecepieClick(){
	if ( !validateUser() ){ return; }
	let meal = document.getElementById("defaultRecepieShareMeal");
	let ingredients = document.getElementById("defaultRecepieShareIngredients");
	let preparation = document.getElementById("defaultRecepieShareMethodOfPreparation");
	let foodImgURL = document.getElementById("defaultRecepieShareFoodImageURL");
	let description = document.getElementById("defaultRecepieShareDescription");
	let category = document.getElementById("shareCategory");
	let catImgURL = getCatImgURL(category[category.selectedIndex].value); // string
	let valid = true;
  let errorStr = "";
	if (!meal.value && meal.length < 4) {
		valid = false;
    errorStr += "\n  Meal Name must be longer than 4 characters.";    
		meal.style.borderColor = "red";
	} else {
		meal.style.borderColor = "green";
	}
	if (
		!ingredients.value &&
		ingredients.length < 2 &&
		Array.isArray(ingredients)
	) {
		valid = false;
    errorStr += "\n  Ingredients must be an array of at least 2 entries.";    
		ingredients.style.borderColor = "red";
	} else {
		ingredients.style.borderColor = "green";
	}
	if (!preparation.value && preparation.length < 10) {
		valid = false;
		errorStr += "\n  Preparation Method must be longer than 10 characters.";    
    preparation.style.borderColor = "red";
	} else {
		preparation.style.borderColor = "green";
	}
	if (
		!foodImgURL.value &&
		!(foodImgURL.includes("http://") || foodImgURL.includes("https://"))
	) {
		valid = false;
		errorStr += "\n  Food Image Url must include http:// or https://";    
    foodImgURL.style.borderColor = "red";
	} else {
		foodImgURL.style.borderColor = "green";
	}
	if (!description.value && description.length < 10) {
		valid = false;
    errorStr += "\n  Description must be longer than 10 characters.";    
		description.style.borderColor = "red";
	} else {
		description.style.borderColor = "green";
	}
	if (category.selectedIndex == 0) {
		valid = false;
    errorStr += "\n  Category must be selected from the list (not left at default).";    
		category.style.borderColor = "red";
	} else {
		category.style.borderColor = "green";
	}
	if (!valid) {
		setErrorBox(`Please fix as follows and try again; ${errorStr}`);
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
  setInfoBox("Sending...");
	// console.log(JSON.stringify(body));
	fetch(url, headers)
		.then(function (response) {
			clearInfoBox();
			return response.json();
		})
		.then(function (data) {
			// console.log(data.name); // recepie ID
      setSuccessBox("Recipe shared successfully!");
      document.getElementById("editMeal").value = "";
      document.getElementById("editIngredients").value = "";
      document.getElementById("editPreparation").value = "";
      document.getElementById("editFoodImageURL").value = "";
      document.getElementById("editDescription").value = "";
      setInfoBox();
      window.location.hash = "#home";
			return data;
		});

}
function recepieEdit( idStr ) {
	if ( !validateUser() ){ return; }
  // console.log("Get recepie:", idStr, "and render in recepieEdit template");
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
	setInfoBox();
	fetch(url)
  .then(function (response) {
    if (response.status < 300) {
			clearInfoBox();
		}
    return response.json();
  })
  .then(function (data) {
    // console.log("Recepie Edit Data:", JSON.stringify(data));
    let src = document.getElementById("recepieEdit").innerHTML;
    let template = Handlebars.compile(src);
    data.recepieID = idStr;
    let context = data;
    let html = template(context);
    render(html);
    return data;
  });
  let editButton = document.getElementById("editButton");
	editButton.addEventListener("click", (e) => {
		e.preventDefault();
		sendEditRecepie();
	});
}
function sendEditRecepie() {
	if ( !validateUser() ){ return; }
	let meal = document.getElementById("defaultRecepieEditMeal");
	let ingredients = document.getElementById("defaultRecepieEditIngredients");
	let preparation = document.getElementById("defaultRecepieEditMethodOfPreparation");
	let foodImgURL = document.getElementById("defaultRecepieEditFoodImageURL");
	let description = document.getElementById("defaultRecepieEditDescription");
	let recepieID = document.getElementById("recepieID").value;
  let likesCounter = document.getElementById("likesCounter").value;
	let category = document.getElementById("editCategory");
	let catImgURL = getCatImgURL(category[category.selectedIndex].value); // hardcoded URL string
	let valid = true;
  let errorStr = "";
  if (!meal.value && meal.length < 4) {
    valid = false;
    errorStr += "\n  Meal Name must be longer than 4 characters.";
    meal.style.borderColor = "red";
  } else {
    meal.style.borderColor = "green";
  }
  if (
    !ingredients.value &&
    ingredients.length < 2 &&
    Array.isArray(ingredients)
  ) {
    valid = false;
    errorStr += "\n  Ingredients must be an array of at least 2 entries.";
    ingredients.style.borderColor = "red";
  } else {
    ingredients.style.borderColor = "green";
  }
  if (!preparation.value && preparation.length < 10) {
    valid = false;
    errorStr += "\n  Preparation Method must be longer than 10 characters.";
    preparation.style.borderColor = "red";
  } else {
    preparation.style.borderColor = "green";
  }
  if (
    !foodImgURL.value &&
    !(foodImgURL.includes("http://") || foodImgURL.includes("https://"))
  ) {
    valid = false;
    errorStr += "\n  Food Image Url must include http:// or https://";
    foodImgURL.style.borderColor = "red";
  } else {
    foodImgURL.style.borderColor = "green";
  }
  if (!description.value && description.length < 10) {
    valid = false;
    errorStr += "\n  Description must be longer than 10 characters.";
    description.style.borderColor = "red";
  } else {
    description.style.borderColor = "green";
  }
  if (category.selectedIndex == 0) {
    valid = false;
    errorStr +=
      "\n  Category must be selected from the list (not left at default).";
    category.style.borderColor = "red";
  } else {
    category.style.borderColor = "green";
  }
  if (!valid) {
    setErrorBox(`Please fix as follows and try again; ${errorStr}`);
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
		likesCounter: likesCounter,
		categoryImageURL: catImgURL,
		creator: user,
		recepieID: recepieID,
	};
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${recepieID}.json`;
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	};
	console.log(JSON.stringify(body));
	setInfoBox("Sending...");
	fetch(url, headers)
		.then(function (response) {
			clearInfoBox();
      if( response.status < 300 ){
				setSuccessBox("Recepie saved successfully.");
			}
			return response.json();
		})
		.then(function (data) {
			// console.log(data.name); // recepie ID
			return data;
		})
  ;
	document.getElementById("editMeal").value = "";
	document.getElementById("editIngredients").value = "";
	document.getElementById("editPreparation").value = "";
	document.getElementById("editFoodImageURL").value = "";
	document.getElementById("editDescription").value = "";
  window.location.hash = "#home";
	setInfoBox();
}
function recepieInfo( idStr ){ // load and render a specific recepie with idString
	if ( !validateUser() ){ return; }
	console.log("Get recepie:", idStr, "and render in recepieEdit template");
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
  setInfoBox();
	fetch(url)
  .then(function (response) {
    if( response.status < 300 ){
      clearInfoBox();
    }
    return response.json();
  })
  .then(function (data) {
    console.log("Recepie Info Data:", JSON.stringify(data)); // recepie ID
    let src = document.getElementById("recepieInfo").innerHTML;
    let template = Handlebars.compile(src);
    data.recepieID = idStr;
    if( user == data.creator ){
      data.author = true;
    }else{
      data.author = false;
    }
    let context = data;
    let html = template(context);
    console.log(html);
    render(html);
    if( user == data.creator ){
      let deleteLink = document.getElementById("deleteLink");
      let editLink = document.getElementById("editLink");
      deleteLink.addEventListener("click", deleteRecepie(`${idStr}`));
      editLink.addEventListener("click", recepieEdit(`${idStr}`));
    }else{
      let likeLink = document.getElementById("likelink");
      likeLink.addEventListener("click", likeRecepie(`${idStr}`));
    }
    return data;
  });
}
function deleteRecepie( idStr ){
	if ( !validateUser() ){ return; }
  let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
  let body = {};
  let headers = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  setInfoBox("Sending...");
  fetch( url, headers )
  .then( function ( response ){
    if( response.status == 200 ){
			clearInfoBox();
			setSuccessBox("Your recipe was archived.");
			home();
		}
  });
}
function likeRecepie( idStr ){
	if ( !validateUser() ){ return; }
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	};
	// let data = {};
	// TODO "Getting data."
	// fetch get recepie
	// TODO clear "Getting data."
	// likesCounter++
	// TODO "Sending data."
	// fetch post recepie
	// TODO clear "Sending Data."
	// TODO popup "You liked that recipe."
  // home();
}
function setSuccessBox( str ){
  successAlert.innerHTML = str;
  successAlert.style.display = "block";
	window.setTimeout( clearSuccessBox, 5000 ); // self nuking frankfurter
}
function clearSuccessBox(){
   successAlert.style.display = "none";
}
function setInfoBox( str ){
	if (!str) {
		str = "Loading...";
  } // default string unless i need a special loading string
	infoAlert.innerHTML = str;
	infoAlert.style.display = "block";
	window.setTimeout( clearInfoBox, 5000 ); // self nuking frankfurter
}
function clearInfoBox(){
  infoAlert.style.display = "none";
}
function setErrorBox( str ){
	errorAlert.innerHTML = str;
	errorAlert.style.display = "block";
	window.setTimeout( clearErrorBox, 5000 ); // self nuking frankfurter
}
function clearErrorBox(){
  errorAlert.style.display = "none";
}