/* Base URL of the web-service for the current user and access token */
const backend = "https://cawrest.ensimag.fr" // replace by the backend to use
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZG9yY2hlbmMiLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.LwtktJF8T4CxqhmpHW97S9SMdoSHl3LXRy2xybAZ6Go" //replace by yout token : go to BACKEND/getjwsDeleg/caw to obtain it
const wsBase = `${backend}/bmt/dorchenc/` // replace USER by your login used tu obtain TOKEN
const whoami = "/whoami"

/* Shows the identity of the current user */
function setIdentity() {
	//TODO 1
	let x = fetch ( backend + whoami, {method: 'GET', headers: {"x-access-token": token}})
	.then(res => res.json())
	console.log(x)

	let content = document.getElementsByClassName("identity")
	content.item(0).appendChild(document.createTextNode(x))


}

/* Sets the height of <div id="#contents"> to benefit from all the remaining place on the page */
function setContentHeight() {
	let availableHeight = window.innerHeight
	availableHeight -= document.getElementById("contents").offsetTop
	availableHeight -= 2 * document.querySelector('h1').offsetTop
	availableHeight -= 4 * 1
	document.getElementById("contents").style.height = availableHeight + "px"
}


/* Selects a new object type : either "bookmarks" or "tags" */
function selectObjectType(type) {
	// TODO
}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log("listBookmarks called")
	//TODO
}

/* Loads the list of all tags and displays them */
function listTags() {
	console.log("listTags called")
	//TODO
}

/* Adds a new tag */
function addTag() {
	//TODO
}

/* Handles the click on a tag */
function clickTag(tag) {
	//TODO
}

/* Performs the modification of a tag */
function modifyTag() {
	//TODO 8
}

/* Removes a tag */
function removeTag() {
	//TODO 9
}
/* On document loading */
function miseEnPlace() {

	/* Give access token for future ajax requests */
	// Put the name of the current user into <h1>
	setIdentity()
	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight()
	window.addEventListener("resize",setContentHeight)
	// Listen to the clicks on menu items
	// Initialize the object type to "tags"
	selectObjectType("tags")
	// Listen to clicks on the "add tag" button
}
window.addEventListener('load',miseEnPlace,false)
