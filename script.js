let dataTable = document.getElementById("dataTable");

function changeSize() {
  let projectCountFromInput = Number(
    document.getElementById("projectCountInput").value
  );

  let varCountFromInput = Number(
    document.getElementById("varCountInput").value
  );

  let dataArr = getData();

  console.log("projectCountFromInput = " + projectCountFromInput);
  console.log("varCountFromInput = " + varCountFromInput);

  dataTable.innerHTML = "";

  let thead = document.createElement("thead");
  let tr = document.createElement("tr");

  let thS = document.createElement("th");
  thS.textContent = "Средства";
  tr.appendChild(thS);

  let thN = document.createElement("th");
  thN.colSpan = projectCountFromInput;
  thN.textContent = "Рейтинг систем";
  tr.appendChild(thN);

  thead.appendChild(tr);
  dataTable.appendChild(thead);

  let tbody = document.createElement("tbody");
  for (let i = 0; i < varCountFromInput + 1; i++) {
    let tempTr = document.createElement("tr");
    for (let j = 0; j < projectCountFromInput + 1; j++) {
      let tempTd = document.createElement("td");

      if (i === 0) {
        if (j === 0) {
          tempTd.textContent = "x";
        } else {
          tempTd.textContent = "f" + j + "(x)";
        }
      } else {
        let tempInput = document.createElement("input");
        tempInput.type = "number";
        tempInput.step = "0.01";
        if (dataArr.length <= j || dataArr[j].length < i) {
          tempInput.value = 0.0;
        } else {
          tempInput.value = dataArr[j][i - 1];
        }
        tempTd.appendChild(tempInput);
      }

      tempTr.appendChild(tempTd);
    }
    tbody.appendChild(tempTr);
  }

  dataTable.appendChild(tbody);
}

function getData() {
  let rowCount = dataTable.rows.length;
  console.log("rowCount = " + rowCount);
  let columnCount = dataTable.rows[2].cells.length;

  console.log("columnCount = " + columnCount);
  dataArr = [];

  for (let i = 0; i < columnCount; i++) {
    dataArr.push([]);
    for (let j = 2; j < rowCount; j++) {
      let cell = dataTable.rows[j].cells[i];
      let inputValue = Number(cell.querySelector("input").value);
      dataArr[i].push(inputValue);
    }
  }

  console.log("Полученный массив: ");

  console.log(dataArr);

  return dataArr;
}

let allArr = [];
let resMas = [];
let myArr = [];
let prCount = 0;
let varCount = 0;
let answArr = [];

function start() {
  myArr = getData();

  prCount = myArr.length - 1;
  varCount = myArr[0].length;

  console.log("prCount = " + prCount + "\nvarCount = " + varCount);

  for (let i = 0; i < myArr.length; i++) {
    myArr[i].unshift(0);
  }
  console.log("myArr");
  for (let i = 0; i < myArr.length; i++) {
    for (let j = 0; j < myArr[i].length; j++) {}
    console.log(myArr[i]);
  }

  console.log("resMas:");
  for (let i = 0; i < varCount + 1; i++) {
    f1(i, 0);
    //console.log(i + ": " + resMas[i]);
  }
  console.log(resMas);

  for (let K = prCount - 1; K > 0; K--) {
    console.log("");
    console.log("%cK = " + K, "color:red");
    let t1Mas = [];
    ///[... [ [0, 2, 3], [1, 1, 1] ], ...]
    /// []
    console.log("t1Mas:");

    for (let i = 0; i < varCount + 1; i++) {
      // [ [] ]
      t1Mas.push([]);
      // [ [f2(i,3)] ];
      t1Mas[i] = f2(i, K);
    }

    allArr.push(t1Mas);
  }

  console.log("");

  console.log("allArr");

  console.log(allArr);

  answArr = [];
  for (let i = 0; i < prCount; i++) {
    answArr.push("!");
  }

  printResults();
}

function f1(i, stolb) {
  tmpMas = [];

  for (let k = 0; k <= i; k++) {
    tmpMas.push(myArr[stolb][k]);
  }

  // console.log(tmpMas);
  resMas.push(tmpMas);
  return;
}

function f2(i, stolb) {
  tmpMas = [];

  for (let k = 0; k <= i; k++) {
    tmpMas.push([]);
    tmpMas[k].push(myArr[stolb][k]);

    if (stolb === prCount - 1) {
      tmpMas[k].push(myArr[[prCount]][i - k]);
    } else {
      tmpMas[k].push(
        allArr[allArr.length - 1][i - k][
          allArr[allArr.length - 1][i - k].length - 1
        ]
      );
    }
    let sum = 0;
    for (let i = 0; i < tmpMas[k].length; i++) {
      sum += tmpMas[k][i];
    }
    tmpMas[k].push(sum);
  }
  let max = 0;
  for (let i = 0; i < tmpMas.length; i++) {
    if (tmpMas[i][tmpMas[i].length - 1] > max) {
      max = tmpMas[i][tmpMas[i].length - 1];
    }
  }
  tmpMas.push(max);

  for (let i = 0; i < tmpMas.length - 1; i++) {
    if (tmpMas[i][tmpMas[i].length - 1] === max) {
      tmpMas[i].push(max);
    } else {
      tmpMas[i].push(0);
    }
  }

  console.log("tmpMas " + i);

  console.log(tmpMas);

  return tmpMas;
}

