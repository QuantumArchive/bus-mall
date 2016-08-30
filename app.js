'use strict';

var imageDirStr = [ 'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg',
                    'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg',
                    'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png',
                    'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var indexArray = [];
var imageNameArray = [];
var indexObjectCreate = [];
var storeObjectArray = [];
var chartObjectArray = [];
var clickStats = Array(imageDirStr.length - 1).fill(0);
var viewStats = Array(imageDirStr.length - 1).fill(0);
var totalClicks = 0;
var myDictionary = {};

function ImageObject(name,path) {
  this.name = name;
  this.path = path;
  this.totalClicks = 0;
  this.totalViews = 0;
  storeObjectArray.push(this);
};

ImageObject.prototype.incrementClicks = function() {
  this.totalClicks += 1;
};

ImageObject.prototype.incrementViews = function() {
  this.totalViews += 1;
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
    myDictionary[pathFolder + imageDirStr[i]] = 0;
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
  //and increment their views
  for (var i = 0; i < objectIndexedArrayValues.length; i++) {
    storeObjectArray[objectIndexedArrayValues[i]].incrementViews();
    viewStats[objectIndexedArrayValues[i]] += 1;
  };
};

function calculateClicks(index) {
  storeObjectArray[index].incrementClicks();
  clickStats[index] += 1;
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

function generateClickViewStats() {
  //for debugging purposes
  for (var i = 0; i < storeObjectArray.length; i++) {
    clickStats[i] = storeObjectArray[i].totalClicks;
    viewStats[i] = storeObjectArray[i].totalViews;
  };
  console.log('clickStats: ',clickStats);
  console.log('clickStats total:', clickStats.reduce(function(a, b) {return a + b; }, 0));
  console.log('viewStats: ',viewStats);
  console.log('viewStats total:', viewStats.reduce(function(a, b) {return a + b; }, 0));
};

function barChartDraw(domElement, array, name) {
  var newLabel = '# of ' + name;
  var chartElement = new Chart(domElement, {
    type: 'bar',
    data: {
      labels: imageNameArray,
      datasets: [{
        label: newLabel,
        data: array,
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }]
      }
    }
  });
  chartObjectArray.push(chartElement);
};

function drawCharts() {
  //draws charts onto html page
  var clickElement = document.getElementById('click_stats');
  var viewElement = document.getElementById('view_stats');
  if (chartObjectArray.length === 0) {
    barChartDraw(clickElement, clickStats, 'Clicks');
    barChartDraw(viewElement, viewStats, 'Views');
  } else {
    chartObjectArray[0].data.datasets[0].data = clickStats;
    chartObjectArray[0].update();
    chartObjectArray[1].data.datasets[0].data = viewStats;
    chartObjectArray[1].update();
  };
};

function hideCharts() {
  var divContainer = document.getElementById('stats');
  var statButton = document.getElementById('viewstats');
  var hideButton = document.getElementById('hidestats');
  divContainer.setAttribute('class', 'hidden');
  statButton.setAttribute('class', '');
  hideButton.setAttribute('class', 'hidden');
};

function showCharts() {
  var divContainer = document.getElementById('stats');
  var statButton = document.getElementById('viewstats');
  var hideButton = document.getElementById('hidestats');
  divContainer.setAttribute('class', 'centerblock');
  statButton.setAttribute('class', 'hidden');
  hideButton.setAttribute('class', '');
};

function renderButton() {
  var statButton = document.getElementById('viewstats');
  var hideButton = document.getElementById('hidestats');
  statButton.setAttribute('class', '');
  statButton.addEventListener('click', showCharts, false);
  hideButton.addEventListener('click', hideCharts, false);
};

function clickHandler(event) {
  //get index value from image that was clicked and pass to calculateClicks
  //if total clicks reaches 25, stop the script
  var src = event.target.getAttribute('src');
  //console.log(src);
  myDictionary[src] += 1;
  var index = Number(event.target.getAttribute('index'));
  var newIndexObjectCreate;
  calculateClicks(index);
  //console.log(totalClicks);
  if (checkClicksTotal(totalClicks)) {
    drawCharts();
    renderButton();
  } else {
    imageList.textContent = '';
    newIndexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
    calculateViews(newIndexObjectCreate);
    drawImage(newIndexObjectCreate);
    restoreIndexArray(indexObjectCreate);
    indexObjectCreate = newIndexObjectCreate;
  }
  generateClickViewStats();
  //console.log(myDictionary);
};

//main
initializeObjectsIndex();
indexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
calculateViews(indexObjectCreate);
drawImage(indexObjectCreate);

var imageList = document.getElementById('images');
imageList.addEventListener('click', clickHandler, false);
