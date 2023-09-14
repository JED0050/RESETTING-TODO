function removeElement(labelElement) {
    if (document.getElementById("removeItemButton").checked != true)
        return;
    
    if (labelElement == null)
        return;

    labelElement.remove();
}

function addTodoItem() {
    var parentElement = document.getElementById(selectedCatagoryID);

    if(parentElement != null) {
        var textInput = document.getElementById("todoItemText").value;

        if (textInput == null || textInput.replaceAll(/\s/g,'').length == 0)
            return;

        var elementID = "test-text-1";
        
        var containerElement = document.createElement("div");
        containerElement.onclick = function() { removeElement(this); };

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
    nameCategoryElement.innerHTML = textInput;

    checkboxCategoryElement.appendChild(nameCategoryElement);

    parentElement.appendChild(checkboxCategoryElement);
}

function firstCharUpperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function setSelectedCatagoryID(categoryElement) {
    selectedCatagoryID = categoryElement.id;

    var all = document.getElementsByClassName("checkboxCategory");

    for (var i=0, max=all.length; i < max; i++) {
        var paragraphElement = all[i].getElementsByTagName("p")[0];
        paragraphElement.style.textDecoration = "none";
    }

    categoryElement.getElementsByTagName("p")[0].style.textDecoration = "underline";
}

let selectedCatagoryID = undefined;
