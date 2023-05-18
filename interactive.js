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
        const table = document.createElement('table');
        table.classList.add('table', 'table-light', 'table-striped', 'table-bordered' ,'rounded', 'table-hover', 'text-center');

        const thead = document.createElement('thead');
        thead.id = 'table-header';

        const tbody = document.createElement('tbody');
        tbody.id = 'table-body';

        table.appendChild(thead);
        table.appendChild(tbody);

        createTableHeaders(thead);

        console.log('Request made with the following params');
        console.log(params);
        console.log('------ end of params ------');
        console.log('printing resposne');

        response.json()
        .then(businessObject => {
            for (let i = 0; i < businessObject.length; i++) {
                const business = businessObject[i];
                const tableRow = createTableRow(i, business);
                tbody.appendChild(tableRow);
            }
            console.log(businessObject);

            let tableDiv = document.getElementById('tableDiv');
            tableDiv.appendChild(table);
            // Process the JSON data
        })
        .catch(error => {
            console.log('Error while parsing JSON');
            console.error(error);
            // Handle JSON parsing error
        });
        // Handle the response
    })
    .catch(error => {
        console.log('Errow on submitting the form');
        console.log(error);
        // Handle any errors
    });
});

function createTableHeaders(tableHeader) {
    // const tableHeader = document.getElementById('table-header');
    const headerRow = document.createElement('tr');

    // Column names
    const columnNames = ['Sr. No.', 'Image', 'Name', 'Rating', 'No. of Reviews', 'Distance (miles)'];

    // Create th elements for each column name
    columnNames.forEach(columnName => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = columnName;
      th.style.fontWeight = 'bold';
      headerRow.appendChild(th);
    });

    // Append the header row to the table header
    tableHeader.appendChild(headerRow);
}

function createTableRow(index, business) {
    const tableRow = document.createElement('tr');
    tableRow.style.cursor = 'pointer';
    // tableRow.classList.add('cursor-pointer');

    tableRow.onclick = businessRowClicked(business.id);

    // Sr. No. column
    const srNoColumn = document.createElement('td');
    srNoColumn.textContent = index + 1;
    srNoColumn.style.fontWeight = 'bold';
    tableRow.appendChild(srNoColumn);

    // Image column
    const imageColumn = document.createElement('td');
    const image = document.createElement('img');
    if (business.image_url) {
        image.src = business.image_url;
    } else {
        image.src = './assets/no-image-placeholder.png';
        image.alt = 'No Business Image Present';
    }
    image.style.objectFit = 'cover';
    image.height = 120; 
    image.width = 100;
    image.classList.add('rounded-1')
    imageColumn.appendChild(image);
    tableRow.appendChild(imageColumn);

    // Name column
    const nameColumn = document.createElement('td');
    nameColumn.textContent = business.name;
    tableRow.appendChild(nameColumn);

    // Rating column
    const ratingColumn = document.createElement('td');
    // ratingColumn.textContent = business.rating;
    const starElements = [];
    for (let i = 0; i < 5; i++) {
        
        let star = document.createElement('i');
        if (i < Math.floor(business.rating)) {
            star.classList.add('fas' , 'fa-star', 'custom-filled-star');
        } else if (i === Math.floor(business.rating) && business.rating % 1 !== 0) {
            // star.classList.add('fas' , 'fa-duotone', 'fa-star-half', 'custom-half-star');
            star.classList.add('fas' , 'fa-star', 'custom-half-star');
        } else {
            star.classList.add( 'fas', 'fa-star', 'custom-empty-star');
        }
        starElements.push(star);
    }
    // Append the star elements to the container
    // const ratingStarsContainer = document.getElementById('ratingStars');
    console.log('Printing the starElements: \n', starElements.length, '\n', starElements);
    starElements.forEach(star => {
        ratingColumn.appendChild(star);
    });
    tableRow.appendChild(ratingColumn);

    // No. of Reviews column
    const reviewsColumn = document.createElement('td');
    reviewsColumn.textContent = business.review_count;
    tableRow.appendChild(reviewsColumn);

    // Distance column
    const distanceColumn = document.createElement('td');
    distanceColumn.textContent = business.distance+" ";
    // if(business.distance<=1.5){
    //     const walkingIcon = document.createElement('i');
    //     walkingIcon.classList.add('fas', 'fa-walking');
    //     distanceColumn.appendChild(walkingIcon);
    // }
    // else if(business.distance <= 2.5){
    //     const bikingIcon = document.createElement('i');
    //     bikingIcon.classList.add('fas', 'fa-bicycle');
    //     distanceColumn.appendChild(bikingIcon);
    // }
    // else{
    //     const drivingIcon = document.createElement('i');
    //     drivingIcon.classList.add('fas', 'fa-car');
    //     distanceColumn.appendChild(drivingIcon);
    // }
    tableRow.appendChild(distanceColumn);

    return tableRow;
}


// CLEAR Btn Functionality
var clearButton = document.getElementById("clearButton");
var form = document.getElementById("searchForm");
clearButton.addEventListener("click", function() {
  form.reset(); // Reset the form fields
});


async function businessRowClicked(businessId)  {
    const params = new URLSearchParams();
    params.append('id', businessId);

    const url = new URL('http://localhost:3000/getbizdetails');
    url.search = params.toString();

    fetch(url)
    .then(response => {
        

        response.json()
        .then(detailedBusinessObject => {

            console.log(detailedBusinessObject);
        })
        .catch(error => {
            console.log('Error while parsing JSON Response of Detailed Business Card');
            console.error(error);
            // Handle JSON parsing error
        });
        // Handle the response
    })
    .catch(error => {
        console.log('Error on fetching Details of Business with ID: ', businessId);
        console.log(error);
        // Handle any errors
    });
}