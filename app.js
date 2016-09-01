'use strict';

var imageDirStr = [ 'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg',
                    'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg',
                    'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png',
                    'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];

//indexArray will hold numbers from 0 to N-1 where N is the size of the imageDirStr Array
//it will hold the indexes related to a given image that corresponds to objects with that image
var indexArray = [];

//will hold just the name of the image after split is run on the imageDirStr
var imageNameArray = [];

//will hold the indexes pertaining to given 3 images to be rendered to the page
var indexObjectCreate = [];

//will hold all instantiated objects after iterating over imageDirStr
var storeObjectArray = [];

//will store all chartObjects that are initiated
var chartObjectArray = [];

//will hold all corresponding statistics relavent to the page and the index of each array corresponds to the corresponding image/object in imageDirStr or storeObjectArray
var statDictionary = {
  clickStats : Array(imageDirStr.length).fill(0),
  viewStats : Array(imageDirStr.length).fill(0),
  clicksPerViewStatsArray : Array(imageDirStr.length).fill(0),
};

//keeps track of total clicks on the image
var totalClicks = 0;

function ImageObject(name,path) {
  this.name = name;
  this.path = path;
  this.totalClicks = 0;
  this.totalViews = 0;
  storeObjectArray.push(this);
};

function initializeObjectsIndex() {
  //create all objects from imageDirStr array and create an array with index numbers for each image
  var imageName;
  var pathFolder = 'assets/';
  for (var i = 0; i < imageDirStr.length; i++) {
    imageName = imageDirStr[i].split('.')[0];
    new ImageObject(imageName,pathFolder + imageDirStr[i]);
    indexArray.push(i);
    imageNameArray.push(imageName);
  };
}

function randomNumberGen(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function randomNumbArray(max, min, arraySize) {
  //will generate an array of size arraySize with non-repeating random numbers
  //each number corresponds to a given index for a given object because the storeObjectArray and imageDirStr arrays don't change
  //when number is grabbed from indexArray, the value is replaced with -1 to indicate to the algorithm to look for another index
  var j = 0;
  var indexListValues = [];
  var randomIndex = randomNumberGen(max, min);
  while (j < arraySize) {
    if (indexArray[randomIndex] === -1) {
      randomIndex = randomNumberGen(max, min);
    } else {
      indexListValues[j] = randomIndex;
      indexArray[randomIndex] = -1;
      j += 1;
    }
  }
  return indexListValues;
};

function calculateViews(objectIndexedArrayValues) {
  //pass array with index numbers for objects that were selected for viewing on page
  //and increment their views and calculate the clicks/view of a given object
  for (var i = 0; i < objectIndexedArrayValues.length; i++) {
    storeObjectArray[objectIndexedArrayValues[i]].totalViews += 1;
    statDictionary.viewStats[objectIndexedArrayValues[i]] += 1;
    if (statDictionary.viewStats[objectIndexedArrayValues[i]] === 0) {
      statDictionary.clicksPerViewStatsArray[objectIndexedArrayValues[i]] = 0;
    } else {
      statDictionary.clicksPerViewStatsArray[objectIndexedArrayValues[i]] = statDictionary.clickStats[objectIndexedArrayValues[i]] / statDictionary.viewStats[objectIndexedArrayValues[i]];
    }
  };
};

function calculateClicks(index) {
  storeObjectArray[index].totalClicks += 1;
  statDictionary.clickStats[index] += 1;
  statDictionary.clicksPerViewStatsArray[index] = statDictionary.clickStats[index] / statDictionary.viewStats[index];
  totalClicks += 1;
};

function drawImage(array) {
  //pass an array with index numbers to call that object in the storeObjectArray to call it's path
  //then set a name to the image as well as an index number
  var imageList = document.getElementById('images');
  var img;
  var li;
  for (var i = 0; i < array.length; i++) {
    li = document.createElement('li');
    img = document.createElement('img');
    img.setAttribute('src', storeObjectArray[array[i]].path);
    img.setAttribute('name', imageDirStr[array[i]]);
    img.setAttribute('index', array[i]);
    li.appendChild(img);
    imageList.appendChild(li);
  };
};

function restoreIndexArray (oldIndexArray) {
  //when done with previous index, repopulate those indexes in the indexArray
  for (var i = 0; i < oldIndexArray.length; i++) {
    indexArray[oldIndexArray[i]] = oldIndexArray[i];
  };
};

function checkClicksTotal(value) {
  //stop script if there are 25 clicks total
  var elMsg = document.getElementById('feedback');
  if (value >= 25) {
    //imageList.removeEventListener('click', clickHandler, false);
    elMsg.textContent = '25 Clicks reached, that\'s all folks! :)';
    imageList.removeEventListener('click', clickHandler, false);
    return true;
  };
  return false;
};

function barChartDraw(domElement, array, name) {
  //create chart element and push it to chartObjectArray so the objects can be updated
  //later if we want to update live
  var newLabel = '# of ' + name;
  var canvasContext = domElement.getContext('2d');
  var gradient = canvasContext.createLinearGradient(0,0,0,460);
  gradient.addColorStop(0, 'rgba(60, 179, 113, 0.8)');
  gradient.addColorStop(1, 'rgba(25, 25, 112, 0.8)');
  var dataSetsDict = {
    label: newLabel,
    data: array,
    backgroundColor: gradient,
    boderWidth: 1,
  };
  var chartElement = new Chart(domElement, {
    type: 'bar',
    data: {
      labels: imageNameArray,
      datasets: [dataSetsDict],
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontSize: 20,
            fontFamily: 'sans-serif',
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 20,
            fontFamily: 'sans-serif',
          }
        }]
      }
    }
  });
  chartObjectArray.push(chartElement);
};

