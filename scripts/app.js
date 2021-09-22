let hashRoute = undefined; // explicit paranioa
let userObj = undefined;
let user = undefined;
init();

function init() {
	// let welcome = document.getElementById("login-welcome");
	// welcome.innerHTML = "Welcome, Guest!";
	// let logoutButton = document.getElementById("logout");
	// logoutButton.addEventListener("click", logout);
}
function render(html) {
  document.getElementById("container").innerHTML = html;
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
function logout() {
  userObj = undefined;
  user = undefined;
  window.location.hash = "";
}
function moveDiv(div) {
}
function fixDiv(div) {
}
