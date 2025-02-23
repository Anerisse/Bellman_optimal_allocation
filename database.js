const { format } = require("date-fns");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Путь к файлу базы данных
const dbPath = path.join(__dirname, "database.db");

// Проверяем, существует ли файл базы данных
const isFirstRun = !fs.existsSync(dbPath);

// Создаем или подключаем базу данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log("BD connection success.");
    if (isFirstRun) {
      initializeDatabase();
    }
  }
});

// Инициализация базы данных (создание таблиц и т.д.)
function initializeDatabase() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      inputData TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      isAutoSave INTEGER NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("Error create table:", err.message);
      } else {
        console.log("Table users created successfully.");
      }
    }
  );
}

function formatDate(date) {
  return format(date, "yyyy-MM-dd HH:mm");
}

function addData(name, inputData, isAutoSave) {
  return new Promise((resolve, reject) => {
    if (name === "_") {
      name = "AutoSave " + formatDate(new Date());
    }
    const createdAt = formatDate(new Date()); // Текущая дата и время
    const inputDataJson = JSON.stringify(inputData); // Преобразуем матрицу в JSON

    // Сначала удаляем существующую запись с таким же inputDataJson
    db.run(
      "DELETE FROM data WHERE isAutoSave = 1 AND inputData = ?",
      [inputDataJson],
      function (err) {
        if (err) {
          console.error("Error deleting existing entry:", err.message);
          return reject(err);
        } else {
          console.log(`Delete entry `);
        }

        db.run(
          "INSERT INTO data (name, inputData, createdAt, isAutoSave) VALUES (?, ?, ?, ?)",
          [name, inputDataJson, createdAt, isAutoSave ? 1 : 0],
          function (err) {
            if (err) {
              console.error("Error with addData:", err.message);
              return reject(err);
            } else {
              console.log(`Added entry with ID: ${this.lastID}`);
              resolve();
            }
          }
        );
      }
    );
  });
}

function getAllData() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM data ORDER BY id DESC", [], (err, rows) => {
      if (err) {
        console.error("Error with getAllData:", err.message);
        reject(err);
      } else {
        //console.log("Data load success:", rows);
        // Преобразуем JSON-строку обратно в матрицу
        const data = rows.map((row) => ({
          ...row,
          inputData: JSON.parse(row.inputData),
          isAutoSave: row.isAutoSave === 1, // Преобразуем число в boolean
        }));
        console.log("DB request completed, sending response");

        resolve(data);
      }
    });
  });
}

// Экспортируем методы для работы с базой данных
module.exports = {
  db,
  initializeDatabase,
  addData,
  getAllData,
};
