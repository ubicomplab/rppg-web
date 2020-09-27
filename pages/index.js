import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';
import tensorStore from '../lib/tensorStore';
import Preprocessor from '../lib/preprocessor';
// import PreProcess from '../ultils/preProcess';
// import PostProcess from '../ultils/postProcess';
// import AttentionMask from '../ultils/AttentionMask';
// import TSM from '../ultils/TSM';

// const path = 'model.json';
// let model = null;

const preprocessor = new Preprocessor(tensorStore);

const Home = () => {
  const webcamRef = React.useRef(null);
  const [interValeId, setIntervalId] = useState(null);
  const [isRecording, setRecording] = useState(false);
  // const preprocess = new PreProcess();
  // const postprocess = new PostProcess();
  // const batchSize = 20;
  // tf.serialization.registerClass(TSM);
  // tf.serialization.registerClass(AttentionMask);

  useEffect(
    () => () => {
      clearInterval();
    },
    [interValeId]
  );

  useEffect(
    () => () => {
      preprocessor.stopProcess();
    },
    []
  );
  // const getModel = async modelPath => {
  //   model = await tf.loadLayersModel(modelPath);
  //   console.log('successfully loaded ml model');
  // };

  // const getPrediction = async input => {
  //   const prediction = await model.predict(input);
  //   postprocess.compute(prediction);
  //   return prediction;
  // };

  const handleRecording = () => {
    if (!isRecording) {
      const id = setInterval(capture, 20);
      setIntervalId(id);
      preprocessor.startProcess();
    } else {
      clearInterval(interValeId);
      preprocessor.stopProcess();
    }
    setRecording(!isRecording);
  };

  const capture = () => {
    if (webcamRef) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc === null) return;
      const img = new Image(36, 36);
      img.src = imageSrc;
      const origV = tf.browser.fromPixels(img);
      tensorStore.addRawTensor(origV);

      // preprocess.compute(tensorStore.getTensor());

      // if (preprocess.getCounter() === batchSize) {
      //   const batch = preprocess.getBatch();
      //   preprocess.clear();
      //   getPrediction(batch);
      // }
    }
  };

  // const comsume = () => {
  //   tensorStore.getTensor();
  // };

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
