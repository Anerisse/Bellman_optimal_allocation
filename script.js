let dataTable = document.getElementById("dataTable");

window.addEventListener("DOMContentLoaded", () => {
  dbDataDisplay();
});

function dbDataDisplay() {
  let dbDiv = document.getElementById("dbDiv");
  dbDiv.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = "Автосохранение: ";
  p.classList.add("mb-3", "mt-2");
  dbDiv.appendChild(p);
  window.database
    .getAllData()
    .then((data) => {
      console.log("Данные из базы данных:", data);

      data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = ` ${item.name}`;

        li.classList.add(
          "list-group-item",
          "cursor-pointer",
          "list-group-item-action",
          "border",
          "border-dark",
          "p-1",
          "ps-2",
          "mt-1",
          "rounded"
        );

        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", `${item.id}`);
        input.setAttribute("value", `${JSON.stringify(item.inputData)}`);

        // Открываем модальное окно при клике
        li.addEventListener("click", function () {
          document.getElementById(
            "previewText"
          ).textContent = `Название: ${item.name}`;

          document.getElementById("previewData").textContent = JSON.stringify(
            item.inputData
          );

          // Открываем модальное окно
          let previewModal = new bootstrap.Modal(
            document.getElementById("previewModal")
          );
          previewModal.show();
        });

        dbDiv.appendChild(li);
        dbDiv.appendChild(input);
      });
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });
}

