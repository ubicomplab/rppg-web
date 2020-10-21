import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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

const config = {
  label: 'My First dataset',
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'rgba(75,192,192,0.4)',
  borderColor: 'rgba(75,192,192,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgba(75,192,192,1)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10
};

const Home = () => {
  const webcamRef = React.useRef(null);
  const intervalId = React.useRef(null);
  const plotIntervalId = React.useRef(null);
  const [isRecording, setRecording] = useState(false);
  const [charData, setCharData] = useState({
    labels: [],
    data: []
  });

  useEffect(
    () => () => {
      clearInterval(intervalId.current);
    },
    [intervalId]
  );

  useEffect(
    () => () => {
      preprocessor.stopProcess();
      postprocessor.stopProcess();
      tensorStore.reset();
    },
    []
  );

  const handleRecording = () => {
    if (!isRecording) {
      intervalId.current = setInterval(capture, 30);
      plotIntervalId.current = setInterval(plotGraph, 100);
      preprocessor.startProcess();
      postprocessor.startProcess();
    } else {
      clearInterval(intervalId.current);
      clearInterval(plotIntervalId.current);
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
      img.onload = () => {
        const origV = browser.fromPixels(img);
        tensorStore.addRawTensor(origV);
      };
    }
  }, [webcamRef]);

  const plotGraph = () => {
    const dataPoint = tensorStore.getRppgPltData();
    if (dataPoint) {
      const now = new Date();
      const newLabels =
        charData.labels.length >= 60
          ? charData.labels.slice(1)
          : charData.labels;
      newLabels.push(
        `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
      );

      const newData =
        charData.data.length >= 60 ? charData.data.slice(1) : charData.data;
      newData.push(dataPoint);

      setCharData({
        labels: newLabels,
        data: newData
      });
    }
  };

  const plotData = {
    labels: charData.labels,
    datasets: [
      {
        ...config,
        data: charData.data
      }
    ]
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
        <Line
          data={plotData}
          options={{
            animation: {
              duration: 0
            }
          }}
        />
      </div>
    </>
  );
};

export default Home;
