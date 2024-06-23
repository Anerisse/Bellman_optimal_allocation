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

  console.log("Введённые данные: ");

  console.log(dataArr);

  return dataArr;
}

//let allArr = [];
//let resArr = [];
//let myArr = [];
//let prCount = 0;
//let varCount = 0;
//let answArr = [];

function start() {
  let myArr = getData();
  let prCount = myArr.length - 1;
  let varCount = myArr[0].length;

  console.log("prCount = " + prCount + "\nvarCount = " + varCount);

  //Добавляем нули первыми элементами
  for (let i = 0; i < myArr.length; i++) {
    myArr[i].unshift(0);
  }
  console.log("myArr");
  console.log(myArr);

  //Получаем массив ресурсов(самый левый столбец)
  console.log("resArr:");
  let resArr = getResArr(myArr);
  console.log(resArr);

  //Получаем общий массив
  let allArr = getAllArr(myArr);

  console.log("allArr");
  console.log(allArr);

  //создаём и выводим таблицу расчёта
  createCalculateTable(resArr, allArr, prCount, varCount);

  //создаём массив для ответа и заполняем его "!"
  let answArr = [];
  for (let i = 0; i < prCount; i++) {
    answArr.push("!");
  }

  //Считаем массив результатов
  //Копируем в copyArr allArr чтобы можно было посмотреть allArr в консоли
  let copyArr = JSON.parse(JSON.stringify(allArr));
  answer(copyArr, answArr, myArr);

  //Выводим результат
  printAnswer(answArr);
}

function getResArr(myArr) {
  let tmpArr = [];
  let varCount = myArr[0].length;

  for (let i = 0; i < varCount + 1; i++) {
    tmpArr[i] = [];
    for (let k = 0; k <= i; k++) {
      tmpArr[i].push(myArr[0][k]);
    }
    // console.log(tmpArr);
    //console.log(i + ": " + resArr[i]);
  }
  return tmpArr;
}

function getAllArr(myArr) {
  let prCount = myArr.length - 1;
  let varCount = myArr[0].length;
  let allArr = [];
  for (let K = prCount - 1; K > 0; K--) {
    console.log("");
    console.log("%cK = " + K, "color:red");
    let partArr = [];
    ///[... [ [0, 2, 3], [1, 1, 1] ], ...]
    /// []
    console.log("partArr(включает в себя все tmpArr):");

    for (let i = 0; i < varCount; i++) {
      // [ [] ]
      partArr.push([]);
      // [ [fillElementAllArr(i,3)] ];
      partArr[i] = fillElemAllArr(myArr, allArr, i, K);
    }

    allArr.push(partArr);
  }
  return allArr;
}

function fillElemAllArr(myArr, allArr, i, stolb) {
  let prCount = myArr.length - 1;
  //let varCount = myArr[0].length;
  let tmpArr = [];

  for (let k = 0; k <= i; k++) {
    tmpArr.push([]);
    tmpArr[k].push(myArr[stolb][k]);

    if (stolb === prCount - 1) {
      tmpArr[k].push(myArr[[prCount]][i - k]);
    } else {
      tmpArr[k].push(
        allArr[allArr.length - 1][i - k][
          allArr[allArr.length - 1][i - k].length - 1
        ]
      );
    }
    let sum = 0;
    for (let i = 0; i < tmpArr[k].length; i++) {
      sum += tmpArr[k][i];
    }
    tmpArr[k].push(sum);
  }
  let max = 0;
  for (let i = 0; i < tmpArr.length; i++) {
    if (tmpArr[i][tmpArr[i].length - 1] > max) {
      max = tmpArr[i][tmpArr[i].length - 1];
    }
  }
  tmpArr.push(max);

  for (let i = 0; i < tmpArr.length - 1; i++) {
    if (tmpArr[i][tmpArr[i].length - 1] === max) {
      tmpArr[i].push(max);
    } else {
      tmpArr[i].push(0);
    }
  }

  console.log("tmpArr " + i);

  console.log(tmpArr);

  return tmpArr;
}

