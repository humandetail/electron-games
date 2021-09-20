/**
 * 扫雷游戏主窗口
 */
import { BrowserWindow, dialog, ipcMain,  } from 'electron';
import { Size, Mode, boxItemSize, interfaceSize, defaultOptions } from '../../../features/Mine/config/game.config';
import { CHANGE_GAME_STATUS, CHANGE_OPTIONS, OPTIONS_CONFIRM } from '../../../features/Mine/config/msg-constant.config';
import { IOptions } from '../../../features/Mine/types';
import { buildMenu } from '../menu';

const url = require('url');
const path = require('path');

const isMac = process.platform === 'darwin';

let mainWindow: BrowserWindow | null = null;
export function createMineWindow (parentWindow: BrowserWindow) {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    resizable: false,
    parent: parentWindow,
    // icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      // webSecurity: false
    },
  });

  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.loadURL(url.format({
    hash: "#/mine",
    origin: "file://",
    pathname: path.join(__dirname, "../../../index.html"),
    protocol: "file:",
    slashes: true
  }));

  buildMenu(mainWindow);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    resize(defaultOptions);

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      parentWindow.hide();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    parentWindow.show();
  });

  ipcMain.on(OPTIONS_CONFIRM, (_e, options: IOptions) => {
    resize(options)
    mainWindow?.webContents.send(CHANGE_OPTIONS, options);
  })

  ipcMain.on(CHANGE_GAME_STATUS, (_e, action: string, counter: number) => {
    switch (action) {
      case 'successful':
        dialog.showMessageBox({
          title: '扫完了',
          message: `恭喜，扫雷完成，耗时${counter}秒，超越全球98%玩家！`
        })
        break;
      case 'failed':
        dialog.showMessageBox({
          title: '游戏失败',
          message: `居然只用了${counter}秒就GG了，不愧是你！`
        })
        break;
      default:
        break;
    }
  })

  return mainWindow;
}

export function resize (options: IOptions) {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  const { mode, customizedOptions } = options;
  let [width = 0, height = 0] = [];
  switch (mode) {
    case Mode.customized:
      width = +customizedOptions.width;
      height = +customizedOptions.height;
      break;
    case Mode.high:
    case Mode.middle:
    case Mode.primary:
      [width, height] = Size[mode]
      break;
    default:
      break;
  }

  mainWindow.setContentSize(
    // 宽度 = 元素数量 * 元素宽度 + 边宽度 * 2
    width * boxItemSize[0] + interfaceSize[1] * 2 + 3,
    // 高度 = 元素数量 * 元素高度 + 头部高度 + 边宽度 * 3
    height * boxItemSize[1] + interfaceSize[0] + interfaceSize[1] * 3 + 3 + (!isMac ? 20 : 0)
  );
}
