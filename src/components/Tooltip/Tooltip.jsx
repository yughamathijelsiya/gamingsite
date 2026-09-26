import React from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({ text, children, position = 'top' }) {
  return (
    <div className={styles.tooltipWrapper} tabIndex={0} role="tooltip" aria-label={text}>
      <span className={styles.trigger}>
        {children}
      </span>
      <div className={styles.tooltipBox}>
        {text}
      </div>
    </div>
  );
}
