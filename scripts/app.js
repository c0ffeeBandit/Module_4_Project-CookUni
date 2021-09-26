let hashRoute = undefined; // explicit paranioa to assure it is global. no surprises.
let userObj = undefined; // copy of user object from firebase, PLUS { userID: user }
let user = undefined; // for user ID ... i can eliminate this in favor of userObj.

function route() { // main loop!
	let current = getCurrent();

	if ( current !== hashRoute ){
		hashRoute = current;
		renderNav(); // render proper nav for any page change per user, one line to handle ALL requirements.
    let [i, idStr] = hashRoute.split("/");
		if ( hashRoute == "#home" ){
      home();
		} else if ( hashRoute == "#register" ){
			register();
		} else if ( hashRoute == "#logout" ){
      logout();
		} else if ( hashRoute.includes("recepie") ){
			recepieInfo( idStr );
		} else if ( hashRoute.includes("edit") ){
			recepieEdit( idStr );
		} else if ( hashRoute.includes("archive") ){
			deleteRecepie( idStr );
		} else if ( hashRoute.includes("like") ){
			likeRecepie( idStr );
    } else if ( hashRoute == "#share" ){
			recepieShare();
		} else if ( // !user || 
                // !userObj ||
                // window.location.hash == "" ||
                hashRoute == "#login"
      ){
      login();
		} else if( hashRoute == "#makeFood" ){
      makeFood(); // for testing
    }
	}
	setTimeout( route, 150 );
}
//==================================== HELPERS ========================================================
function validateUser(){ // Do I know who you are? If not run logout, else return true.
  if ( !user && !userObj ) {
		// console.log("Validate User Fail", user, JSON.stringify(userObj));
		window.location.hash = "#logout";
		return false;
	}
  return true;
}
function render(html){ // put the stuff in the container div, make sure it is visible.
  document.getElementById("container").innerHTML = html;
  document.getElementById("container").style.display = "block";
}
function renderNav(){ // render the nav based in user data, don't foribly logout.
	if( !user && !userObj ){ // render logged out nav
		document.getElementById("nav").innerHTML = document.getElementById("navLoggedOut").innerHTML;
	}else{
		// console.log( "renderNav for:", `${userObj.firstName} ${userObj.lastName}`, " ID:", user );
		let src = document.getElementById("navLoggedIn").innerHTML;
		let template = Handlebars.compile(src);
		let context = { name: `${userObj.firstName} ${userObj.lastName}` };
		let html = template(context);
		document.getElementById("nav").innerHTML = html;
	}
}
function getCurrent(){ // get the 'hash' of the url
  return window.location.hash;
}
function getCatImgURL( category ){ // get URL for category from category data ... could do this with an object later
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
function getCatIdx( category ){ // get URL for category from category data ... this can also be an object ...
	switch (category) {
		case "Vegetables and legumes/beans":
			return 1;
		case "Fruits":
			return 2;
		case "Grain Food":
			return 3;
		case "Milk, cheese, eggs and alternatives":
			return 4;
		case "Lean meats and poultry, fish and alternatives":
			return 5;
	}
}
//==================================== LOGOUT ========================================================
function logout(){ // No, improper user, reset the SPA to default (show main)
	userObj = undefined;
	user = undefined;
  // No REST logout call with this application, had it stayed kinvey, i was using auth tokens
  setSuccessBox("Logout successful.");
	window.location.hash = "";
  // render("");
  // show main
  document.getElementById("main").style.display = "block";
  document.getElementById("container").innerHTML = "";
}
//==================================== LOGIN / LOGIN CLICK ===========================================
function login(){ // render login screen, hide main
  document.getElementById("main").style.display = "none";
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
function loginClick(){ // process login click
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
					// console.log( "logged in", `${userObj.firstName} ${userObj.lastName}`, user, JSON.stringify(userObj) );
          setInfoBox();
					window.location.hash = "#home";
          return;
				}
			}
      setErrorBox("Invalid Credentials. Please try your request with correct credentials.");
      return;
		});
}
//==================================== REGISTER / REGISTER CLICK =====================================
function register(){ // rencer the register screen, hide main
  document.getElementById("main").style.display = "none";
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
function registerClick(){ // process the register click
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
	if( firstName.value.length < 2 ){
		valid = false;
    errorStr += "\n  First Name must be longer than 2 characters.";
		firstName.style.borderColor = "red";
	}else{
		firstName.style.borderColor = "green";
	}
	if ( lastName.value.length < 2 ) {
		valid = false;
		errorStr += "\n  Last Name must be longer than 2 characters.";
		lastName.style.borderColor = "red";
	} else {
		lastName.style.borderColor = "green";
	}
	if ( userName.value.length < 3 ) {
		valid = false;
		errorStr += "\n  User Name must be longer than 3 characters.";
		userName.style.borderColor = "red";
	} else {
		userName.style.borderColor = "green";
	}
	if ( firstPass.value.length < 6 ) {
		valid = false;
		errorStr += "\n  First Password must be longer than 6 characters.";
		firstPass.style.borderColor = "red";
	} else {
		firstPass.style.borderColor = "green";
	}
	if ( secondPass.value.length < 6 ) {
		valid = false;
		errorStr += "\n  Second Password must be longer than 6 characters.";
		secondPass.style.borderColor = "red";
	} else {
		secondPass.style.borderColor = "green";
	}
  if( !valid ){
    // errorStr += " *** Debug: " + firstName.value + ` (len: ${firstName.value.length}) ` + lastName.value + ` (len: ${lastName.value.length}) ` + userName.value + ` (len: ${userName.value.length}) ` + firstPass.value + ` (len: ${firstPass.value.length}) ` + secondPass.value + ` (len: ${secondPass.value.length})`;
    setErrorBox(`Please fix as follows and try again; ${errorStr}`);
    return;
  }
	if ( firstPass.value != secondPass.value ) {
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
					console.log( idx, newUsers[idx], newUsers[idx][1].userName, newUsers[idx][1].password );
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
          })
        ;
        userName.value = "";
        firstPass.value = "";
        firstName.value = "";
        lastName.value = "";
        setSuccessBox("User registration successful.");
        userObj = body;
        window.location.hash = "#home";
        setInfoBox(); // Loading...
			})
    ;
	}
}
//==================================== HOME ==========================================================
function home(){ // get data and generate the home recepie cards or food not found
	if ( !validateUser() ){ return; }
	let url = "https://cookuniproject-default-rtdb.firebaseio.com/recepies.json";
  setInfoBox();
	fetch(url)
    .then(function (response) {
      // console.log(response.status);
      clearInfoBox();
      return response.json();
    })
    .then(function (data) {
      // console.log("RecepieID", data.name); // recepie ID
      if( !data ){ // food not found!
        let src = document.getElementById("fnf").innerHTML;
				let template = Handlebars.compile(src);
				let context = {}; // {{ N/A }}
				let html = template(context);
				render(html);
				return;
      }
      // console.log(JSON.stringify(data));
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
}
//==================================== SHARE / SHARE CLICK ===========================================
function recepieShare(){ // render the share recepie screen
  if ( !validateUser() ){ return; }
  let src = document.getElementById("recepieShare").innerHTML;
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
function shareRecepieClick(){ // process share recepie click
	if ( !validateUser() ){ return; }
  let valid = true;
  let errorStr = "";
	let meal = document.getElementById("defaultRecepieShareMeal");
	let ingredients = document.getElementById("defaultRecepieShareIngredients");
	let preparation = document.getElementById("defaultRecepieShareMethodOfPreparation");
	let foodImgURL = document.getElementById("defaultRecepieShareFoodImageURL");
	let description = document.getElementById("defaultRecepieShareDescription");
	let category = document.getElementById("shareCategory");
	let catImgURL = getCatImgURL(category[category.selectedIndex].value); // string

	let ingredientArr = [];
  if ( meal.value.length < 4 ){
		valid = false;
    errorStr += "<br> Meal Name must be longer than 4 characters.";    
		meal.style.borderColor = "red";
	} else {
		meal.style.borderColor = "green";
	}
  if ( ingredients.value != "" || !ingredients.value.includes(",") ) {
		ingredientArr = ingredients.value.split(", ");
	} else {
		valid = false;
		errorStr += "<br> Ingredients cannot be blank and must have one comma in it (two ingredients).";
	}
	if ( ingredientArr.length < 2 && Array.isArray(ingredientArr) ){
		valid = false;
		errorStr += "<br> Ingredients must be an array of at least 2 entries.";
		ingredients.style.borderColor = "red";
	} else {
		ingredients.style.borderColor = "green";
	}
	if ( preparation.value.length < 10 ){
		valid = false;
		errorStr += "<br> Preparation Method must be longer than 10 characters.";    
    preparation.style.borderColor = "red";
	} else {
		preparation.style.borderColor = "green";
	}
  if( foodImgURL.value ){
		if (!(foodImgURL.value.includes("http://") || foodImgURL.value.includes("https://"))) {
			// only true when neither is true
			valid = false;
			errorStr += "<br> Food Image Url must include http:// or https://";
			foodImgURL.style.borderColor = "red";
		} else {
			foodImgURL.style.borderColor = "green";
		}
	}else{
    valid = false;
    errorStr += "<br> Food Image Url must not be blank.";
    foodImgURL.style.borderColor = "red";
  }
	if ( description.value.length < 10 ){
		valid = false;
    errorStr += "<br> Description must be longer than 10 characters.";    
		description.style.borderColor = "red";
	} else {
		description.style.borderColor = "green";
	}
	if ( category.selectedIndex == 0 ){
		valid = false;
    errorStr += "<br> Category must be selected from the list (not left at default).";    
		category.style.borderColor = "red";
	} else {
		category.style.borderColor = "green";
	}
	if ( !valid ){
		setErrorBox(`Please fix as follows and try again; <br> ${errorStr}`);
		return;
	}
	let body = {
		meal: meal.value,
		ingredients: ingredientArr,
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
		.then(function (response){
			clearInfoBox();
			return response.json();
		})
		.then(function (data){
			// console.log(data.name); // recepie ID
      setSuccessBox("Recipe shared successfully!");
      document.getElementById("defaultRecepieShareMeal").value = "";
      document.getElementById("defaultRecepieShareIngredients").value = "";
      document.getElementById("defaultRecepieShareMethodOfPreparation").value = "";
      document.getElementById("defaultRecepieShareDescription").value = "";
      document.getElementById("defaultRecepieShareFoodImageURL").value = "";
      setInfoBox();
      window.location.hash = "#home";
			return data;
		})
  ;
}
//==================================== EDIT / EDIT CLICK =============================================
function recepieEdit( idStr ){ // render the edit recepie screen
	if ( !validateUser() ){ return; }
  // console.log("Get recepie:", idStr, "and render in recepieEdit template");
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
	setInfoBox();
	fetch(url)
  .then(function (response) {
    if ( response.status < 300 ) {
			clearInfoBox();
		}
    return response.json();
  })
  .then(function (data) {
    // console.log("Recepie Edit Data:", JSON.stringify(data));
    let src = document.getElementById("recepieEdit").innerHTML;
    let template = Handlebars.compile(src);
    data.recepieID = idStr;
    // console.log( JSON.stringify(data.ingredients) );
    if( Array.isArray( data.ingredients ) ){
      data.ingredients = data.ingredients.join(", ");
    }else{
      setErrorBox("Warning, Failed to make a proper ingredients entry, fix to enable saving.");
      data.ingredients = JSON.stringify(data.ingredients);
    }
    let context = data;
    let html = template(context);
    render(html);
    let editButton = document.getElementById("editButton");
		editButton.addEventListener( "click", (e) => { e.preventDefault(); sendEditRecepie(); });
    let category = document.getElementById("editCategory");
    category.selectedIndex = getCatIdx( data.category );
    return data;
  });
}
function sendEditRecepie() { // process edit recepie click
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
  // console.log( "Debug", ingredientArr, Array.isArray( ingredientArr ) );
  let errorStr = "";
  if ( meal.value.length < 4 ){
    valid = false;
    errorStr += "<br> Meal Name must be longer than 4 characters.";
    meal.style.borderColor = "red";
  } else {
    meal.style.borderColor = "green";
  }
  let ingredientArr = [];
  if( ingredients.value.includes(",") ){
    ingredientArr = ingredients.value.split(", ");
  }else{
    valid = false;
    errorStr += "<br> Ingredients must include at least 2 ingredients that are comma separated.";
    ingredients.style.borderColor = "red";
  }
  if ( valid && ingredientArr.length < 2 || !Array.isArray( ingredientArr ) ){
		valid = false;
		errorStr += "<br> Ingredients must be an array of at least 2 entries.";
		ingredients.style.borderColor = "red";
	} else {
		ingredients.style.borderColor = "green";
	}
  if ( preparation.value.length < 10 ){
    valid = false;
    errorStr += "<br> Preparation Method must be longer than 10 characters.";
    preparation.style.borderColor = "red";
  } else {
    preparation.style.borderColor = "green";
  }
  if ( !( foodImgURL.value.includes("http://") || foodImgURL.value.includes("https://") ) ){ // not( false or false) == true
    valid = false;
    errorStr += "<br> Food Image Url must include http:// or https://";
    foodImgURL.style.borderColor = "red";
  } else {
    foodImgURL.style.borderColor = "green";
  }
  if ( description.value.length < 10 ){
    valid = false;
    errorStr += "<br> Description must be longer than 10 characters.";
    description.style.borderColor = "red";
  } else {
    description.style.borderColor = "green";
  }
  if ( category.selectedIndex == 0 ){
    valid = false;
    errorStr += "<br> Category must be selected from the list (not left at default).";
    category.style.borderColor = "red";
  } else {
    category.style.borderColor = "green";
  }
  if ( !valid ){
    setErrorBox(`Please fix as follows and try again; <br> ${errorStr}`);
    return;
  }
	// construct data item for recepie body
	let body = {
		meal: meal.value,
		ingredients: ingredientArr,
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
		method: "PATCH",
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
      document.getElementById("defaultRecepieEditMeal").value = "";
      document.getElementById("defaultRecepieEditIngredients").value = "";
      document.getElementById("defaultRecepieEditMethodOfPreparation").value = "";
      document.getElementById("defaultRecepieEditFoodImageURL").value = "";
      document.getElementById("defaultRecepieEditDescription").value = "";
      window.location.hash = "#home";
      setInfoBox();
			return data;
		});
}
//===================================== INFO / DELETE / LIKE =========================================
function recepieInfo( idStr ){ // load and render a specific recepie with idString
	if ( !validateUser() ){ return; }
	// console.log("Get recepie:", idStr, "and render in recepieEdit template");
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
    // console.log("Recepie Info Data:", JSON.stringify(data)); // recepie ID
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
    // console.log(html);
    render(html);
    return data;
  });
}
function deleteRecepie( idStr ){ // process archive recepie click
	if ( !validateUser() ){ return; }
  let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
  // let body = {};
  let headers = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(body),
  };
  setInfoBox("Sending...");
  fetch( url, headers )
  .then( function ( response ){
    if( response.status == 200 ){
			clearInfoBox();
			setSuccessBox("Your recipe was archived.");
			window.location.hash = "#home";
      setInfoBox();
		}
  });
}
function likeRecepie( idStr ){ // process like recepie click
	if ( !validateUser() ){ return; }
  console.log( `Like Link Clicked for ${idStr}.`);
  let body = {};
	let url = `https://cookuniproject-default-rtdb.firebaseio.com/recepies/${idStr}.json`;
	setInfoBox();
  fetch(url)
    .then(function (response) {
			// console.log( response.status );
			if (response.status == 200) {
				clearInfoBox();
			}
			return response.json();
		})
    .then(function (data) {
      // console.log( JSON.stringify( data ));
      body.likesCounter = Number(data.likesCounter) + 1; // try just the one word of data
      // console.log( "body.likesCounter", body.likesCounter );
      setInfoBox("Sending...");
      let headers = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      fetch(url,headers) // PATCH!
        .then(function (response) {
          // console.log( response.status );
          if (response.status == 200) {
            clearInfoBox();
          }
          return response.json();
        })
        .then(function (data) {
          console.log( JSON.stringify( data ) );
          setSuccessBox("You liked that recipe.");
          window.location.hash = "#home";
          setInfoBox();
        });
    });
}
//====================================== NOTIFICATIONS ===============================================
var successAlert = document.getElementById("successBox");
var errorAlert = document.getElementById("errorBox");
var infoAlert = document.getElementById("loadingBox");
function setSuccessBox( str ){ // setup and show success notification (self nuking)
  successAlert.innerHTML = str;
  successAlert.style.display = "block";
	window.setTimeout( clearSuccessBox, 5000 ); // self nuking frankfurter
  document.getElementById("notifications").focus();
}
function clearSuccessBox(){ // hide success notification on click or timer
   successAlert.style.display = "none";
}
function setInfoBox( str ){ // setup and show info notification
	if (!str) {
		str = "Loading...";
	} // default string unless i need a special loading string
	infoAlert.innerHTML = str;
	infoAlert.style.display = "block";
	window.setTimeout(clearInfoBox, 5000); // self nuking frankfurter
}
function clearInfoBox(){ // hide info notification on click or timer
  infoAlert.style.display = "none";
}
function setErrorBox( str ){ // setup and show error notification
	errorAlert.innerHTML = str;
	errorAlert.style.display = "block";
	document.getElementById("notifications").focus();
}
function clearErrorBox(){ // hide error notification on click (no timer)
  errorAlert.style.display = "none";
}
//====================================== MAKE FOOD ==================================================
function makeFood(){ // Dalek says: REPOPULATE! (with logged in user ID)
  let body1 = {
    category: "Grain Food",
    categoryImageURL: "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
    creator: user,
    description: "This is a great recipe that I found in my Grandma's recipe book. Judging from the weathered look of this recipe card, this was a family favorite.",
    foodImageURL: "https://images.media-allrecipes.com/userphotos/720x405/4948036.jpg",
    ingredients: [
      "1 1/12 cups all purpose flour",
      "3 1/2 teaspoons baking powder",
      "1 teaspoon salt",
      "1 tablespoon white sugar",
      "1 1/4 cups milk",
      "1 egg",
      "3 tablespoons butter; melted"
    ],
    likesCounter: 3,
    meal: "Good Old Fashioned Pancakes",
    prepMethod: "In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth. Heat a lightly oiled griddle or frying pan over medium high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.",
  };
  let url = "https://cookuniproject-default-rtdb.firebaseio.com/recepies.json";
  let headers1 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body1),
  };
  fetch(url, headers1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("body1 call result", data.name); // recepie ID
      return data;
    })
  ;
  let body2 = {
		meal: "Classic Cheesecake",
		ingredients: [
			"4 Block cream cheese 8oz",
			"Sugar",
			"Sour cream",
			"A little flavour",
			"Eggs"
		],
		creator: user,
		prepMethod:
			"Four 8-ounce blocks of full-fat cream cheese are the base of this cheesecake. That’s 2 pounds. Make sure you’re buying the blocks of cream cheese and not cream cheese spread. There’s no diets allowed in cheesecake, so don’t pick up the reduced fat variety! 1 cup. Not that much considering how many mouths you can feed with this dessert. Over-sweetened cheesecake is hardly cheesecake anymore. Using only 1 cup of sugar gives this cheesecake the opportunity to balance tangy and sweet, just as classic cheesecake should taste. 1 cup. I recently tested cheesecake with 1 cup of heavy cream instead, but ended up sticking with my original (which can be found here with blueberry swirls!). I was curious about the heavy cream addition and figured it would yield a softer cheesecake bite. The cheesecake was soft, but lacked the stability and richness I wanted. It was almost too creamy. Sour cream is most definitely the right choice. 1 teaspoon of pure vanilla extract and 2 of lemon juice. The lemon juice brightens up the cheesecake’s overall flavor and vanilla is always a good idea. 3 eggs are the final ingredient. You’ll beat the eggs in last, one at a time, until they are *just* incorporated. Do not overmix the batter once the eggs are added. This will whip air into the cheesecake batter, resulting in cheesecake cracking and deflating.",
		description:
			"And as always, make sure all of the cheesecake batter ingredients are at room temperature so the batter remains smooth, even, and combines quickly. Beating cold ingredients together will result in a chunky over-beaten cheesecake batter, hardly the way we want to start!",
		foodImageURL:
			"https://cdn.sallysbakingaddiction.com/wp-content/uploads/2018/05/classic-cheesecake-recipe-3-600x900.jpg",
		category: "Milk, cheese, eggs and alternatives",
		likesCounter: 0,
		categoryImageURL:
			"https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
	};
  let headers2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body2),
  };
  fetch(url, headers2)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log( "body2 call result", data.name); // recepie ID
      return data;
    })
  ;
  let body3 = {
    meal: "Homemade Tortillas",
    ingredients: [
      "2 cups all-purpose flour",
      "1/2 teaspoon salt",
      "3/4 cup water",
      "3 tablespoons olive oil",
    ],
    creator: user,
    prepMethod:
      "In a large bowl, combine flour and salt. Stir in water and oil. Turn onto a floured surface; knead 10-12 times, adding a little flour or water if needed to achieve a smooth dough. Let rest for 10 minutes. Divide dough into 8 portions. On a lightly floured surface, roll each portion into a 7-in. circle. In a greased cast-iron or other heavy skillet, cook tortillas over medium heat until lightly browned, 1 minute on each side. Keep warm.",
    description:
      "I usually have to double this flour tortilla recipe because we go through them so quickly. The homemade tortillas are so tender and chewy, you’ll never use store-bought again after learning how to make tortillas. —Kristin Van Dyken, West Richland, Washington",
    foodImageURL:
      "https://cdn.thewhoot.com/wp-content/uploads/2018/05/Tortilla-Homemade-Recipe-2.jpg",
    category: "Grain Food",
    likesCounter: 0,
    categoryImageURL:
      "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
  };
  let headers3 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body3),
  };
  fetch(url, headers3)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("body3 call result", data.name); // recepie ID
      return data;
    })
  ;
  window.location.hash = "#home";
}