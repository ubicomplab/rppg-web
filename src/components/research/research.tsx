import React from 'react';
import styles from './research.module.scss';

const Research = () => (
  <div className={styles.ResearchSection}>
    <h3>
      <b>Research Paper</b>
    </h3>
    <b>
      <a href="https://papers.nips.cc/paper/2020/file/e1228be46de6a0234ac22ded31417bc7-Paper.pdf">
        <p>
          Multi-Task Temporal Shift Attention Networks for On-Device Contactless
          Vitals Measurement
        </p>
      </a>
    </b>
    <a href="https://homes.cs.washington.edu/~xliu0/">Xin Liu, </a>
    <a href="https://www.jwfromm.com/">Josh Fromm, </a>
    <a href="https://homes.cs.washington.edu/~shwetak/">Shwetak Patel, </a>
    <a href="https://www.microsoft.com/en-us/research/people/damcduff/">
     Daniel McDuff
    </a>
    <a href="https://github.com/xliucs/MTTS-CAN">
      <h4>View source code</h4>
    </a>
    <a href="https://papers.nips.cc/paper/2020/file/e1228be46de6a0234ac22ded31417bc7-Paper.pdf">
      <h4>Download PDF</h4>
    </a>
  </div>
);

export default Research;
