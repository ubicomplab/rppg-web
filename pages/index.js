import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { browser } from '@tensorflow/tfjs';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';
import TensorStore from '../ultils/tensorStore';

const Home = () => {
  const webcamRef = React.useRef(null);
  const [interValeId, setIntervalId] = useState(null);
  const [isRecording, setRecording] = useState(false);
  const tensorStore = new TensorStore();

  useEffect(
    () => () => {
      clearInterval(interValeId);
    },
    [interValeId]
  );

  const handleRecording = () => {
    if (!isRecording) {
      const id = setInterval(capture, 20);
      setIntervalId(id);
    } else {
      clearInterval(interValeId);
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
      throttleConsume();
    }
  };

  /*
    use throttle to ensure constance consumption rate, and ensure postprocessing is in order
  */
  const throttleConsume = throttle(() => {
    // do postprocess here
    tensorStore.getTensor();
  }, 150);

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
