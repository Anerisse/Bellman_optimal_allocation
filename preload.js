const { contextBridge, ipcRenderer } = require("electron");

// Экспортируем функцию addData в рендерер
contextBridge.exposeInMainWorld("database", {
  addData: (name, inputData, isAutoSave) =>
    ipcRenderer.invoke("add-data", name, inputData, isAutoSave),
  getAllData: () => ipcRenderer.invoke("get-all-data"),
});
