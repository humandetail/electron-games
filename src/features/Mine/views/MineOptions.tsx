import React, { FC, useState } from 'react';
import { ipcRenderer } from 'electron';

import {  Mode, CustomizedLimit, defaultCustomizedOptions, defaultOptions } from '../config/game.config';

import { OPTIONS_CONFIRM, OPTIONS_CANCEL } from '../config/msg-constant.config';
import { ICustomizedOptions } from '../types';

const MineOptions: FC = () => {
  // let defaultOptions = JSON.parse(localStorage.getItem(STORAGE_OPTIONS_KEY) || '{}') as IOptions;

  const [ currentMode, setCurrentMode ] = useState(defaultOptions.mode || Mode.primary);
  const [ customizedOptions, setCustomizedOptions ] = useState<ICustomizedOptions>(defaultOptions.customizedOptions || defaultCustomizedOptions);
  const [ allowSuspicious, setAllowSuspicious ] = useState(!!defaultOptions.allowSuspicious);

  const modeList = [
    { value: Mode.primary, label: '初级', mines: 9, size: [9, 9] },
    { value: Mode.middle, label: '中级', mines: 40, size: [16, 16] },
    { value: Mode.high, label: '高级', mines: 99, size: [30, 16] },
  ];
  const customizedItem = { value: Mode.customized, label: '自定义', mines: 668, size:[30, 24] }

  const handleCustomizedOptionsChange = (prop: keyof ICustomizedOptions, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!/^\d+$/.test(value) && value !== '') {
      return false;
    }
    setCustomizedOptions({
      ...customizedOptions,
      [prop]: value
    });

    return true;
  }
  const handleCustomizedOptionsBlur = (prop: keyof ICustomizedOptions, e: React.FocusEvent<HTMLInputElement>) => {
    // eslint-disable-next-line prefer-destructuring
    let value: number | string = e.target.value;
    const [min, max] = CustomizedLimit[prop];

    if (!/^\d+$/.test(value) && value !== '') {
      value = 0;
    }

    value = Number(value);

    value = value > max ? max : value < min ? min : value;

    // 限制最大雷数
    const { width, height, mines } = customizedOptions;
    let boxSize = 0;
    let newMines = mines;
    switch (prop) {
      case 'width':
        boxSize = value * +height;
        break;
      case 'height':
        boxSize = value * +width;
        break;
      case 'mines':
        boxSize = +width * +height;
        newMines = value;
        break;
      default:
        break;
    }

    if (mines > boxSize) {
      const boxSize = +customizedOptions.width * +customizedOptions.height;
      value = value > boxSize ? boxSize : value;
    }

    setCustomizedOptions({
      ...customizedOptions,
      [prop]: value,
      mines: mines > boxSize ? boxSize : newMines
    });

    // 在用户输入自定义值时，设置当前模式为自定义
    setCurrentMode(Mode.customized)

    return true;
  }

  const handleConfirm = () => {
    const options = {
      mode: currentMode,
      customizedOptions,
      allowSuspicious
    };
    // localStorage.setItem(STORAGE_OPTIONS_KEY, JSON.stringify(options));

    ipcRenderer.send(OPTIONS_CONFIRM, options);
  }

  const handleCancel = () => {
    ipcRenderer.send(OPTIONS_CANCEL);
  }

  return (
    <div className="options-container">
      <section className="mode-wrapper">
        <h2 className="title">难度</h2>

        <div className="row">
          <div className="col">
            <ul className="mode-list">
              {
                modeList.map((item) => (
                  <li
                    key={ item.value }
                    className="mode-item">
                    <input
                      type="radio"
                      name="mode"
                      checked={ currentMode === item.value }
                      id={ `mode-item${item.value}` }
                      onChange={ () => setCurrentMode(item.value) }
                    />
                    <label htmlFor={ `mode-item${item.value}` }>
                      <p className="label">{ item.label }</p>
                      <p className="mines">
                        { item.mines }
                        个雷
                      </p>
                      <p className="size">
                        { item.size.join(' x ') }
                        平铺网格
                      </p>
                    </label>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="col">
            <div className="mode-item">
              <input
                type="radio"
                name="mode"
                checked={ currentMode === customizedItem.value }
                id={ `mode-item${customizedItem.value}` }
                onChange={ () => setCurrentMode(customizedItem.value) }
              />
              <label htmlFor={ `mode-item${customizedItem.value}` }>
                <p className="label">{ customizedItem.label }</p>
              </label>
            </div>
            <ul className="customized">
              <li className="item">
                <label htmlFor="c-width">宽度(9-30)：</label>
                <input
                  type="text"
                  value={ customizedOptions.width }
                  id="c-width"
                  onChange={ (e) => handleCustomizedOptionsChange('width', e) }
                  onBlur={ (e) => handleCustomizedOptionsBlur('width', e) }
                />
              </li>
              <li className="item">
                <label htmlFor="c-height">高度(9-24)：</label>
                <input
                  type="text"
                  value={ customizedOptions.height }
                  id="c-height"
                  onChange={ (e) => handleCustomizedOptionsChange('height', e) }
                  onBlur={ (e) => handleCustomizedOptionsBlur('height', e) }
                />
              </li>
              <li className="item">
                <label htmlFor="c-mines">雷数(10-668)：</label>
                <input
                  type="text"
                  value={ customizedOptions.mines }
                  id="c-mines"
                  onChange={ (e) => handleCustomizedOptionsChange('mines', e) }
                  onBlur={ (e) => handleCustomizedOptionsBlur('mines', e) }
                />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="checkbox-wrapper">
        <ul className="checkbox-list">
          <li className="checkbox-item">
            <input
              type="checkbox"
              checked={ allowSuspicious }
              id="allowSuspicious"
              onChange={ () => setAllowSuspicious(!allowSuspicious) }
            />
            <label htmlFor="allowSuspicious">允许问号(双击右键)</label>
          </li>
        </ul>
      </section>

      <section className="operations-wrapper">
        <button
          className="btn btn-confirm"
          onClick={ handleConfirm }>
          确定
        </button>
        <button
          className="btn btn-cancel"
          onClick={ handleCancel }>
          取消
        </button>
      </section>
    </div>
  );
}

export default MineOptions;
