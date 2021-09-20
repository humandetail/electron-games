import { Menu, MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { createMineOptionsWindow } from './windows/optionsWindow';

const isMac = process.platform === 'darwin'

function buildTemplate (win: BrowserWindow): MenuItemConstructorOptions[] {
  const gameSubMenu: MenuItemConstructorOptions = {
    label: '游戏',
    accelerator: 'Command+G',
    submenu: [
      {
        label: '难度选择',
        accelerator: isMac ? 'Command+M' : 'Ctrl+M',
        click () {
          // ipcRenderer.send('mine-select-mode');
          createMineOptionsWindow(win);
        }
      }
    ]
  }

  const helpSubMenu: MenuItemConstructorOptions = {
    label: '帮助',
    click () {}
  }

  return [gameSubMenu, helpSubMenu];
}

export function buildMenu (win: BrowserWindow) {
  const menu = Menu.buildFromTemplate(buildTemplate(win));
  win.setMenu(menu);

  return menu;
}