function drawCharts() {
  //draws charts onto html page
  var loopCounter = 0;
  //calculateClicksPerViews();

  if (chartObjectArray.length === 0) {
    var clickElement = document.getElementById('click_stats');
    var viewElement = document.getElementById('view_stats');
    var clickViewRatio = document.getElementById('click_view_stats');
    var domElArray = [clickElement, viewElement, clickViewRatio];
    var domElName = ['Clicks', 'Views', 'Clicks/Views'];

    for (var key in statDictionary) {
      barChartDraw(domElArray[loopCounter], statDictionary[key], domElName[loopCounter]);
      loopCounter += 1;
    };

  } else {

    for (var rekey in statDictionary) {
      chartObjectArray[loopCounter].data.datasets[0].data = statDictionary[rekey];
      chartObjectArray[loopCounter].update();
      loopCounter += 1;
    };
  };
};

function hideCharts() {
  //function set on the event listener for the button click to hide charts and show the show chart button
  var divContainer = document.getElementById('stats');
  var statButton = document.getElementById('viewstats');
  var hideButton = document.getElementById('hidestats');
  divContainer.setAttribute('class', 'hidden');
  statButton.setAttribute('class', '');
  hideButton.setAttribute('class', 'hidden');
};

function showCharts() {
  //function set on the event listener for the button click to show charts and show hide chart button
  var divContainer = document.getElementById('stats');
  var statButton = document.getElementById('viewstats');
  var hideButton = document.getElementById('hidestats');
  divContainer.setAttribute('class', 'centerblock');
  statButton.setAttribute('class', 'hidden');
  hideButton.setAttribute('class', '');
};

function renderButton() {
  //shows stat button which can set the class of the div element holding the charts to be shown
  var statButton = document.getElementById('viewstats');
  var hideButton = document.getElementById('hidestats');
  statButton.setAttribute('class', '');
  statButton.addEventListener('click', showCharts, false);
  hideButton.addEventListener('click', hideCharts, false);
};

function clickHandler(event) {
  //get index value from image that was clicked and pass to calculateClicks
  //if total clicks reaches 25, stop the script
  var eventCheck = event.target.getAttribute('src');
  if (eventCheck !== null) {
    var index = Number(event.target.getAttribute('index'));
    var newIndexObjectCreate;
    calculateClicks(index);
    //console.log(totalClicks);
    if (checkClicksTotal(totalClicks)) {
      drawCharts();
      renderButton();
      //when you refresh your browser will store an array of indexes so you don't see the same images
      newIndexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
      restoreIndexArray(indexObjectCreate);
      indexObjectCreate = newIndexObjectCreate;
      setSavedData();
    } else {
      imageList.textContent = '';
      newIndexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
      calculateViews(newIndexObjectCreate);
      drawImage(newIndexObjectCreate);
      restoreIndexArray(indexObjectCreate);
      indexObjectCreate = newIndexObjectCreate;
    }
  }
};

function checkSavedData() {
  //check if data is saved to localStorage and if it isn't initialize all arrays needed to begin storing
  var dictStoredWebDataObjects = localStorage.getItem('webPageData');
  var savedData;
  if (dictStoredWebDataObjects === null) {
    initializeObjectsIndex();
    indexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
  } else {
    savedData = JSON.parse(dictStoredWebDataObjects);
    indexArray = savedData['indexArrayKey'];
    imageNameArray = savedData['imageNameArrayKey'];
    storeObjectArray = savedData['storeObjectArrayKey'];
    statDictionary = savedData['statDictionaryKey'];
    indexObjectCreate = savedData['indexObjectCreateKey'];
  };
};

function setSavedData() {
  //save data to localStorage
  var savedDataDictionary = {
    indexArrayKey: indexArray,
    imageNameArrayKey: imageNameArray,
    storeObjectArrayKey: storeObjectArray,
    statDictionaryKey: statDictionary,
    indexObjectCreateKey: indexObjectCreate,
  };
  var savedDataDictionaryString = JSON.stringify(savedDataDictionary);
  localStorage.setItem('webPageData', savedDataDictionaryString);
};

//main

checkSavedData();
calculateViews(indexObjectCreate);
drawImage(indexObjectCreate);

var imageList = document.getElementById('images');
imageList.addEventListener('click', clickHandler, false);