document.getElementById("applyDataBtn").addEventListener("click", function () {
  const inputDataString = document.getElementById("previewData").textContent;
  const inputDataArray = JSON.parse(inputDataString);
  dataToDataTable(inputDataArray);
  const modalElement = document.getElementById("previewModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement); // Получаем экземпляр

  if (modalInstance) {
    modalInstance.hide(); // Закрываем окно
  }
});
function dataToDataTable(data) {
  let prCount = data.length - 1;
  let varCount = data[0].length;
  let dataArr = data;
  dataTable.innerHTML = "";

  let thead = document.createElement("thead");
  let tr = document.createElement("tr");

  let thS = document.createElement("th");
  thS.textContent = "Средства";
  tr.appendChild(thS);

  let thN = document.createElement("th");
  thN.colSpan = prCount;
  thN.textContent = "Рейтинг систем";
  tr.appendChild(thN);

  thead.appendChild(tr);
  dataTable.appendChild(thead);

  let tbody = document.createElement("tbody");
  for (let i = 0; i < varCount + 1; i++) {
    let tempTr = document.createElement("tr");
    for (let j = 0; j < prCount + 1; j++) {
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

function start() {
  let myArr = getData();
  /*let myArr = [
    [20, 40, 60, 80, 100],
    [10, 31, 42, 62, 76],
    [12, 24, 36, 52, 74],
    [11, 36, 45, 60, 77],
    [16, 37, 46, 63, 80],
  ];
  */
  let prCount = myArr.length - 1;
  let varCount = myArr[0].length;

  //автосохранение в бд

  async function saveAndUpdate() {
    try {
      await window.database.addData("_", myArr, true); // Дожидаемся завершения
      dbDataDisplay(); // Только после успешного завершения обновляем данные
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  }

  // Вызываем функцию
  saveAndUpdate();

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

  //собираем отдельные максимумы в массив
  let maxArr = getMaxArr(allArr);
  console.log("maxArr:");
  console.log(maxArr);

  //находим все варианты индексов
  let maxIndices = findMaxIndices(transposeMatrix(maxArr));
  console.log("maxIndices:");
  console.log(maxIndices);

  //создаём массив для ответа и заполняем его "!"
  let answArr = [];
  for (let i = 0; i < maxIndices.length; i++) {
    let tempArr = [];
    for (let j = 0; j < prCount; j++) {
      tempArr.push("!");
    }
    answArr.push(tempArr);
  }
  console.log("answArr:");
  console.log(answArr);

  answArr = solve(allArr, maxIndices, answArr, myArr);

  console.log("answArr:");
  console.log(answArr);

  uniqArr = Array.from(new Set(answArr.map(JSON.stringify))).map(JSON.parse);
  console.log("uniqArr:");
  console.log(uniqArr);
  //Выводим результат
  printAnswer(uniqArr);
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

function printAnswer(answArr) {
  let divAnsw = document.getElementById("answer");
  divAnsw.innerHTML = "";

  let hA = document.createElement("h2");
  hA.textContent = "Ответ:";
  divAnsw.appendChild(hA);
  let answTable = document.createElement("table");

  let thead = document.createElement("thead");

  let hTr = document.createElement("tr");
  for (let i = 0; i < answArr[0].length; i++) {
    let th = document.createElement("th");
    th.textContent = "X" + (i + 1);
    hTr.appendChild(th);
  }
  thead.appendChild(hTr);
  answTable.appendChild(thead);

  let tbody = document.createElement("tbody");

  for (each of answArr) {
    let tr = document.createElement("tr");
    for (let i = 0; i < each.length; i++) {
      let td = document.createElement("td");
      td.textContent = each[i].toFixed(2);
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
  answTable.appendChild(tbody);
  divAnsw.appendChild(answTable);
}

function getMaxArr(allArr) {
  let maxArr = [];
  for (elem of allArr) {
    let tempArr = [];
    for (subelement of elem) {
      tempArr.push(subelement[subelement.length - 1]);
    }
    maxArr.push(tempArr.slice(-allArr.length));
  }
  return maxArr;
}

function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function findMaxIndices(matrix) {
  // Сюда результаты, массив, так как мож быть несколкьо
  let paths = [
    {
      // сюда прям резульат
      indices: [],
      // сюда индексы которые в текущем забеге уже отработали
      usedIndices: new Set(),
    },
  ];

  // просмотр матрицы снизу вверх
  for (let rowIndex = matrix.length - 1; rowIndex >= 0; rowIndex--) {
    const row = matrix[rowIndex];
    let newPaths = [];

    // Для каждого уже существующего варианта результатов
    for (const path of paths) {
      // убираем индексы которые уже есть в результате
      const used = path.usedIndices;
      const availableIndices = row
        .map((_, idx) => idx)
        .filter((idx) => !used.has(idx));

      // Ищем максимум в оставшихся значениях строки.
      // Не лучший варик, но более понятный для прочтения
      // Лучш потом заменить на флажок первого значения
      let maxVal = Number.NEGATIVE_INFINITY;
      for (const idx of availableIndices) {
        if (row[idx] > maxVal) {
          maxVal = row[idx];
        }
      }

      // Когда макс найден, ищем есть ли ещё такие же
      const maxIndices = availableIndices.filter((idx) => row[idx] === maxVal);

      // Для каждого "индекса" создаём варик
      for (const idx of maxIndices) {
        // Обновляешь список использованых индексов
        const newUsedIndices = new Set(used);
        newUsedIndices.add(idx);

        // Текущий результат
        const newIndices = [...path.indices, idx];
        // Запихиваешь в результаты каждый варик
        newPaths.push({
          indices: newIndices,
          usedIndices: newUsedIndices,
        });
      }
    }

    // все существующие результаты обновляешь для следующей итерации
    paths = newPaths;
  }

  return paths.map((path) => path.indices);
}

function solve(allArr, maxIndices, answArr, myArr) {
  for (let elem = 0; elem < maxIndices.length; elem++) {
    let t = 0;
    for (let i = allArr[0].length - 1; i > allArr.length - 1; i--) {
      //console.log(i);
      let temp = allArr[maxIndices[elem][t]][i];
      //console.log(temp);

      //ищем в какой строке находится макс
      let stroka = 0;
      for (let i = 0; i < temp.length - 1; i++) {
        //console.log(cutArr[i][cutArr[i].length - 1]);

        if (temp[i][temp[i].length - 1] !== 0) {
          stroka = i;
          break;
        }
      }
      //console.log("stroka = " + stroka);

      let prCount = myArr.length - 1;
      answArr[elem][prCount - maxIndices[elem][t] - 2] = myArr[0][stroka];

      t++;
    }
  }

  for (each of answArr) {
    let sum = 0;
    //Считаем сумму элементов в answArr
    for (let i = 0; i < each.length; i++) {
      if (!(typeof each[i] === "string")) {
        sum += each[i];
      }
    }

    //Изменяем последний оставшийся элемент "!" на (Общее количество средств - сумма элементов в answArr)
    for (let i = 0; i < each.length; i++) {
      if (typeof each[i] === "string") {
        each[i] = myArr[0][myArr[0].length - 1] - sum;
      }
    }
  }

  return answArr;
  //console.log(allArr[0].length - 1);
}
