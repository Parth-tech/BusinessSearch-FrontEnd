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

window.onload = function() {
    var businessDetailsDiv = document.getElementById('businessDetailsDiv');
    businessDetailsDiv.style.display = 'none';
};
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

    tableRow.addEventListener('click', function() {
        businessRowClicked(business.id);
      });

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
    // console.log('Printing the starElements: \n', starElements.length, '\n', starElements);
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

    await fetch(url)
    .then(response => {

        response.json()
        .then(detailedBusinessObject => {
            console.log(detailedBusinessObject);

            // detailedBusinessObject = detailedBusinessObject.detailedBusinessData;
            // Giving Business Title Above the tabs
            var businessName = document.createElement('p');
            var businessNameDiv = document.getElementById('businessName');
            businessName.textContent = detailedBusinessObject.detailedBusinessData.name;
            businessName.classList.add('text-center', 'p-2', 'h2');
            businessNameDiv.innerHTML = "";
            businessNameDiv.appendChild(businessName);

            // create a wrapping main column to wrap all rows
            var column = document.createElement('div');
            column.classList.add('col');

            var titles = detailedBusinessObject.detailedBusinessData.categories.map(function(obj) {
                return obj.title;
              });
              
            var joinedTitles = titles.join(' | ');

            let labelArray = [ ['Address', 'Category'], ['Phone', 'Price'], ['Review Count', 'Rating'] ]
            let valueArray = [ 
                [detailedBusinessObject.detailedBusinessData.location.join('\n'), joinedTitles],
                [detailedBusinessObject.detailedBusinessData.display_phone, detailedBusinessObject.detailedBusinessData.price],
                [detailedBusinessObject.detailedBusinessData.review_count, detailedBusinessObject.detailedBusinessData.rating]
            ]

            console.log('Label Array \n', labelArray);
            console.log('Value Array \n', valueArray);
            // call functions to create rows

            for(let i=0; i<labelArray.length; i++){
                // add rows to main col
                // console.log('Logging I value: \n', i);
                column.appendChild(createDetailCardRow(labelArray[i], valueArray[i]));
            }

            // add main col to a container div
            var businessDetailsCard = document.getElementById('businessDetailsCard');
            businessDetailsCard.innerHTML = '';
            businessDetailsCard.appendChild(column);


            var mapHTMLDiv = document.getElementById('mapHTML');
            var reviewsTabDiv = document.getElementById('reviewsTab');
            reviewsTabDiv.innerHTML = detailedBusinessObject.renderedReviews;
            // mapHTMLDiv.innerHTML = detailedBusinessObject.mapHTML;
            // mapHTMLDiv.innerHTML = "";

            var location = detailedBusinessObject.mapHTML.results[0].geometry.location;
            var mapOptions = {
                center: location,
                zoom: 12
            };
            var map = new google.maps.Map(document.getElementById('mapContainer'), mapOptions);
            // map.setMap(document.getElementById('mapHTML'));

            // let temp = document.createElement('p').textContent = "Maps";
            // mapHTMLDiv.appendChild(temp);

            var businessDetailsDiv = document.getElementById('businessDetailsDiv');
            businessDetailsDiv.style.display = 'block';
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

function createDetailCardRow(labelArray, valueArray){
    // console.log('Label Array Func Parameter: \n', labelArray);
    // console.log('Value Array Func Parameter: \n', valueArray);
    var row = document.createElement('div');
    row.classList.add('row');
    
    for(let i=0 ; i<labelArray.length; i++){
        var column = document.createElement('div');
        column.classList.add('col-6');

        // creating label
        var label = document.createElement('p');
        label.textContent = labelArray[i];
        label.classList.add('text-center', 'h5','m-0', 'mt-1');
        column.appendChild(label);
        
        // creating value
        var value = document.createElement('p');
        value.classList.add('m-0', 'mb-1', 'text-center');
        value.textContent = (valueArray[i] == "" || valueArray[i] == null || valueArray[i] == undefined) 
            ? 'Not Available' 
            : valueArray[i];
        column.appendChild(value);

        row.appendChild(column);
    }

    return row;
}

document.addEventListener('DOMContentLoaded', function() {
    var container = document.querySelector('#businessDetailsDiv');
    var tabs = container.querySelectorAll('.nav-tabs a');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            var targetTab = container.querySelector(this.getAttribute('href'));
            var activeTab = container.querySelector('.nav-link.active');
            if (activeTab && activeTab !== this) {
            activeTab.classList.remove('active');
            }
            this.classList.add('active');
            var activeContent = container.querySelector('.tab-pane.fade.show.active');
            if (activeContent) {
            activeContent.classList.remove('show', 'active');
            }
            if(targetTab!=null || targetTab!= undefined){
                targetTab.classList.add('show', 'active');
            }

      });
    });
});