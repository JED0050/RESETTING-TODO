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

function removeElementIcon(labelElement) {
    if (labelElement == null)
        return;

    if (labelElement.className == "material-icons") {
        labelElement.parentElement.remove();
        saveLocalData();
    }
}

function addTodoItem(itemName = null) {

    var parentElement = document.getElementById(selectedCatagoryID);

    if(parentElement == null)
        return;

    var textInput;
    if (itemName == null) {
        textInput = document.getElementById("todoItemText").value;
    } else {
        textInput = itemName;
    }

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

    //<i class="material-icons">edit</i><i class="material-icons">delete</i>
    var iconEdit = document.createElement("i");
    iconEdit.className = "material-icons";
    iconEdit.textContent = "edit";

    var iconDelete = document.createElement("i");
    iconDelete.className = "material-icons";
    iconDelete.textContent = "delete";

    containerElement.appendChild(inputCheckbox);
    containerElement.appendChild(labelCheckbox);
    containerElement.appendChild(iconDelete);
    containerElement.appendChild(iconEdit);
    containerElement.appendChild(document.createElement("br"));
    
    parentElement.appendChild(containerElement);

    saveLocalData();
    uncheckRemoveButtons();

    return containerElement;
}

function addCategory(categoryName = null) {
    var parentElement = document.getElementById("checkboxPanel");
    if (parentElement == null)
        return;

    var textInput;
    if(categoryName == null) {
        textInput = document.getElementById("todoItemText").value;
    } else {
        textInput = categoryName;
    }
    
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

    setSelectedCatagoryID(checkboxCategoryElement);

    return checkboxCategoryElement;
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
    
    // remove item icons in list item
    var iconItems = document.getElementsByClassName("material-icons");
    for (var i = 0; i < iconItems.length; i++) {
        if(iconItems[i].textContent == "delete") {
            iconItems[i].onclick = function() { removeElementIcon(this); };
        }
    }
    
    // remove category function
    var listCategory = document.getElementsByClassName("checkboxCategory");
    for (var i=0; i < listCategory.length; i++) {
        listCategory[i].onclick = function() { setSelectedCatagoryID(this); removeElement(this); };
    }
    
    //console.log(document.getElementById("checkboxPanel").innerHTML);
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

function loadFileData() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = ".txt";

    input.onchange = e => { 

        // getting a hold of the file reference
        var file = e.target.files[0]; 
     
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
     
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            content = content.split("\n");
            var heading = true

            for(var i = 0; i < content.length; i++)
            {
                var line = content[i].trimRight();
                if(line.trim().length == 0) {
                    heading = true;
                    continue;
                } else if(line.startsWith("---")) { // end of file
                    break;
                } else if(line.startsWith("//")) { // comment
                    continue;
                }
                else if (heading || line[line.length - 1] == ":") {
                    heading = false;
                    addCategory(line);
                } else {
                    var listItem = addTodoItem(line);
                    var checkboxItem = listItem.getElementsByTagName("input")[0];
                    if (line.startsWith(" ") || line.startsWith("\t")) {
                        checkboxItem.checked = true;
                        itemCheckedChange(checkboxItem);
                    }
                }
            }
        }
    }

    input.click();
}