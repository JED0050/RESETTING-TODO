function removeElement(labelElement) {
    if (labelElement == null)
        return;

    if (labelElement.className == "list-item" && document.getElementById("removeItemButton").checked) {
        labelElement.remove();
        saveLocalData();
    }
    else if (labelElement.className == "checkboxCategory" && document.getElementById("removeCategoryButton").checked) {
        labelElement.remove();
        saveLocalData();
    }
}

function addTodoItem() {
    var parentElement = document.getElementById(selectedCatagoryID);
    if(parentElement == null)
        return;

    var textInput = document.getElementById("todoItemText").value;

    if (textInput == null || textInput.replaceAll(/\s/g,'').length == 0)
        return;

    resetTextInputText();

    var elementID = parentElement.getAttribute("name").toLocaleLowerCase() + "-task-" + textInput;
    
    var containerElement = document.createElement("div");
    containerElement.className = "list-item";
    containerElement.onclick = function() { removeElement(this); };
    //containerElement.setAttribute("onlick", "removeElement(this)");

    var inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.addEventListener("change", function() { itemCheckedChange(this);} );
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
    uncheckRemoveButtons();
}

function addCategory() {
    var parentElement = document.getElementById("checkboxPanel");
    if (parentElement == null)
        return;

    var textInput = document.getElementById("todoItemText").value;
    if (textInput == null || textInput.replaceAll(/\s/g,'').length == 0)
        return;

    resetTextInputText();

    textInput = firstCharUpperCase(textInput);

    var checkboxCategoryElement = document.createElement("div");
    checkboxCategoryElement.className = "checkboxCategory";
    checkboxCategoryElement.id = "classDiv" + textInput;
    checkboxCategoryElement.setAttribute("name", textInput);
    checkboxCategoryElement.onclick = function() { setSelectedCatagoryID(this); };

    var nameCategoryElement = document.createElement("p");
    nameCategoryElement.className = "category-item";
    nameCategoryElement.onclick = function() { removeElement(nameCategoryElement); };
    nameCategoryElement.innerHTML = textInput;

    checkboxCategoryElement.appendChild(nameCategoryElement);

    parentElement.appendChild(checkboxCategoryElement);

    saveLocalData();
    uncheckRemoveButtons();
}

function firstCharUpperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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
    var value = document.getElementById("checkboxPanel").innerHTML;
    localStorage.setItem("categories-items", value);
}

function loadLocalData() {
    let selectedCatagoryID = undefined;
    //return;
    document.getElementById("checkboxPanel").innerHTML = localStorage.getItem("categories-items");

    // remove item function + add event listener to checked
    var listItems = document.getElementsByClassName("list-item");
    for (var i = 0; i < listItems.length; i++) {
        var listItem = listItems[i];
        listItem.onclick = function() { removeElement(this); };
        listItem.childNodes[0].addEventListener("change", function() { itemCheckedChange(this);} );

        if(localStorage.getItem(listItem.childNodes[0].id) == "true") {
            listItem.childNodes[0].checked = true;
        }
    }

    console.log(document.getElementById("checkboxPanel").innerHTML);

    // remove category function
    var listCategory = document.getElementsByClassName("checkboxCategory");
    for (var i=0; i < listCategory.length; i++) {
        listCategory[i].onclick = function() { setSelectedCatagoryID(this); removeElement(this); };
    }
}

function uncheckRemoveButtons() {
    document.getElementById("removeItemButton").checked = false;
    document.getElementById("removeCategoryButton").checked = false;
}

function itemCheckedChange(item) {
    localStorage.setItem(item.id, item.checked.toString());
    //console.log("key: " + item.id + " value: " + item.checked.toString());
}

function resetTextInputText() {
    document.getElementById("todoItemText").value = "";
}