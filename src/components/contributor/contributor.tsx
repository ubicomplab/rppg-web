import React from 'react';
import styles from './contributor.module.scss';

const Contributor = () => (
  <div>
    <h3 className={styles.textCenter}>
      <b>Built by engineers:</b>        
    </h3>
    <div className={styles.gallery}>
        <div className={styles.item}>
            <a href="https://www.linkedin.com/in/juconghe/">
                <img 
                    src="/images/Jucong.jpeg"
                    alt="Jucong He"
                    width="130"
                    height="130"
                />
            </a>
            <a href="https://www.linkedin.com/in/juconghe/"> 
                <p>Jucong He</p>
            </a>
        </div>
        <div className={styles.item}>
            <a href="https://www.linkedin.com/in/sophie-nie/">
                <img 
                    src="/images/Sophie.jpeg"
                    alt="Sophie Nie"
                    width="130"
                    height="130"
                />
            </a>
            <a href="https://www.linkedin.com/in/sophie-nie/"> 
                <p>Sophie Nie</p>
            </a>
        </div>
    </div>
  </div>
);

export default Contributor;