/* Base URL of the web-service for the current user and access token */
const backend = "https://cawrest.ensimag.fr" // replace by the backend to use
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZG9yY2hlbmMiLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.LwtktJF8T4CxqhmpHW97S9SMdoSHl3LXRy2xybAZ6Go" //replace by yout token : go to BACKEND/getjwsDeleg/caw to obtain it
const wsBase = `${backend}/bmt/dorchenc/` // replace USER by your login used tu obtain TOKEN
const bookmarks = "bookmarks"
const tags = "tags"
const selected = "selected"
const itemTag = "item tag"
const classListeCheckBoxTags = "classListeCheckboxTags"

/* TODO : ce qu'il manque :
	- ajouter un nouvel attribut num dans traiteListeTags au noeud copie DONE
	- faire fonctionner POST dans addTag
	- faire fonctionner le childNode à la fin pour faire des clicks sur beaucoup de tags !=
*/

/* Shows the identity of the current user */
function setIdentity() {
	const content = document.getElementsByClassName("identity")
	const urlw = "https://cawrest.ensimag.fr/whoami"
	fetch(urlw, { headers: { "x-access-token": token } })
		.then(res => res.json())
		.then(json => {content[0].textContent=json['data'] })
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
	const menu = document.getElementById("menu")
    const books = menu.children[0]
    const tags = menu.children[1]

    //si le type demandé est le type couramment affiché, rien ne se passe
    if (books.className === "selected" && type === "bookmarks"){
        return;
    }
    if (tags.className === "selected" && type === "tags"){
        return;
    }

	//si le type demandé est bien bookmarks
    if (type === "bookmarks"){
        tags.className = "tags"
        books.className = "selected"
        listBookmarks()

        // enlever la classe selected du <div class="tag"> qui se trouve dans le <div id="add">
        document.getElementById("add").children[0].className = "tag"
    } else if (type === "tags"){//le type demandé est tags
            books.className = "bookmarks"
            tags.className = "selected"
            listTags()
            document.getElementById("add").children[0].className = "selected"
    }
	//sinon on fait rien
    
}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log("listBookmarks called")
	//TODO
}

// fonction qui retire tous les enfants d'un noeud
function removeAll(node) {
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
		
		// DONE ajouter un nouvel attribut num
		copie.setAttribute("num", liste[item].id)
		console.log(copie)

		// ajoute à l'élément d'id items
		document.getElementById("items").appendChild(copie)
	}
}

