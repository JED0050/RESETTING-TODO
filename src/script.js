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

function removeElementIcon(deleteIcon) {
    if (deleteIcon == null)
        return;

    if (deleteIcon.className == "material-icons") {
        deleteIcon.parentElement.remove();
        saveLocalData();
    }
}

function editElementIcon(editIcon) {
    if (editIcon == null)
        return;

    var textInputText = document.getElementById("todoItemText").value.trim();

    if (textInputText == null || textInputText.length == 0)
        return;
    
    editIcon.previousSibling.previousSibling.textContent = textInputText;
    document.getElementById("todoItemText").value = "";
    saveLocalData();
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

    var inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.addEventListener("change", function() { itemCheckedChange(this);} );
    inputCheckbox.id = elementID;
    
    var labelCheckbox = document.createElement("label");
    labelCheckbox.htmlFor = elementID;
    labelCheckbox.className = "strikethrough";
    labelCheckbox.textContent = textInput;

    var iconEdit = document.createElement("i");
    iconEdit.className = "material-icons";
    iconEdit.textContent = "edit";
    iconEdit.onclick = function() { editElementIcon(this); };

    var iconDelete = document.createElement("i");
    iconDelete.className = "material-icons";
    iconDelete.textContent = "delete";
    iconDelete.onclick = function() { removeElementIcon(this); };

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
    selectedCatagoryID = undefined;
    checkAllItems = false;
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
        } else if(iconItems[i].textContent == "edit") {
            iconItems[i].onclick = function() { editElementIcon(this); };
        }
    }
    
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

    if (checkAllItems) {
        checkAllItems = false;
        var uncheckBtn = document.getElementById("uncheckAllBtn");
        uncheckBtn.textContent = "Uncheck All";
    }
}

function resetTextInputText() {
    document.getElementById("todoItemText").value = "";
}

function importFileData() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = ".txt";

    input.onchange = e => { 

        var file = e.target.files[0];  // getting a hold of the file reference

        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
     
        reader.onload = readerEvent => {  // here we tell the reader what to do when it's done reading...
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

function exportFileData() {
    var fileContent = [];

    var fullCategoryDivs = document.getElementsByClassName("checkboxCategory");
    for (var i=0; i<fullCategoryDivs.length; i++) {
        var fullCategoryDiv = fullCategoryDivs[i];
        var categoryName = fullCategoryDiv.getElementsByClassName("category-item")[0].textContent.trim() + "\n";
        fileContent.push(categoryName);

        var fullItemDivs = fullCategoryDiv.getElementsByClassName("list-item");
        for (var j=0; j<fullItemDivs.length; j++) {
            var itemLabel = fullItemDivs[j].getElementsByClassName("strikethrough")[0];
            var itemName = itemLabel.textContent.trim() + "\n";
            
            var itemCheckbox = fullItemDivs[j].getElementsByTagName("input")[0];
            if (itemCheckbox.checked) {
                itemName = "\t" + itemName;
            }

            fileContent.push(itemName);
        }
        fileContent.push("\n");
    }

    if (fileContent.length == 0)
        return;

    let textFileAsBlob = new Blob(fileContent, { type: 'text/plain'});
    let downloadLink = document.createElement('a');
    downloadLink.download = "RESETTING TO-DO LIST.txt";
    downloadLink.innerHTML = 'Download File';

    if (window.webkitURL != null)
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob );
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function uncheckAllItems() {
    console.log(checkAllItems);

    var listItems = document.getElementsByClassName("list-item");
    for (var i = 0; i < listItems.length; i++) {
        var itemCheckboxElement = listItems[i].childNodes[0];
        itemCheckboxElement.checked = checkAllItems;  // check or uncheck all to-do items
        localStorage.setItem(itemCheckboxElement.id, checkAllItems.toString());
    }
    
    var uncheckBtn = document.getElementById("uncheckAllBtn");
    checkAllItems = !checkAllItems;
    if (checkAllItems)
        uncheckBtn.textContent = "Check All";
    else
        uncheckBtn.textContent = "Uncheck All";
}


// GLOBAL SCOPE DEFINITIONS

var selectedCatagoryID = undefined;
var checkAllItems = false;
