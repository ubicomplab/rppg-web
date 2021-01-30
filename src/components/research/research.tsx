import React from 'react';
import styles from './research.module.scss';

const Research = () => (
  <div className={styles.ResearchSection}>
    <h3>
      <b>Research Paper</b>
    </h3>
    <b>
      <p>
        Multi-Task Temporal Shift Attention Networks for On-Device Contactless
        Vitals Measurement
      </p>
    </b>
    <a href="https://homes.cs.washington.edu/~xliu0/">Xin Liu, </a>
    <a href="https://www.jwfromm.com/">Josh Fromm, </a>
    <a href="https://homes.cs.washington.edu/~shwetak/">Shwetak Patel, </a>
    <a href="https://www.microsoft.com/en-us/research/people/damcduff/">
     Daniel McDuff
    </a>
    <a href="https://papers.nips.cc/paper/2020/file/e1228be46de6a0234ac22ded31417bc7-Paper.pdf">
      <h3>Download PDF</h3>
    </a>
  </div>
);

export default Research;
