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
  //pass array with index numbers for objects that were selected for view
  for (var i = 0; i < objectIndexedArrayValues.length; i++) {
    storeObjectArray[objectIndexedArrayValues[i]].incrementViews();
  };
};

function calculateClicks(index) {
  storeObjectArray[index].incrementClicks();
};

function drawImage(array) {
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
  }
};

function restoreIndexArray (oldIndexArray) {
  for (var i = 0; i < oldIndexArray.length; i++) {
    indexArray[oldIndexArray[i]] = oldIndexArray[i];
  };
};

function checkClicksTotal(value) {
  var elMsg = document.getElementById('feedback');
  if (value === 25) {
    imageList.removeEventListener('click', clickHandler, false);
    elMsg.textContent = '25 Clicks reached, survey ending :)';
    return true;
  };
  return false;
};

function clickHandler(event) {
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
  };
};

//main
initializeObjectsIndex();
indexObjectCreate = randomNumbArray((imageDirStr.length - 1), 0, 3);
calculateViews(indexObjectCreate);
drawImage(indexObjectCreate);

var imageList = document.getElementById('images');
imageList.addEventListener('click', clickHandler, false);
