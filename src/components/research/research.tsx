import React from 'react';
import styles from './research.module.scss';

const Research = () => (
  <div className={styles.ResearchSection}>
    <h3>
      <b>Research Paper</b>
    </h3>
    <b>
      <a href="https://papers.nips.cc/paper/2020/file/e1228be46de6a0234ac22ded31417bc7-Paper.pdf" target="_blank">
        <p>
          Multi-Task Temporal Shift Attention Networks for On-Device Contactless
          Vitals Measurement
        </p>
      </a>
    </b>
    <a href="https://homes.cs.washington.edu/~xliu0/" target="_blank"><u>Xin Liu</u>, </a>
    <a href="https://www.linkedin.com/in/josh-fromm-2a4a2258/" target="_blank"><u>Josh Fromm</u>, </a>
    <a href="https://ubicomplab.cs.washington.edu/members/" target="_blank"><u>Shwetak Patel</u>, </a>
    <a href="https://www.microsoft.com/en-us/research/people/damcduff/" target="_blank">
    <u>Daniel McDuff</u>
    </a>
    <a href="https://papers.nips.cc/paper/2020/file/e1228be46de6a0234ac22ded31417bc7-Paper.pdf" target="_blank">
      <h4>Download PDF</h4>
    </a>
    <a href="https://github.com/xliucs/MTTS-CAN" target="_blank">
      <h4>Github Link: MTTS-CAN </h4>
    </a>
    <a href="https://github.com/ubicomplab/rppg-web" target="_blank">
      <h4>Github Link: Web Demo </h4>
    </a>
  </div>
);

export default Research;
