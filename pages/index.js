import React from 'react';
import Head from 'next/head';
import Header from '../components/header';
import Research from '../components/research';

export default function Home() {
  return (
    <div>
      <Head>
        <title>RPPG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Research />
    </div>
  );
}
