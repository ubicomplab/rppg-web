import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { ChartDataSets } from 'chart.js';
import { image, browser, tidy, dispose } from '@tensorflow/tfjs';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';
import tensorStore from '../lib/tensorStore';
import Preprocessor from '../lib/preprocessor';
import Posprocessor from '../lib/posprocessor';

const postprocessor = new Posprocessor(tensorStore);
const preprocessor = new Preprocessor(tensorStore, postprocessor);

const config: ChartDataSets = {
  fill: false,
  lineTension: 0.1,
  borderDash: [],
  borderDashOffset: 0.0,
  pointRadius: 0
};

type GraphProps = {
  labels: string[];
  rppg: number[];
  resp: number[];
};

const Home = () => {
  const webcamRef = React.useRef<any>(null);
  const intervalId = React.useRef<NodeJS.Timeout>();
  const plotIntervalId = React.useRef<NodeJS.Timeout>();
  const [isRecording, setRecording] = useState(false);
  const [charData, setCharData] = useState<GraphProps>({
    labels: [],
    rppg: [],
    resp: []
  });

  useEffect(
    () => () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    },
    [intervalId]
  );

  useEffect(
    () => () => {
      preprocessor.stopProcess();
      // postprocessor.stopProcess();
      tensorStore.reset();
    },
    []
  );

  const handleRecording = async () => {
    if (!isRecording) {
      await postprocessor.loadModel();
      intervalId.current = setInterval(capture, 30);
      plotIntervalId.current = setInterval(plotGraph, 30);
      preprocessor.startProcess();
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      if (plotIntervalId.current) {
        clearInterval(plotIntervalId.current);
      }
      preprocessor.stopProcess();
      tensorStore.reset();
      setCharData({ labels: [], resp: [], rppg: [] });
    }
    setRecording(!isRecording);
  };

  const capture = React.useCallback(() => {
    if (webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc === null) return;
      const img = new Image(480, 640);

      img.src = imageSrc;
      img.onload = () => {
        const origVExpand: any = tidy(() =>
          browser.fromPixels(img).expandDims(0)
        );
        const crop = image.cropAndResize(
          origVExpand,
          [[0.1, 0.3, 0.56, 0.7]],
          [0],
          [36, 36],
          'bilinear'
        );
        dispose(origVExpand);
        const origV: any = crop.reshape([36, 36, 3]);
        tensorStore.addRawTensor(origV);
      };
    }
  }, [webcamRef]);

  const plotGraph = () => {
    const pltData = tensorStore.getPltData();
    if (pltData) {
      const [rppg, resp] = pltData;
      const now = new Date();
      const newLabels =
        charData.labels.length >= 360
          ? charData.labels.slice(1)
          : charData.labels;
      newLabels.push(
        `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
      );

      const newRppg =
        charData.rppg.length >= 360 ? charData.rppg.slice(1) : charData.rppg;
      newRppg.push(rppg);

      const newResp =
        charData.resp.length >= 360 ? charData.resp.slice(1) : charData.resp;
      newResp.push(resp);
      setCharData({
        labels: newLabels,
        rppg: newRppg,
        resp: newResp
      });
    }
  };

  const plotData = {
    labels: charData.labels,
    datasets: [
      {
        ...config,
        label: 'Pulse',
        borderColor: 'red',
        data: charData.rppg
      } // ,
      // {
      //   ...config,
      //   label: 'resp',
      //   borderColor: 'green',
      //   data: charData.resp
      // }
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
        <button
          className={styles.recordingButton}
          onClick={handleRecording}
          type="button"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <div className={styles.innerContainer}>
            <div className={styles.webcam}>
              <Webcam
                width={500}
                height={500}
                mirrored
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
            </div>
            <Line
              data={plotData}
              width={1200}
              height={300}
              options={{
                responsive: false,
                animation: {
                  duration: 0
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        suggestedMin: -5,
                        suggestedMax: 5,
                        display: false
                      }
                    }
                  ],
                  xAxes: [
                    {
                      ticks: {
                        display: false
                      }
                    }
                  ]
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
