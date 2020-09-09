import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { browser } from '@tensorflow/tfjs';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';

const Home = () => {
  const webcamRef = React.useRef(null);
  const [interValeId, setIntervalId] = useState(null);
  const [isRecording, setRecording] = useState(false);

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
      const img = new Image(36, 36);
      img.src = imageSrc;
      const origV = browser.fromPixels(img);
      console.log(origV);
    }
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