function createCalculateTable(resArr, allArr, prCount, varCount) {
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
    for (let j = 0; j < resArr[i].length; j++) {
      let tempTr = document.createElement("tr");

      for (let k = 0; k < prCount + 1; k++) {
        if (k === 0) {
          if (j === 0) {
            // только для первой строки группы
            tempTd = document.createElement("td");
            tempTd.textContent = i;
            tempTd.rowSpan = resArr[i].length;

            tempTd.style = "border-left:  solid 2px #000";
            tempTr.appendChild(tempTd);
          }
          // ничего не делать для остальных строк
        } else if (k === 1) {
          let tempTd = document.createElement("td");
          tempTd.textContent = resArr[i][j];
          if (Number.isInteger(resArr[i][j])) {
          } else {
            tempTd.textContent = resArr[i][j].toFixed(2);
          }
          tempTd.style = "border-right:  solid 2px #000";
          tempTr.appendChild(tempTd);
        } else {
          for (let l = 0; l < 4; l++) {
            let tempTd = document.createElement("td");
            if (Number.isInteger(allArr[k - 2][i][j][l])) {
              tempTd.textContent = allArr[k - 2][i][j][l];
            } else {
              tempTd.textContent = allArr[k - 2][i][j][l].toFixed(2);
            }
            if (l === 3) {
              tempTd.style = "border-right:  solid 2px #000";
            }
            tempTr.appendChild(tempTd);
          }
        }
      }
      if (j === resArr[i].length - 1) {
        tempTr.style = "border-bottom:  solid 2px #000";
      }

      tbody.appendChild(tempTr);
    }
  }

  kTable.appendChild(tbody);

  divResult.appendChild(kTable);
}

function answer(copyArr, answArr, myArr) {
  console.log("copyArr:");
  console.log(copyArr);
  //Ищем максимальный элемент с конца (max)
  // и в каком он K - первая размерность (maxInd)
  let max = 0;
  let maxInd = 0;
  for (let i = 0; i < copyArr.length; i++) {
    for (let j = copyArr[0].length - 1; j >= 0; j--) {
      if (copyArr[i][j][copyArr[i][j].length - 1] >= max) {
        max = copyArr[i][j][copyArr[i][j].length - 1];
        maxInd = i;
      }
    }
  }
  console.log("max = " + max + "\nmaxInd = " + maxInd);

  //Вписываем в нужное место answArr
  let cutArr = copyArr[maxInd][copyArr[maxInd].length - 1];
  writeToAnswArr(cutArr, maxInd, myArr, answArr);

  //Убираем из copyArr проанализированное K
  copyArr.splice(maxInd, 1);
  for (let i = 0; i < copyArr.length; i++) {
    copyArr[i].pop();
  }

  console.log("Урезанный copyArr");

  console.log(copyArr);
  //Рекурсия пока у нас есть элементы в copyArr
  if (copyArr.length > 0) {
    answer(copyArr, answArr, myArr);
  } else {
    let sum = 0;
    console.log("\nВыход из рекурсии");
    console.log("answArr");
    console.log(answArr);

    //Считаем сумму элементов в answArr
    for (let i = 0; i < answArr.length; i++) {
      if (!(typeof answArr[i] === "string")) {
        sum += answArr[i];
      }
    }

    //Изменяем последний оставшийся элемент "!" на (Общее количество средств - сумма элементов в answArr)
    for (let i = 0; i < answArr.length; i++) {
      if (typeof answArr[i] === "string") {
        answArr[i] = myArr[0][myArr[0].length - 1] - sum;
      }
    }
    console.log("Итоговый answArr");
    console.log(answArr);
  }
}

function writeToAnswArr(cutArr, maxInd, myArr, answArr) {
  console.log("\ncutArr");

  console.log(cutArr);
  //Ищем в каком элементе(строке) находится максимальное число
  let stroka = 0;
  for (let i = 0; i < cutArr.length - 1; i++) {
    //console.log(cutArr[i][cutArr[i].length - 1]);

    if (cutArr[i][cutArr[i].length - 1] !== 0) {
      stroka = i;
      break;
    }
  }
  console.log("stroka = " + stroka);

  let prCount = myArr.length - 1;

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
}
