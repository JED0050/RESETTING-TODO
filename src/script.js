function removeElement(labelElement) {
    if (document.getElementById("removeItemButton").checked != true)
        return;
    
    if (labelElement == null)
        return;

    //labelElement.innerHTML = '';
    labelElement.remove();
    
    saveLocalData();
}

function addTodoItem() {
    var parentElement = document.getElementById(selectedCatagoryID);

    if(parentElement != null) {
        var textInput = document.getElementById("todoItemText").value;

        if (textInput == null || textInput.replaceAll(/\s/g,'').length == 0)
            return;

        var elementID = "tasl-" + textInput;
        
        var containerElement = document.createElement("div");
        containerElement.className = "list-item";
        containerElement.onclick = function() { removeElement(this); };
        //containerElement.setAttribute("onlick", "removeElement(this)");

        var inputCheckbox = document.createElement("input");
        inputCheckbox.type = "checkbox";
        inputCheckbox.id = elementID;
        
        var labelCheckbox = document.createElement("label");
        labelCheckbox.htmlFor = elementID;
        labelCheckbox.className = "strikethrough";
        labelCheckbox.textContent = " " + textInput + " ";

        containerElement.appendChild(inputCheckbox);
        containerElement.appendChild(labelCheckbox);
        containerElement.appendChild(document.createElement("br"));
        
        parentElement.appendChild(containerElement);

        saveLocalData();
        //console.log(localStorage.getItem("categories-items"));
    }
}

function addCategory() {
    var parentElement = document.getElementById("categories");
    if (parentElement == null)
        return;

    var textInput = document.getElementById("todoItemText").value;
    if (textInput == null || textInput.replaceAll(/\s/g,'').length == 0)
        return;
    textInput = firstCharUpperCase(textInput);

    var checkboxCategoryElement = document.createElement("div");
    checkboxCategoryElement.className = "checkboxCategory";
    checkboxCategoryElement.id = "classDiv" + textInput;
    checkboxCategoryElement.name = textInput;
    checkboxCategoryElement.onclick = function() { setSelectedCatagoryID(this); };

    var nameCategoryElement = document.createElement("p");
    nameCategoryElement.className = "category-item";
    nameCategoryElement.onclick = function() { removeElement(nameCategoryElement); };
    nameCategoryElement.innerHTML = textInput;

    checkboxCategoryElement.appendChild(nameCategoryElement);

    parentElement.appendChild(checkboxCategoryElement);

    saveLocalData();
}

function firstCharUpperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function setSelectedCatagoryID(categoryElement) {
    selectedCatagoryID = categoryElement.id;

    var categoryElements = document.getElementsByClassName("checkboxCategory");
    for (var i=0, max=categoryElements.length; i < max; i++) {
        var paragraphElement = categoryElements[i].getElementsByTagName("p")[0];
        paragraphElement.style.textDecoration = "none";
    }

    categoryElement.getElementsByTagName("p")[0].style.textDecoration = "underline";
}

function saveLocalData() {
    var value = document.getElementById("categories").innerHTML;
    localStorage.setItem("categories-items", value);
}

function loadLocalData() {
    let selectedCatagoryID = undefined;
    //return;
    document.getElementById("categories").innerHTML = localStorage.getItem("categories-items");

    var listItems = document.getElementsByClassName("list-item");
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].onclick = function() { removeElement(this); };
    }
}