function printResults() {
  let divResult = document.getElementById("results");
  divResult.innerHTML = "";
  let kTable = document.createElement("table");
  kTable.style = "font-size:14px";

  let thead = document.createElement("thead");
  let theadTr = document.createElement("tr");
  theadTr.style = "border:  solid 2px #000";

  for (let i = 0; i < prCount + 1; i++) {
    let tempTh = document.createElement("th");
    if (i === 0) {
      tempTh.textContent = "Sk - 1";
    } else if (i === 1) {
      tempTh.textContent = "Xk";
      tempTh.style = "border-right:  solid 2px #000";
    } else {
      tempTh.style = "border-right:  solid 2px #000";

      tempTh.textContent = "K = " + (prCount - i + 1);
      tempTh.colSpan = 4;
    }

    theadTr.appendChild(tempTh);
  }
  thead.appendChild(theadTr);

  kTable.appendChild(thead);

  let tbody = document.createElement("tbody");
  for (let i = 0; i < varCount + 1; i++) {
    let tempTd;
    for (let j = 0; j < resMas[i].length; j++) {
      let tempTr = document.createElement("tr");

      for (let k = 0; k < prCount + 1; k++) {
        if (k === 0) {
          if (j === 0) {
            // только для первой строки группы
            tempTd = document.createElement("td");
            tempTd.textContent = i;
            tempTd.rowSpan = resMas[i].length;

            tempTd.style = "border-left:  solid 2px #000";
            tempTr.appendChild(tempTd);
          }
          // ничего не делать для остальных строк
        } else if (k === 1) {
          let tempTd = document.createElement("td");
          tempTd.textContent = resMas[i][j].toFixed(2);
          tempTd.style = "border-right:  solid 2px #000";
          tempTr.appendChild(tempTd);
        } else {
          for (let l = 0; l < 4; l++) {
            let tempTd = document.createElement("td");
            tempTd.textContent = allArr[k - 2][i][j][l].toFixed(2);
            if (l === 3) {
              tempTd.style = "border-right:  solid 2px #000";
            }
            tempTr.appendChild(tempTd);
          }
        }
      }
      if (j === resMas[i].length - 1) {
        tempTr.style = "border-bottom:  solid 2px #000";
      }

      tbody.appendChild(tempTr);
    }
  }

  kTable.appendChild(tbody);

  divResult.appendChild(kTable);
  console.log("allArr");

  console.log(allArr);

  //Изменить так, чтоб allArr остался в первоначальном виде
  let testArr = [];
  testArr = allArr;
  answer(testArr);
}

function answer(testArr) {
  console.log("testArr:");
  console.log(testArr);
  let max = 0;
  let maxInd = 0;
  for (let i = 0; i < testArr.length; i++) {
    for (let j = testArr[0].length - 1; j >= 0; j--) {
      if (testArr[i][j][testArr[i][j].length - 1] >= max) {
        max = testArr[i][j][testArr[i][j].length - 1];
        maxInd = i;
      }
    }
  }
  console.log("max = " + max + "\nmaxInd = " + maxInd);

  dArr = testArr[maxInd][testArr[maxInd].length - 1];
  testF(dArr, maxInd);
  testArr.splice(maxInd, 1);
  for (let i = 0; i < testArr.length; i++) {
    testArr[i].pop();
  }
  console.log("testArr");

  console.log(testArr);
  if (testArr.length > 0) {
    answer(testArr);
  } else {
    let sum = 0;

    console.log(answArr);
    for (let i = 0; i < answArr.length; i++) {
      if (!(typeof answArr[i] === "string")) {
        sum += answArr[i];
      }
    }

    for (let i = 0; i < answArr.length; i++) {
      if (typeof answArr[i] === "string") {
        answArr[i] = myArr[0][myArr[0].length - 1] - sum;
      }
    }
    console.log(answArr);
    printAnswer(answArr);
  }
}

function testF(dArr, maxInd) {
  console.log("dArr");

  console.log(dArr);
  let stroka = 0;
  for (let i = 0; i < dArr.length - 1; i++) {
    //console.log(dArr[i][dArr[i].length - 1]);

    if (dArr[i][dArr[i].length - 1] !== 0) {
      stroka = i;
      break;
    }
  }
  console.log(stroka);

  console.log(
    "Вкладываем в " + (prCount - maxInd - 1) + " проект " + myArr[0][stroka]
  );
  answArr[prCount - maxInd - 2] = myArr[0][stroka];
}

function printAnswer(answArr) {
  let divAnsw = document.getElementById("answer");
  divAnsw.innerHTML = "";

  let hA = document.createElement("h2");
  hA.textContent = "Ответ:";
  divAnsw.appendChild(hA);
  let answTable = document.createElement("table");

  let thead = document.createElement("thead");

  let hTr = document.createElement("tr");
  for (let i = 0; i < answArr.length; i++) {
    let th = document.createElement("th");
    th.textContent = "X" + (i + 1);
    hTr.appendChild(th);
  }
  thead.appendChild(hTr);
  answTable.appendChild(thead);

  let tbody = document.createElement("tbody");

  let tr = document.createElement("tr");
  for (let i = 0; i < answArr.length; i++) {
    let td = document.createElement("td");
    td.textContent = answArr[i].toFixed(2);
    tr.appendChild(td);
  }

  tbody.appendChild(tr);
  answTable.appendChild(tbody);
  divAnsw.appendChild(answTable);
  console.log("allArr");

  console.log(allArr);
}
