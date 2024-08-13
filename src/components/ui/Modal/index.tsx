import React, { PropsWithChildren } from "react";
import styles from "./index.module.scss";

type props = {
  title: string;
  onClose: () => void;
  onBackdropClick: () => void;
}

const Modal = ({title, onClose, onBackdropClick, children}: PropsWithChildren<props>) => {

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onBackdropClick}
      ></div>
      <div className={styles.modal}>
        <div className={styles.title}>{title}</div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
        >&times;</button>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  )
}

export default React.memo(Modal);