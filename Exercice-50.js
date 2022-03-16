/* Base URL of the web-service for the current user and access token */
const backend = "https://cawrest.ensimag.fr" // replace by the backend to use
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZG9yY2hlbmMiLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.LwtktJF8T4CxqhmpHW97S9SMdoSHl3LXRy2xybAZ6Go" //replace by yout token : go to BACKEND/getjwsDeleg/caw to obtain it
const wsBase = `${backend}/bmt/dorchenc/` // replace USER by your login used tu obtain TOKEN
const bookmarks = "bookmarks"
const tags = "tags"
const selected = "selected"
const itemTag = "item tag"
const classListeCheckBoxTags = "classListeCheckboxTags"



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

function traiteListBookmark(data){
    data.forEach((element) => {
        const copieNode = document.getElementsByClassName("model bookmark")[0].cloneNode(true)
        copieNode.children[0].textContent = element['title']
        copieNode.children[1].href = element['link']
        copieNode.children[1].textContent = element['link']
        copieNode.children[2].textContent = element['description']
        copieNode.setAttribute("num", element['id'])
        const ul = copieNode.children[3]
        ul.className = "tags";
        element['tags'].forEach(
                (tag) =>
        {
            const li = document.createElement("li");
            const text = document.createTextNode(tag['name']);
            li.appendChild(text);
            ul.appendChild(li);
        }
        )
        copieNode.appendChild(ul)
        copieNode.className = "item bookmark"
        items.appendChild(copieNode)})
}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log("listBookmarks called")
	
	const items = document.getElementById("items")
	if(items !=null){
		removeAll(items)
	}

	fetch(wsBase+bookmarks, {method: 'GET', "headers": {
		"Content-Type": "application/x-www-form-urlencoded",
		"x-access-token": token,
		"Accept": "application/json, text/plain, */*"
	}})
		.then(res => res.json())
		.then(json => {traiteListBookmark(json.data)})
		.then(()=>  {
			console.log("chargement du click")
			document.querySelectorAll(".item.bookmark").forEach(
				book => {book.addEventListener('click', event =>clickBookmark(book), false)}
			)
		})


}

