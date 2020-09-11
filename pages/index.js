import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { browser } from '@tensorflow/tfjs';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';
import TensorStore from '../ultils/tensorStore';
import PreProcess from '../ultils/preProcess';

const Home = () => {
  const webcamRef = React.useRef(null);
  const [interValeId, setIntervalId] = useState(null);
  const [consumeIntervalId, setConsumeIntervalId] = useState(null);
  const [isRecording, setRecording] = useState(false);
  const tensorStore = new TensorStore();
  const preprocess = new PreProcess(tensorStore);

  useEffect(
    () => () => {
      clearInterval(interValeId);
      clearInterval(consumeIntervalId);
    },
    [interValeId]
  );

  const handleRecording = () => {
    if (!isRecording) {
      const id = setInterval(capture, 20);
      const cId = setInterval(comsume, 500);
      setIntervalId(id);
      setConsumeIntervalId(cId);
    } else {
      clearInterval(interValeId);
      clearInterval(consumeIntervalId);
    }
    setRecording(!isRecording);
  };

  const capture = () => {
    if (webcamRef) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc === null) return;
      const img = new Image(36, 36);
      img.src = imageSrc;
      const origV = browser.fromPixels(img);
      tensorStore.addTensor(origV);
      preprocess.compute(tensorStore.getTensor());
    }
  };

  const comsume = () => {
    tensorStore.getTensor();
  };

  return (
    <>
      <Head>
        <title>RPPG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.contentContainer}>
        <Research />
        {isRecording && (
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        )}
        <button
          className={styles.recordingButton}
          onClick={handleRecording}
          type="button"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </>
  );
};

export default Home;
