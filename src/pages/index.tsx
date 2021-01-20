import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Head from 'next/head';
import Webcam from 'react-webcam';
import { ChartDataSets } from 'chart.js';
import {
  image,
  browser,
  tidy,
  dispose,
  cumsum,
  reshape
} from '@tensorflow/tfjs';
import Fili from 'fili';
import Header from '../components/header';
import Research from '../components/research';
import styles from '../styles/Home.module.scss';
import tensorStore from '../lib/tensorStore';
import Preprocessor from '../lib/preprocessor';
import Posprocessor from '../lib/posprocessor';
import { BATCHSIZE } from '../constant';

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
};

const Home = () => {
  const webcamRef = React.useRef<any>(null);
  const intervalId = React.useRef<NodeJS.Timeout>();
  const coutdownIntervalId = React.useRef<NodeJS.Timeout>();
  const [isRecording, setRecording] = useState(false);
  const [charData, setCharData] = useState<GraphProps>({
    labels: [],
    rppg: []
  });
  const refCountDown = React.useRef(30);
  const [countDown, setCountDown] = useState(30);

  useEffect(
    () => () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      if (coutdownIntervalId.current) {
        clearInterval(coutdownIntervalId.current);
      }
    },
    []
  );

  useEffect(
    () => () => {
      preprocessor.stopProcess();
      // postprocessor.stopProcess();
      tensorStore.reset();
    },
    []
  );

  const startRecording = async () => {
    await postprocessor.loadModel();
    intervalId.current = setInterval(capture, 30);
    coutdownIntervalId.current = setInterval(() => {
      setCountDown(prevCount => prevCount - 1);
      refCountDown.current -= 1;
      if (refCountDown.current === 0) {
        plotGraph();
        stopRecording();
      }
    }, 1000);
    setRecording(true);
    preprocessor.startProcess();
  };

  const stopRecording = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    if (coutdownIntervalId.current) {
      clearInterval(coutdownIntervalId.current);
    }
    preprocessor.stopProcess();
    tensorStore.reset();
    setCountDown(30);
    refCountDown.current = 30;
    setRecording(false);
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
    const pltData = tensorStore.rppgPltData;
    const iirCalculator = new Fili.CalcCascades();
    const iirFilterCoeffs = iirCalculator.bandpass({
      order: 1, // cascade 3 biquad filters (max: 12)
      characteristic: 'butterworth',
      Fs: 30, // sampling frequency
      Fc: 1.625, // (2.5-0.75) / 2 + 0.75, 2.5 --> 150/60, 0.75 --> 45/60
      BW: 1.75, // 2.5 - 0.75 = 1.75
      gain: 0, // gain for peak, lowshelf and highshelf
      preGain: false // adds one constant multiplication for highpass and lowpass
    });
    const iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    if (pltData) {
      const rppgCumsum = cumsum(reshape(pltData, [-1, 1]), 0).dataSync();
      const result = iirFilter
        .filtfilt(rppgCumsum)
        .slice(0, rppgCumsum.length - BATCHSIZE);
      const labels = Array.from(pltData.keys()).map(i => i.toString());
      setCharData({
        labels,
        rppg: result
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
        <p>{countDown}</p>
        {!isRecording && (
          <button
            className={styles.recordingButton}
            onClick={startRecording}
            type="button"
          >
            Start Recording
          </button>
        )}
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
          <div>
            {!isRecording && !!charData.rppg.length && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