// fonction qui retire tous les enfants d'un noeud
function removeAll(node) {
	while (node.childNodes.length != 0) {
		node.removeChild(node.firstChild)
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

function clickBookmark(bookmark){
	console.log("click bookmark")
	bookmark.className="item selected"
	let oldItem =0
	if(document.querySelector(".item.selected")!=null){
		oldItem=document.querySelector(".item.selected")
	}

	//cas on n'avait pas de bookmark
	if(oldItem===0){
       	const modification = document.createElement("INPUT")
        modification.setAttribute("id", "modification")
        modification.setAttribute("type", "button")
        modification.setAttribute("value", "modify name")
        modification.setAttribute("onclick", "modifyTag")
        modification.onclick = modifyBookmark

        const suppression = document.createElement("INPUT")
        suppression.setAttribute("id", "suppression")
        suppression.setAttribute("type", "button")
        suppression.setAttribute("value", "Remove bookmark")
        suppression.setAttribute("onclick", "removeBookmark")
        suppression.onclick = removeBookmark

        bookmark.appendChild(modification)
        bookmark.appendChild(suppression)
	}
	else if(bookmark !=oldItem){ //cas on click sur un autre bookmark
		oldItem.className="item bookmark"
		oldItem.querySelector('h2').style.display='initial'
		//on recupère dans notre bookmark les attributs déjà crées modification et supression
		bookmark.appendChild(document.getElementById("modification"))
		bookmark.appendChild(document.getElementById("suppression"))
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


function removeBookmark(){
	const url = wsBase + "bookmarks"
    const bookmarkDiv = document.querySelector(".item.selected")
    const id = bookmarkDiv.attributes['num'].nodeValue

    removeData(url, id)
            .then(setTimeout(() => {
                listBookmarks()
            }, 500))//pour afficher les modif après l'ajout et non pas avant. sans cette attente on ne voit pas les modif
            
}

function modifyBookmark(){
	const url = wsBase + "bookmarks"
    const bookmarkDiv = document.querySelector(".item.selected")
    const id = bookmarkDiv.attributes['num'].nodeValue

    const modifiyButton = document.getElementById("modification")
    const parentModify = modifiyButton.parentElement
    modifiyButton.remove()
    const form = createFormBookmark("formModifyBookmark",submitBookmarkModify)
    parentModify.appendChild(form)

    //Partie async
    fetch(wsBase + "tags",
            {
                method: 'GET',
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "x-access-token": token,
                    "Accept": "application/json, text/plain, */*"
                }
            }
    )
            .then(res => res.json())
            .then(
                    json => {
                        const obj = json
                        createCheckboxList(obj.data, form, "classListeCheckboxTags")
                    }
            )
}


const addBookmark = function () {
    console.log("OKKK")
    document.getElementById('addBookmarkButton').remove()
    const items = document.getElementById("items")
    const form = createFormBookmark("formAddBookmark",submitBookmarkADD)
    items.prepend(form)
    
    //Partie async
    fetch(wsBase + "tags",
            {
                method: 'GET',
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "x-access-token": token,
                    "Accept": "application/json, text/plain, */*"
                }
            }
    )
            .then(res => res.json())
            .then(
                    json => {
                        const obj = json                       
                        createCheckboxList(obj.data,form,"classListeCheckboxTags")
                    }
            )
}

const isChecked = function (elemet)
{
  return elemet.checked;
}

const makeTagObjectForBookmark = function (id,name)
{
    return {
        'id':id,
        'name':name
    }
}
const prepareBookmarkQueryObjectArray = function ()
{
    const cases = document.getElementsByClassName("classListeCheckboxTags")
    const res = Array.from(cases).filter(isChecked)//ne garder que les elements checkés
    const tabObjTag = []
    res.forEach(e=>{
        tabObjTag.push(new makeTagObjectForBookmark(e.id,e.value))
    })
    return tabObjTag
}

const makeBookmarkObjcet = function ()
{
    const titleElement = document.getElementById("bookmarkInputTextsID")
    const linkElement = document.getElementById("bookmarkInputURLID")
    const descriptionElement = document.getElementById("bookmarkInputDescriptionID")
    
    let bookmarkID=0
    if(document.getElementsByClassName("item selected")[0]!=undefined)
    {
        bookmarkID = document.getElementsByClassName("item selected")[0].getAttribute("num")
    }
    else
    {
        bookmarkID = 0
    }

    return {
        'id': bookmarkID,
        'title': titleElement.value,
        'link': linkElement.value,
        'description': descriptionElement.value,
        'tags': prepareBookmarkQueryObjectArray()
    }
}
const submitBookmarkADD = function ()
{
    //traitement fetch
    createButtonAddBookmark()
    const objectBookmark = makeBookmarkObjcet()

    fetch(wsBase + "bookmarks",
            {
                method: 'POST', 
                "headers":
                        {
                            "x-access-token": token,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json, text/plain, */*"
                        },
                //"body": `data={${JSON.stringify(objectBookmark)}}`
                body: new URLSearchParams({
                    "data": JSON.stringify(
                            {
                                "title": objectBookmark['title'],
                                "link": objectBookmark['link'],
                                "description": objectBookmark['description'],
                                "tags": objectBookmark['tags']
                            })})
            }
    )
    .then(res => res.json())    
    .then(document.getElementById("formAddBookmark").remove())
    .then(setTimeout(() => { listBookmarks()}, 1000))
}

const submitBookmarkModify = function ()
{
    //traitement fetch
    const objectBookmark = makeBookmarkObjcet()
    const id = objectBookmark['id']
    fetch(wsBase + "bookmarks/"+id,
            {
                method: 'PUT', 
                "headers":
                        {
                            "x-access-token": token,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json, text/plain, */*"
                        },
                //"body": `data={${JSON.stringify(objectBookmark)}}`
                body: new URLSearchParams({
                    "data": JSON.stringify(
                            {
                                //"id":objectBookmark['id'],
                                "title": objectBookmark['title'],
                                "link": objectBookmark['link'],
                                "description": objectBookmark['description'],
                                "tags": objectBookmark['tags']
                            })})
            }
    )
    .then(res => res.json())    
    .then(document.getElementById("formModifyBookmark").remove())
    .then(setTimeout(() => { listBookmarks()}, 1000))
}

function createFormBookmark(id,action) {
    
    const form = document.createElement("form");
    form.setAttribute("id",id)
    // create a submit button
    const soumission = createButton("bookmarkSubmitTextsID", "Submit", action)//{submitBookmarkADD,submitBookmarkModify}

    // Create an input element for Bookmark Name
    const inputText = createTextInput("bookmarkInputTextsID", "Bookmark title here ..")

    // Create an input element for Bookmark URL
    const inputURL = createTextInput("bookmarkInputURLID", "link")

    // Create an input element for Bookmark description
    const inputDescription = createTextInput("bookmarkInputDescriptionID", "bookmark description")
    
    //Manque add tags ici
    
    form.appendChild(soumission)
    form.appendChild(inputText)
    form.appendChild(inputURL)
    form.appendChild(inputDescription)
    
    return form
}



const createTextInput = function (id,placeholder)
{
    // Create an text input element 
    const inputTextElement = document.createElement("input")
    inputTextElement.setAttribute("id",id )
    inputTextElement.setAttribute("type", "text")
    inputTextElement.setAttribute("placeholder", placeholder)

    //inputTextElement.setAttribute("name", "FullName")
    return inputTextElement
}
const createButtonAddBookmark = function ()
{
    const items = document.getElementById("items")
    const addButton = createButton("addBookmarkButton", "Add bookmark",addBookmark)
    addButton.className = "tags"
    items.prepend(addButton)
}

const createButton = function (id,value,fonction)
{
    const myButton = document.createElement("INPUT");
    myButton.setAttribute("id", id)
    myButton.setAttribute("type", "button");
    myButton.setAttribute("value", value);
    myButton.setAttribute("onclick",fonction);
    myButton.onclick = fonction
    return myButton
}

//returns le formulaire mis à jour
const createCheckboxElementWithLabel= function (formulaire,identifiant,valeur,classname)
{
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    checkbox.setAttribute("type","checkbox")
    checkbox.setAttribute("name",identifiant)
    checkbox.setAttribute("id",identifiant)
    checkbox.setAttribute("value",valeur)
    checkbox.className=classname

    label.setAttribute("for",identifiant)
    label.textContent=valeur
    
    formulaire.appendChild(checkbox)
    formulaire.appendChild(label)
    return formulaire
}

//Création liste checkbox pour le formulaire
const createCheckboxList= function (tableauTags,formulaire,className)
{
    tableauTags.forEach(
    (tag) =>
        {
            createCheckboxElementWithLabel(formulaire, tag['id'], tag['name'], className)
        }
    )
    return formulaire
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


