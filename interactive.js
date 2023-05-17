var autoDetectCheckBox = document.getElementById("autoDetectCheckBox");
var locationTextField = document.getElementById("locationTextField");
var keywordTextField = document.getElementById("keywordTextField");
var distanceTextField = document.getElementById("distanceTextField");
var categorySelectField = document.getElementById("categorySelectField");


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
    params.append('keyword', keywordTextField.value);
    params.append('distance', distanceTextField.value);
    params.append('category', categorySelectField.value);
    params.append('location', locationTextField.value);
    params.append('autodetect', autoDetectCheckBox.checked);


    const url = new URL('http://localhost:3000/findbiz');
    url.search = params.toString();

    fetch(url)
    .then(response => {
        console.log('Request made with the following params');
        console.log(params);
        console.log('------ end of params ------');
        console.log('printing resposne');
        console.log(response.json());
        // Handle the response
    })
    .catch(error => {
        console.log('Errow on submitting the form');
        console.log(error);
        // Handle any errors
    });
});


// CLEAR Btn Functionality
var clearButton = document.getElementById("clearButton");
var form = document.getElementById("searchForm");
clearButton.addEventListener("click", function() {
  form.reset(); // Reset the form fields
});