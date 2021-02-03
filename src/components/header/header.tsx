import React from 'react';
import styles from './header.module.scss';

const Header = () => (
  <header className={styles.header}>
    <a href="http://cs.washington.edu/" target="_blank">
      <img
        src="/images/UWlogo3.png"
        alt="UW Logo"
        width="90"
        height="60"
        className="UW-logo"
      />
      <img
        src="/images/UWlogo2.png"
        alt="UW Logo"
        width="260"
        height="24"
        className="UW-text"
      />
    </a>
    <a 
      className={styles.github}
      href="https://github.com/ubicomplab/rppg-web" target="_blank">
        GITHUB
    </a>
  </header>
);

export default Header;
