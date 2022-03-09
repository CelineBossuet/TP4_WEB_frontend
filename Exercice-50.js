/* Base URL of the web-service for the current user and access token */
const backend = "https://cawrest.ensimag.fr" // replace by the backend to use
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZG9yY2hlbmMiLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.LwtktJF8T4CxqhmpHW97S9SMdoSHl3LXRy2xybAZ6Go" //replace by yout token : go to BACKEND/getjwsDeleg/caw to obtain it
const wsBase = `${backend}/bmt/dorchenc` // replace USER by your login used tu obtain TOKEN
const whoami = "/whoami"
const bookmarks = "/bookmarks"
const tags = "/tags"

/* Shows the identity of the current user */
function setIdentity() {
	//TODO 1
	const content = document.getElementsByClassName("identity")


	fetch(backend + whoami, { method: 'GET', headers: { "x-access-token": token } })
		.then(res => res.json())
		.then(json => content.item(0).appendChild(document.createTextNode(json.data)))
}

/* Sets the height of <div id="#contents"> to benefit from all the remaining place on the page */
function setContentHeight() {
	let availableHeight = window.innerHeight
	availableHeight -= document.getElementById("contents").offsetTop
	availableHeight -= 2 * document.querySelector('h1').offsetTop
	availableHeight -= 4 * 1
	document.getElementById("contents").style.height = availableHeight + "px"
}

// fonction qui enlève le selected de l'ancien (si il existe) et le met au nouveau
function changeSelected(ancienSelected, nouveauSelected) {
	const menu = document.getElementById("menu")
	try {
		menu.getElementsByClassName(ancienSelected + " selected")[0].className = ancienSelected
	}
	catch {/* dans ce cas là on ne fait rien car rien n'a été sélectionné */ }
	menu.getElementsByClassName(nouveauSelected)[0].className = nouveauSelected + " selected"
}

/* Selects a new object type : either "bookmarks" or "tags" */
function selectObjectType(type) {
	const menu = document.getElementById("menu")

	// on trouve quel est le type selected et on enlève le selected pour le mettre sur l'autre type
	const type_selected = null;
	if (menu.getElementsByClassName("tags selected").length != 0) {
		type_selected = "tags"
	}
	else if (menu.getElementsByClassName("bookmarks selected").length != 0) {
		type_selected = "bookmarks"
	}

	if (type != type_selected) {
		// on fait une action que si le type sélectionné n'est pas le bon
		if (type == "bookmarks") {
			changeSelected("tags", "bookmarks")
			listBookmarks()
			document.getElementById("add").getElementsByClassName("tag selected")[0].className = "tag"
		}
		else if (type == "tags") {
			changeSelected("bookmarks", "tags")
			listTags()
			document.getElementById("add").getElementsByClassName("tag")[0].className += " selected"
		}
	}
	// sinon on ne fait rien
}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log("listBookmarks called")
	//TODO
}

// fonction qui retire tous les enfants d'un noeud
function removeAll(node){
	while (node.childNodes.length != 0) {
		node.removeChild(node.firstChild)
	}
}

/* fonction qui permet de traiter la liste de tags obtenue dans l'objet json d'un fetch */
function traiteListeTags(liste) {
	for (item in liste) {
		// copie le model
		let copie = document.getElementById("models").getElementsByClassName("model tag")[0].cloneNode(true)

		// retire l'ancien nom et ajoute le nouveau
		removeAll(copie.getElementsByTagName("h2")[0])
		copie.getElementsByTagName("h2")[0].appendChild(document.createTextNode(liste[item].name))

		// change la classe de copie
		copie.className = "item tag"

		// TODO ajouter un nouvel attribut num
		//copie.setAttribute(num, liste[item].id)

		// ajoute à l'élément d'id items
		console.log(document.getElementById("items"))
		document.getElementById("items").appendChild(copie)
		console.log(copie)

	}
}

/* Loads the list of all tags and displays them */
function listTags() {
	console.log("listTags called")

	// TODO on vide l'id items
	removeAll(document.getElementById("items"))

	// on va chercher dans l'url la liste de tous les tags
	console.log(wsBase + tags)
	fetch(wsBase + tags, { method: 'GET', headers: { "x-access-token": token } })
		.then(res => res.json())
		.then(json => { console.log(json.data); traiteListeTags(json.data) })
}

/* Adds a new tag */
function addTag() {
	const contenu = document.getElementsByTagName("input")[0].value
	// TODO vérifier contenu
	// assert(contenu != "")

	// ajout du nouvel élément
	const body = new URLSearchParams()
	body.append("data", contenu)
	fetch(
		wsBase + tags,
		{
			method: 'POST',
			headers: { "x-access-token": token },
			body,
		})

	// affichage du nouvel élément + supression dans la barre de recherche
	document.getElementsByTagName("input")[0].value = ""
	listTags()
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

	fetch("https://cawrest.ensimag.fr/bmt/dorchenc/reinit", { method: 'POST', headers: { "x-access-token": token } })
	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight()
	window.addEventListener("resize", setContentHeight)
	// Listen to the clicks on menu items
	// Initialize the object type to "tags"
	selectObjectType("tags")
	// Listen to clicks on the "add tag" button
}

window.addEventListener('load', miseEnPlace, false)

window.onload = function () {
	console.log(document.getElementById("addTag"))
	document.getElementById("addTag").addEventListener("click", addTag, false)
}


