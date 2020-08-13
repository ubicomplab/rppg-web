<template>
  <div id="app">
	<p>RPPG (remote photoplethysmography)</p>
    <WebCam msg="RPPG (remote photoplethysmography)"/>
  </div>
</template>

<script>
import WebCam from './components/LandingPage.vue'

export default {
  name: 'App',
  components: {
    WebCam
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
