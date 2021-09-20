/**
 * 扫雷游戏 选择难度窗口
 */
import { BrowserWindow, ipcMain } from 'electron';
import { OPTIONS_CANCEL, OPTIONS_CONFIRM } from '../../../features/Mine/config/msg-constant.config';

const url = require('url');
const path = require('path');

let optionsWindow: BrowserWindow | null = null;
export function createMineOptionsWindow (parentWindow: BrowserWindow) {
  optionsWindow = new BrowserWindow({
    show: false,
    width: 450,
    height: 360,
    resizable: false,
    parent: parentWindow,
    title: '难度选择',
    // icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      // webSecurity: false
    },
  });

  // optionsWindow.loadURL(`file://${__dirname}/index.html`);
  optionsWindow.loadURL(url.format({
    hash: "#/mine/options",
    origin: "file://",
    pathname: path.join(__dirname, "../../../index.html"),
    protocol: "file:",
    slashes: true
  }));

  optionsWindow.setMenu(null);

  optionsWindow.webContents.on('did-finish-load', () => {
    if (!optionsWindow) {
      throw new Error('"optionsWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      optionsWindow.minimize();
    } else {
      optionsWindow.show();
      optionsWindow.focus();
    }
  });

  optionsWindow.on('closed', () => {
    optionsWindow = null;
  });

  ipcMain.on(OPTIONS_CONFIRM, () => {
    optionsWindow?.close();
  });

  ipcMain.on(OPTIONS_CANCEL, () => {
    optionsWindow?.close();
  });

  return optionsWindow;
}