/* Loads the list of all tags and displays them */
function listTags() {
	console.log("listTags called")

	// on vide l'id items
	removeAll(document.getElementById("items"))

	// on va chercher dans l'url la liste de tous les tags
	fetch(
		wsBase + tags,
		{
			method: 'GET',
			headers: { "x-access-token": token }
		})
		.then(res => res.json())
		.then(json => {
			const obj = json
			obj.data.forEach((element) => {
				const copieNode = document.getElementsByClassName("model tag")[0].cloneNode(true)
				//on ecrit dans h2 qui est le fils [0]
				copieNode.children[0].textContent = element['name']
				copieNode.setAttribute("num", element['id'])
				copieNode.className = "item tag"
				items.appendChild(copieNode)
			});
		})
		.then(() => {
			console.log("chargement click")
			document.querySelectorAll(".item.tag").forEach(tag => {
				tag.addEventListener('click', event => clickTag(tag), false)
			})
			console.log(document.querySelectorAll(".item.tag"))
		})
		.catch(error => {
			console.log("errrr listTags + " + error.toString())
		})
}
//requête client pour ajouter des Tag
function postData(url, txt) {
    return fetch(url, {
        method: 'POST', 
        "headers":
                {
                    "x-access-token": token,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json, text/plain, */*"
                },
        "body": `data={\"name\":\"${txt}\"}`
    })
}

/* Adds a new tag */
function addTag() {
	const contenu = document.getElementsByTagName("input")[0].value
	console.log("addTag")
	// TODO vérifier contenu SEEMS LIKE DONE FOR ME
	if (contenu == "") {
		alert("Aucun contenu n'a été ajouté")
	}
	else {
		// ajout du nouvel élément
		const urltags = wsBase + "tags"
    	console.log("ajout du " + contenu)
    	postData(urltags, contenu)
            .then(setTimeout(() => {
                listTags()}, 500))
				//pour afficher les modif après l'ajout et non pas avant. sans cette attente on ne voit pas les modif
            .catch(error => {
                console.log("errrr postData + " + error.toString())
            })
	}
}

/* Handles the click on a tag */
function clickTag(tag) {
	console.log("clickTag")
	console.log(tag)
	let oldSelectedItemTag = 0;
    if (document.querySelector(".item.selected") != null) {
        oldSelectedItemTag = document.querySelector(".item.selected")
    }
    tag.className = "item selected"
    //cacher h2
    tag.querySelector('h2').style.display = 'none'
    if (oldSelectedItemTag === 0) {
        const inputText = document.createElement("INPUT");
        inputText.setAttribute("id", "line")
        inputText.setAttribute("type", "text");
        inputText.setAttribute("value", tag.querySelector('h2').textContent)
        const modificationButton = document.createElement("INPUT");
        modificationButton.setAttribute("id", "modification")
        modificationButton.setAttribute("type", "button");
        modificationButton.setAttribute("value", "modify name");
        modificationButton.setAttribute("onclick", "modifyTag");
        modificationButton.onclick = modifyTag
        const suppressionnButton = document.createElement("INPUT");
        suppressionnButton.setAttribute("id", "suppression")
        suppressionnButton.setAttribute("type", "button");
        suppressionnButton.setAttribute("value", "Remove tag");
        suppressionnButton.setAttribute("onclick", "removeTag");
        suppressionnButton.onclick = removeTag

        tag.appendChild(inputText)
        tag.appendChild(modificationButton)
        tag.appendChild(suppressionnButton)

    } 
    else if (tag != oldSelectedItemTag) 
    {
        oldSelectedItemTag.className = "item tag"
        oldSelectedItemTag.querySelector('h2').style.display = 'initial'
        console.log(tag.querySelector('h2').textContent)
        tag.appendChild(document.getElementById("line"))
        document.getElementById("line").value = tag.querySelector('h2').textContent
        tag.appendChild(document.getElementById("modification"))
        tag.appendChild(document.getElementById("suppression"))
    }
}
function putData(url, txt) {
    // Default options are marked with * 
    return fetch(url, {
        method: 'PUT',
        "headers":
                {
                    "x-access-token": token,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json, text/plain, */*"
                },
        "body": `data={"name":"${txt}"}`
                //body: new URLSearchParam({"data": JSON.stringify({"name": input.value))
    })
}

/* Performs the modification of a tag */
function modifyTag() {
	const tagDiv = document.querySelector(".item.selected")
    const id = tagDiv.attributes['num'].nodeValue
    const url = wsBase + "tags/" + id

    const line = document.getElementById("line")
    const txt = line.value

    putData(url, txt)
            .then(setTimeout(() => {
                listTags()
            }, 500))//pour afficher les modif après l'ajout et non pas avant. sans cette attente on ne voit pas les modif
            .catch(error => {
                console.log("error modifyTag + " + error.toString())
            })
}

function removeData(url, id) {
    // Default options are marked with *
    return fetch(url + "/" + id, {
        method: 'DELETE',
        "headers":
                {
                    "x-access-token": token,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json, text/plain, */*"
                },
        //"body": `data={\"name\":\"${id}\"}`
    })
}

/* Removes a tag */
function removeTag() {
	const url = wsBase + "tags/"
    const tagDiv = document.querySelector(".item.selected")
    const id = tagDiv.attributes['num'].nodeValue

    removeData(url, id)
            .then(setTimeout(() => {
                listTags()
            }, 500))//pour afficher les modif après l'ajout et non pas avant. sans cette attente on ne voit pas les modif
            .catch(error => {
                console.log("error removeTag + " + error.toString())
            })
}
/* On document loading */
function miseEnPlace() {

	/* Give access token for future ajax requests */
	// Put the name of the current user into <h1>
	setIdentity()

	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight()
	window.addEventListener("resize", setContentHeight)
	// Listen to the clicks on menu items
	const menu = document.getElementById("menu")
    const books = menu.children[0]
    const tags = menu.children[1]
    books.addEventListener('click', function () {
        selectObjectType("bookmarks")
    })
    tags.addEventListener('click', function () {
        selectObjectType("tags")
    })
	// Initialize the object type to "tags"
	selectObjectType("tags")
	// Listen to clicks on the "add tag" button
	document.getElementById('addTag').addEventListener('click', addTag)
}

window.addEventListener('load', miseEnPlace, false)

window.onload = function () {
	// click sur new tag
	document.getElementById("addTag").addEventListener("click", addTag)

	// click sur un item
	const items = document.querySelectorAll("#items div")
	console.log(document.querySelector("#items"))
	console.log(document.querySelector("#items").childElementCount)
	console.log(document.querySelector("#items").childNodes)
	console.log(document.querySelector("#items > *.item"))
	console.log(document.querySelector("#items > div"))



	console.log(items)

	for (let item in items.values()){
		console.log("aaa")
		console.log(item)
		item.addEventListener("click", () => clickTag(item))
	}
}


