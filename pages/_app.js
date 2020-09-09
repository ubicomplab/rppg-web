import React from 'react';
import PropTypes from 'prop-types';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.object
};

export default MyApp;
