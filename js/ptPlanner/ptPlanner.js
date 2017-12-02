var endPoint = 'Flagstaff';
var startPoint = 'a';

console.log('startPoint' + startPoint);
console.log('endPoint' + endPoint);

var trainMap = {
  AlameinLine: ['Flinders Street', 'Richmond', 'East Richmond', 'Burnley', 'Hawthorn', 'Glenferrie'],
  GlenWaverlyLine: ['Flagstaff', 'Melbourne Central', 'Parliament', 'Richmond', 'Kooyong', 'Tooronga'],
  SandringhamLine: ['Southern Cross', 'Richmond', 'South Yarra', 'Prahran', 'Windsor'],
  testLine:['a','b','c','Prahran','d','e']

}

// interface setting
function Dropdown1() {
    document.getElementById("myDropdown1").classList.toggle("show");
}

function Dropdown2() {
    document.getElementById("myDropdown2").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


var bigContainer = document.getElementById('myDropdown');


var callback = function(result) {printResult(startPoint, endPoint, result);}

routeFinding(startPoint, endPoint, trainMap,[],[],callback);
// printResult(startPoint, endPoint, result);

/*
*function name: routeFinding
*input:startPoint(string), 
       endPoint(string), 
       trainMap(object),
       aviodInter(array),
       stationList(array)
       callback(function)
*return:result(array) 
*/

function routeFinding(startPoint, endPoint, trainMap,aviodInter,stationList,callback) {

  // find out the intersection
  intersectionArr = findIntersection(trainMap);

  //check if start point and end point in the same line
  var SameLineCheck = isInSameLineCheck(startPoint, endPoint, trainMap);

  //when start point and end point in the same line
  if (SameLineCheck.inSameLine) {

    var result = calcOneLine(startPoint, endPoint, SameLineCheck.startLineName, trainMap);
    // console.log(result);

    // return result;
    callback(result);

  } else
  //when start point and end point in the different line
  {
    //check if start point and end point is directly connect or not
    var connectedLine = {};
    //store the index number of intersectionArr
    connectedLine.num = -1;

    intersectionArr.forEach(
      function(value,index) {
        var startPart = isInSameLineCheck(startPoint, intersectionArr[index], trainMap);
        var endPart = isInSameLineCheck(intersectionArr[index], endPoint, trainMap);
        if (startPart.inSameLine && endPart.inSameLine) {
          connectedLine.num = index;
          console.log("connectedLine.num = "+value)
          connectedLine.startLineName = startPart.startLineName;
          connectedLine.endLineName = endPart.startLineName;
        }
      }
    );

    // when start point and end point can be connected by 1 intersection
    if (connectedLine.num !== -1) {
      var result1 = calcOneLine(startPoint, intersectionArr[connectedLine.num], connectedLine.startLineName, trainMap);
      var result2 = calcOneLine(intersectionArr[connectedLine.num], endPoint, connectedLine.endLineName, trainMap);
      // console.log('result1:' + result1)
      // console.log('result2:' + result2)
      result1.pop();
      if(stationList[0]){
        stationList.pop();
      }
      console.log('stationList ='+ stationList);
      result = stationList.concat(result1,result2).slice();
      console.log(result);

      // return result;
      callback(result);
    }
    else{
      console.log("start point and end point cannot be connected by 1 intersection");

      //remove current startPoint from intersectionArr
      if(intersectionArr.indexOf(startPoint)>-1){
        intersectionArr.splice(intersectionArr.indexOf(startPoint), 1);
      }

      //remove avoid intersection from intersectionArr
      aviodInter.forEach(
        function(value,index){
          if(intersectionArr.indexOf(value)>-1){
            intersectionArr.splice(intersectionArr.indexOf(value),1);
          }
        }
        )

      aviodInter.push(startPoint);


      //find out the close intersection from startpoint
      var closeIntersectionFromStart = []
      intersectionArr.forEach(function(value,index){
        var startPart = isInSameLineCheck(startPoint, intersectionArr[index], trainMap);

        if(startPart.inSameLine){

          stationList = stationList.concat(calcOneLine(startPoint, value, startPart.startLineName, trainMap));
          console.log('stationList ='+ stationList)
          //call function itself
          routeFinding(intersectionArr[index], endPoint, trainMap,aviodInter,stationList,callback);
          
        }
      }
        )
    }
  }
}



function filter(arr1, arr2) {
  //copare 2 array
  var result = [];
  if (arr1 == [] || arr2 == []) {
    return result;
  }

  var tempString = arr2.toString();
  for (var i = 0; i < arr1.length; i++) {
    if (tempString.indexOf(arr1[i].toString()) > -1) {
      for (var j = 0; j < arr2.length; j++) {
        if (arr1[i] == arr2[j]) {
          result.push(arr1[i]);
          break;
        }
      }
    }
  }
  return result;
}

function calcOneLine(startPoint, endPoint, startLineName, trainMap) {
  //find start point order and end point order in the array
  var startNum = trainMap[startLineName].indexOf(startPoint);

  var endNum = trainMap[startLineName].indexOf(endPoint);

  var currentLine = trainMap[startLineName];

  //if endNum<startNum reverse currentLine Array
  if (endNum < startNum) {
    currentLine.reverse();

    startNum = currentLine.length - startNum - 1;
    endNum = currentLine.length - endNum - 1;
  }

  currentLine = currentLine.slice(0, endNum + 1);
  currentLine = currentLine.slice(startNum);

  console.log("currentLine="+currentLine)
  return currentLine;
}

// find out the intersection

function findIntersection(trainMap) {

  var totalArr = [];
  for (index in trainMap) {
    totalArr = totalArr.concat(trainMap[index]);
  }

  var intersectionArr = [];

  //find out the repeat station
  var flag = 0;
  for (var i = 0; i < totalArr.length; i++) {
    for (var j = i + 1; j < totalArr.length; j++) {
      if (totalArr[i] == totalArr[j]) {
        flag++;
        //if flag is 1, we find out a new intersection
        if (flag == 1) {
          intersectionArr.push(totalArr[i]);
        }
        //delete this station
        totalArr.splice(j, 1);
      }
    }

    //set flag to 0
    flag = 0;
  }
  return intersectionArr;
}

function isInSameLineCheck(startPoint, endPoint, trainMap) {
  //check if start point and end point in the same line
  var startLineName = [];
  var endLineName = [];

  for (index in trainMap) {
    for (var i = 0; i < trainMap[index].length; i++) {
      if (startPoint == trainMap[index][i]) {
        startLineName.push(index);
        // console.log(startLineName);
      }
      if (endPoint == trainMap[index][i]) {
        endLineName.push(index);
        // console.log(endLineName);
      }
    }
  }
  var sameLineName = filter(startLineName, endLineName)[0];
  if (sameLineName) {
    return result = {
      inSameLine: true,
      startLineName: sameLineName,
      endLineName: sameLineName
    };
  } else {
    return result = {
      inSameLine: false,
      startLineName: startLineName,
      endLineName: endLineName
    };
  }
}

function printResult(startPoint, endPoint, result) {
  document.write("origin: " + startPoint + "</br>");
  document.write("destination: " + endPoint + "</br>");
  result.forEach(function(value, index) {
    if (index < result.length - 1) {
      document.write(result[index] + " ---> ");
    } else {
      document.write(result[index] + "</br>");
    }
  })

  document.write(result.length + " stops total")
}