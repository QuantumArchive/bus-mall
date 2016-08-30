'use strict';

var imageDirStr = [ 'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg',
                    'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg',
                    'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png',
                    'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var indexArray = [];
var indexObjectCreate = [];
var storeObjectArray = [];
var totalClicks = 0;

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
  };
};

function calculateClicks(index) {
  storeObjectArray[index].incrementClicks();
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
  if (value === 25) {
    imageList.removeEventListener('click', clickHandler, false);
    elMsg.textContent = '25 Clicks reached, survey ending :)';
    return true;
  };
  return false;
};

function generateClickViewStats() {
  var clickStats = Array(storeObjectArray.length - 1);
  var viewStats = Array(storeObjectArray.length - 1);
  for (var i = 0; i < storeObjectArray.length; i++) {
    clickStats[i] = storeObjectArray[i].totalClicks;
    viewStats[i] = storeObjectArray[i].totalViews;
  };
  console.log('clickStats: ',clickStats);
  console.log('clickStats total:', clickStats.reduce(function(a, b) {return a + b; }, 0));
  console.log('viewStats: ',viewStats);
  console.log('viewStats total:', viewStats.reduce(function(a, b) {return a + b; }, 0));
};

function clickHandler(event) {
  //get index value from image that was clicked and pass to calculateClicks
  //if total clicks reaches 25, stop the script
  var index = Number(event.target.getAttribute('index'));
  var newIndexObjectCreate;
  totalClicks += 1;
  calculateClicks(index);
  console.log(totalClicks);
  if (!checkClicksTotal(totalClicks)) {
    imageList.textContent = '';
    newIndexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
    calculateViews(newIndexObjectCreate);
    drawImage(newIndexObjectCreate);
    restoreIndexArray(indexObjectCreate);
    indexObjectCreate = newIndexObjectCreate;
  } else {
    generateClickViewStats();
  };
};

//main
initializeObjectsIndex();
indexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
calculateViews(indexObjectCreate);
drawImage(indexObjectCreate);

var imageList = document.getElementById('images');
imageList.addEventListener('click', clickHandler, false);
