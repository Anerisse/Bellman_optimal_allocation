const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const database = require("./database");

// Обработчик для добавления данных
ipcMain.handle("add-data", async (event, name, inputData, isAutoSave) => {
  try {
    await database.addData(name, inputData, isAutoSave);
  } catch (error) {
    console.error("Error with add-data:", error);
  }
});

// Обработчик для получения всех данных
ipcMain.handle("get-all-data", async () => {
  if (!database || typeof database.getAllData !== "function") {
    return []; // Возвращаем пустой массив вместо ошибки
  }

  try {
    const data = await database.getAllData();
    return data;
  } catch (error) {
    console.error("Error with get-all-data:", error);
    return [];
  }
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
