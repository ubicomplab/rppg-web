<template>
	<div>
		<section>
			<header>
				<a href="http://www.washington.edu/">
					<img src="UWlogo3.png" alt="UW Logo" width="90" height="60" class="UW-logo">
				</a>
				<a href="http://www.washington.edu/">
					<img src="UWlogo2.png" alt="UW Logo" width="260" height="24" class="UW-text">
				</a>
			</header>
			<h3>Build by teams from</h3>
			<div class="flex-container">
				<div stype="flex-grow: 3" class="col-md-1"></div>
				<div style="flex-grow: 1">
					<a href="https://www.cs.washington.edu/">
						<img src="UWlogo1.png" alt="Paul G.Allen School of Computer Science & Engineering" width="400" height="80">
					</a>
				</div>
				<div stype="flex-grow: 3" class="col-md-1"></div>
			</div>
			<div class="center">
				<h3><b>Research Paper</b></h3>
				<b>
					<p>Multi-Task Temporal Shift Attention Networks for On-Device Contactless Vitals Measurement</p>
				</b>
				<i><a href="https://homes.cs.washington.edu/~xliu0/">Xin Liu</a>,
					<a href="https://www.jwfromm.com/">Josh Fromm</a>,
					<a href="https://homes.cs.washington.edu/~shwetak/">Shwetak Patel</a>,
					<a href="https://www.microsoft.com/en-us/research/people/damcduff/">Daniel McDuff</a></i><br>
				<br>
				<a href="NIPS2020_MTTS_CAN_preprint.pdf">
					<h3>Download PDF</h3>
				</a>
			</div>

			<section class="demo">
				<div style="width:800px; margin:0 auto;">
					<button class="button" onlick="run">Open the Webcam to Run the Demo!</button>
				</div>
			</section>

		</section>
		<div id="WebCam">
			<video autodisplay="true" height="400" width="400" id="video" alighn="center"></video>
		</div>
		<div id="chart_rppg"></div>
		<div id="chart_resp"></div>
		<footer>
			<a href="http://www.washington.edu/">
				<img src="UWlogo2.png" alt="UW Logo" width="260" height="24">
				<p style="font-size:0.6875rem; color:white">© 2020 University of Washington | Seattle, WA</p>
			</a>
		</footer>
	</div>
</template>

<script>
	import run from './sketch.js'

	export default {
		name: 'WebCam',
		props: {
			msg: String
		},
		mounted() {
			run();
		},
		methods: {}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	header {
		background-color: #330066;
		padding: 40px;
		text-align: center;
		font-size: 55px;
	}

	#images a {
		margin: 0px 20px;
		display: inline-block;
		text-decoration: none;
		color: black;
	}

	footer {
		background-color: #330066;
		padding: 40px;
		text-align: center;
		font-size: 55px;
		color: white;
	}

	.center {
		margin: auto;
		width: 60%;
		background-color: aliceblue;
		border: 3px solid #FFFFFF;
		padding: 10px;
	}

	.UW-logo {
		position: absolute;
		left: 200px;
		top: 30px;
	}

	.UW-text {
		position: absolute;
		left: 300px;
		top: 50px;
	}

	.flex-container {
		display: flex;
		height: 150px;
		align-items: center;
		background-color: #FFFFFF;
	}

	.flex-container>div {
		background-color: #FFFFFF;
		width: 100px;
		margin: 10px;
		text-align: center;
		line-height: 75px;
		font-size: 30px;
	}

	.logo {
		float: left;
	}

	.images {
		display: inline-block;
		float: left;
		margin: 30px;
		padding: 0px;
	}

	.demo {
		text-align: center;
		padding: 30px;
	}

	.button {
		background-color: #330066;
		/* Green */
		color: white;
		padding: 15px 32px;
		font-size: 16px;
		text-align: center;
	}

	.button:hover {
		background-color: darkgoldenrod;
	}
</style>
