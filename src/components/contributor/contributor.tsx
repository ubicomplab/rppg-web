import React from 'react';
import styles from './contributor.module.scss';

const Contributor = () => (
  <div className={styles.gallery}>
    <h3 className={styles.contributor}>Built by engineers:</h3>
    <div className={styles.item}>
      <a href="https://www.linkedin.com/in/juconghe/" target="_blank">
        <img
          src="/images/Jucong.jpeg"
          alt="Jucong He"
          width="130"
          height="130"
        />
      </a>
      <a href="https://www.linkedin.com/in/juconghe/" target="_blank">
        <p>Jucong He</p>
      </a>
    </div>
    <div className={styles.item}>
      <a href="https://www.linkedin.com/in/sophie-nie/" target="_blank">
        <img
          src="/images/Sophie.jpeg"
          alt="Sophie Nie"
          width="130"
          height="130"
        />
      </a>
      <a href="https://www.linkedin.com/in/sophie-nie/" target="_blank">
        <p>Sophie Nie</p>
      </a>
    </div>
  </div>
);

export default Contributor;
