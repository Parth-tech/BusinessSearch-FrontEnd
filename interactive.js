var autoDetectCheckBox = document.getElementById("autoDetectCheckBox");
var locationTextField = document.getElementById("locationTextField");
var keywordTextField = document.getElementById("keywordTextField");
var keywordTextField = document.getElementById("keywordTextField");


// AUTO-DETECT CheckBox Functionality
autoDetectCheckBox.addEventListener("change", function() {
    locationTextField.value="";
    locationTextField.disabled = autoDetectCheckBox.checked;
});


// SUBMIT Btn Functionality
var submitBtn = document.getElementById("submitBtn");
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const params = new URLSearchParams();
    params.append('keyword', 'value1');
    params.append('param2', 'value2');

    const url = new URL('http://example.com/api/data');
    url.search = params.toString();

    fetch('http://localhost/findbiz')
    .then(response => {
        // Handle the response
    })
    .catch(error => {
        // Handle any errors
    });
});


// CLEAR Btn Functionality
var clearButton = document.getElementById("clearButton");
var form = document.getElementById("searchForm");
clearButton.addEventListener("click", function() {
  form.reset(); // Reset the form fields
});