const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { addData, getAllData } = require("./database");

// Обработчик для добавления данных
ipcMain.handle("add-data", async (event, name, inputData, isAutoSave) => {
  addData(name, inputData, isAutoSave);
});

// Обработчик для получения всех данных
ipcMain.handle("get-all-data", async () => {
  return new Promise((resolve, reject) => {
    getAllData((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Указываем путь к preload.js
      contextIsolation: true, // Включено для безопасности
      nodeIntegration: false, // Отключено для безопасности
    },
  });

  win.loadFile("index.html");
  win.maximize();
};
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
