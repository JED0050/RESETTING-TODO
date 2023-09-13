function removeElement(labelElement) {
    labelElement.remove();
    
    var inputElement = document.getElementById(labelElement.htmlFor);
    inputElement.remove();
}

function addCheckboxElement() {
    var parentElement = document.getElementsByName("Mage")[0];

    if(parentElement != null) {
            var textInput = document.getElementById("todoItemText").value;

            if (textInput == null || textInput.replaceAll(/\s/g,'').length == 0) {
                return;
            }

            var inputCheckbox = document.createElement("input");
            inputCheckbox.type = 'checkbox';
            inputCheckbox.id = 'test-text-1';
            
            var labelCheckbox = document.createElement("label");
            labelCheckbox.htmlFor = "test-text-1";
            labelCheckbox.className = "strikethrough";
            labelCheckbox.onclick = function() { removeElement(this); };
            labelCheckbox.textContent = " " + textInput + " ";
            labelCheckbox.appendChild(document.createElement("br"));
            
            parentElement.appendChild(inputCheckbox);
            parentElement.appendChild(labelCheckbox);
    }
}
