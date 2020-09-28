import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { browser } from '@tensorflow/tfjs';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';
import tensorStore from '../lib/tensorStore';
import Preprocessor from '../lib/preprocessor';
import Posprocessor from '../lib/posprocessor';

const preprocessor = new Preprocessor(tensorStore);
const postprocessor = new Posprocessor(tensorStore);

const Home = () => {
  const webcamRef = React.useRef(null);
  const [interValeId, setIntervalId] = useState(null);
  const [isRecording, setRecording] = useState(false);

  useEffect(
    () => () => {
      clearInterval();
    },
    [interValeId]
  );

  useEffect(
    () => () => {
      preprocessor.stopProcess();
      postprocessor.stopProcess();
      // tensorStore.reset();
    },
    []
  );

  const handleRecording = () => {
    if (!isRecording) {
      const id = setInterval(capture, 30);
      setIntervalId(id);
      preprocessor.startProcess();
    } else {
      clearInterval(interValeId);
      preprocessor.stopProcess();
      postprocessor.stopProcess();
      tensorStore.reset();
    }
    setRecording(!isRecording);
  };

  const capture = React.useCallback(() => {
    if (webcamRef) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc === null) return;
      const img = new Image(36, 36);
      img.src = imageSrc;
      const origV = browser.fromPixels(img);
      tensorStore.addRawTensor(origV);
    }
  }, [webcamRef]);

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
          <Webcam
            mirrored
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
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
