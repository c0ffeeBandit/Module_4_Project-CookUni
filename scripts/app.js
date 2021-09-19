let welcome = document.getElementById("login-welcome");
welcome.innerHTML = "Welcome, Guest!";
welcome.addEventListener("click",welcomeClick);
let shareButton = document.getElementById("share");
let loginButton = document.getElementById("login");
let logoutButton = document.getElementById("logout");
let registerButton = document.getElementById("register");
shareButton.addEventListener("click",shareClick);
loginButton.addEventListener("click",loginClick);
logoutButton.addEventListener("click",logoutClick);
registerButton.addEventListener("click",registerClick);
function welcomeClick() {
	// populate and show user profile screen?
	console.log("welcome clicked");
}
function shareClick(){
  // unhide and focus share screen
  console.log( "share clicked");
}
function loginClick(){
  // unhide and focus login screen
  console.log("login clicked");
}
function logoutClick(){
  // logout user, change welcome
  console.log("logout clicked");
}
function registerClick(){
  // unhide and focus register screen
  console.log("register clicked");
}

// hide food not found
let fnf = document.getElementById("foodNotFound");
fnf.style.display = "none";

// TODO: team-front needs to slide down the distance of the team-back element behind it
// figure this out on the fly or it looks weird ... 
// pull array of 'our-team-main', lookup height of 'team-back' and set it to the slide of 'team-front'
// ug fails ... tehy all need their own class ... lets try it a different way
let teamMain = document.getElementsByClassName("our-team-main");
let average = 0;
for( const div of teamMain ){
	// console.log( div );
  // div.addEventListener("onmouseover", moveDiv());
  // div.addEventListener("onmouseout", fixDiv());
	// let height = div.children[1].getBoundingClientRect().height;
	// average += height;
}
// console.log("-" + (average / teamMain.length).toFixed(0) + "px");
function moveDiv(div){
  // console.log( "moveDiv", div );
  // let newTop = 250;
  // console.log(
	// 	"moveDiv fired",
	// 	div,
	// 	"- " + div.children[0].style.top + " -",
	// 	newTop + "px"
	// );
  // console.log(div.children[0].style);
  // return;
  // var newTop = div.children[0].style.top;
  // newTop = parseInt(newTop);
  // newTop -= 200;
  // div.children[0].style.top = "250px";
  // div.children[0].style.transition = "all 1s ease 1s";
}
function fixDiv(div){
  // console.log( "fixDiv", div );
	// let newTop = 0;
  // console.log(
	// 	"fixDiv fired",
	// 	div,
	// 	"- " + div.children[0].style.top + " -",
	// 	newTop + "px"
	// );
  // console.log( div.children[0].style );
  // return;
  // var newTop = div.children[0].style.top;
	// newTop = parseInt(newTop);
	// newTop += 200;
	// div.children[0].style.top = "";
  // div.children[0].style.transition = "all 1s ease 1s";
  // console.log("fixDiv fired", div, div.children[0].style.top, newTop + "px");
}

// login (basic with user/pass) -> save token
// to use token -> put in API auth header with key "Authorization"