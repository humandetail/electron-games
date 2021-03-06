import React, { FC } from 'react';
import styles from './modal.scss';

export interface IModal {
  title: string;
}

const Modal: FC<IModal> = ({ title, children }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.mask} />
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>{children}</div>
        {/* <div className={ styles['btn-close'] }>
          <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <path d="M512 451.6608 403.3536 343.0144a42.606933 42.606933 0 0 0-60.305067 0.034133 42.666667 42.666667 0 0 0-0.034133 60.305067L451.6608 512 343.0144 620.6464a42.606933 42.606933 0 0 0 0.034133 60.305067 42.666667 42.666667 0 0 0 60.305067 0.034133L512 572.3392l108.6464 108.6464a42.606933 42.606933 0 0 0 60.305067-0.034133 42.666667 42.666667 0 0 0 0.034133-60.305067L572.3392 512l108.6464-108.6464a42.606933 42.606933 0 0 0-0.034133-60.305067 42.666667 42.666667 0 0 0-60.305067-0.034133L512 451.6608zM512 1024C229.666133 1024 0 794.333867 0 512S229.666133 0 512 0s512 229.666133 512 512-229.666133 512-512 512zm0-938.666667c-235.264 0-426.666667 191.402667-426.666667 426.666667s191.402667 426.666667 426.666667 426.666667 426.666667-191.402667 426.666667-426.666667-191.402667-426.666667-426.666667-426.666667z" fill="#707070"></path>
          </svg>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;
