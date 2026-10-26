<template>
  <div class="scanner">
    <!--<div class="controls">
        <fieldset class="input-group">
            <button class="stop" @click="closeScanner()">Stop</button>
        </fieldset>
        <fieldset class="reader-config-group">
            <label>
                <span>Camera:</span>
                <select name="input-stream_constraints" id="deviceSelection">
                </select>
            </label>
        </fieldset>
    </div>
    <div class="row" id="result_strip">
		<label for="isbn_input" class="col-12">Barcode:</label>
        <input id="isbn_input" class="isbn col-12" type="text" v-model="scannedItem"/>
		<div class="col-12">
			<b-button @click="addItemToCart()">Voeg toe</b-button>
		</div>
    </div>
    <div id="interactive" class="viewport"></div>-->
	
	<div>
		<div v-if="foundCodes" class="level">
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">{{foundCodes.type}}</p>
					<p class="title">{{foundCodes.code}}</p>
				</div>
			</div>
		</div>
		<nav class="level" role="navigation" aria-label="main navigation">
			<div v-show="!scannerActive" class="level-item">
				<a @click="start" class="button">Start Scanner</a>
			</div>

			<div v-show="scannerActive" class="level-item">
				<a @click="stop" class="button">Stop Scanner</a>
			</div>
		</nav>
		<div id="videoWindow" class="video"></div>
	</div>	
  </div>
</template>


<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
<script>
import Quagga from "quagga";
import $ from 'jquery'
import cart from '../cart'


export default {

  name: 'Scanner',

  data: function() {

    return {
		scannedItem: null,
		scannerActive: false,
		foundCodes: null
    }

  },

	mounted: function() {
		this.startScanner()
		
		
		Quagga.onDetected((data) => {
			console.log(data);
			const foundResult = data[0];
			const foundCode = {
				code: foundResult.codeResult.code,
				type: foundResult.codeResult.format
			};
			console.log(foundCode);
			alert(foundCode);
			this.foundCodes = foundCode;
			this.$emit("found", foundCode);
		});
	},

	created: function() {
	},

	destroyed: function() {
	},
  methods:{
		updateItem: function(item){
			this.scannedItem = item;
		},
		addItemToCart: function(){
			if(!this.scannedItem){
				var code = document.querySelector('input.isbn').value
				cart.addItemByEan(code)
			}
			else{
				cart.addItemByEan(this.scannedItem)
			}
		},
		closeScanner: function(){
			Quagga.stop()
			this.$parent.scanning = false
		},
		onBarcodeScanned (barcode) {
			console.log(barcode)
			alert(barcode)
		},
		startScanner: function(){
		this.scannerActive = true;
			const config = {
				locate: true,
				inputStream: {
					name: "live",
					type: "LiveStream",
					target: document.querySelector("#videoWindow"),
					size: 800,
					area: { // defines rectangle of the detection/localization area
						top: "0%",    // top offset
						right: "0%",  // right offset
						left: "0%",   // left offset
						bottom: "0%"  // bottom offset
					}
				},
				decoder: {
					readers: ["ean_reader", 'code_128_reader'],
					multiple: true
				},
				locator: {
					halfSample: false,
					patchSize: "medium"
				},
				numOfWorkers: 2
			};
			Quagga.init(config, err => {
				if (err) {
					console.log(err);
					return;
				}
				console.log("initialization complete");
				Quagga.start()
			});
		},
		stopScanner: function(){
			this.scannerActive = false;
			Quagga.stop();
		}
	}
};

</script>

<style scoped>
.scanner{
    border: 2px solid #ffa500;
    box-shadow: 4px 5px 4px 0px rgba(0,0,0,0.3);
    background-color: #dddddd;
}

.controls{
    display: inline-flex;
    width:100%;
}
.controls fieldset.input-group{
    width: 30%;
    margin:5px 10px;  
}
#result_strip{
    margin-left: auto;
    margin-right: auto;
    width: 80%;
}

button{      
    margin-top: 5px;
	border-radius: 5px;
	background: #ffffff;
	-webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 4px 4px 3px 0px rgba(0,0,0,0.4);
	color:#ee151e;
    border: 2px solid #ffa500;
} 
.controls fieldset.reader-config-group{
    width: 70%;
    text-align:left;
    margin:10px
}
.controls fieldset.reader-config-group span{
    text-align:left;
    width: 40%;
}
.controls fieldset.reader-config-group select{
    text-align:left;
    width: 60%;
}
</style>

<style >
.video {
  width: 100%;
}
.collapsable-source pre {
    font-size: small;
}

.input-field {
    display: flex;
    align-items: center;
    width: 260px;
}

.input-field label {
    flex: 0 0 auto;
    padding-right: 0.5rem;
}

.input-field input {
    flex: 1 1 auto;
    height: 20px;
}

.input-field button {
    flex: 0 0 auto;
    height: 28px;
    font-size: 20px;
    width: 40px;
}

.icon-barcode {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTTAgNGg0djIwaC00ek02IDRoMnYyMGgtMnpNMTAgNGgydjIwaC0yek0xNiA0aDJ2MjBoLTJ6TTI0IDRoMnYyMGgtMnpNMzAgNGgydjIwaC0yek0yMCA0aDF2MjBoLTF6TTE0IDRoMXYyMGgtMXpNMjcgNGgxdjIwaC0xek0wIDI2aDJ2MmgtMnpNNiAyNmgydjJoLTJ6TTEwIDI2aDJ2MmgtMnpNMjAgMjZoMnYyaC0yek0zMCAyNmgydjJoLTJ6TTI0IDI2aDR2MmgtNHpNMTQgMjZoNHYyaC00eiI+PC9wYXRoPjwvc3ZnPg==);
}

.overlay {
    overflow: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}



.overlay__content {
    top: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 90%;
    max-width: 800px;
}



.overlay__close {
    position: absolute;
    right: 0;
    padding: 0.5rem;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    background-color: white;
    cursor: pointer;
    border: 3px solid black;
    font-size: 1.5rem;
    margin: -1rem;
    border-radius: 2rem;
    z-index: 100;
    box-sizing: content-box;
}

.overlay__content video {
    width: 100%;
    height: 100%;
}

.overlay__content canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}

#interactive.viewport {
    position: relative;
}

#interactive.viewport > canvas, #interactive.viewport > video {
    max-width: 100%;
    width: 100%;
}

canvas.drawing{
    position: absolute;
    left: 0;
    top: 0;
}
.drawingBuffer {
    position: absolute;
    left: 0;
    top: 0;
}

/* line 16, ../sass/_viewport.scss */
.controls fieldset {
  border: none;
}
/* line 19, ../sass/_viewport.scss */
.controls .input-group {
  float: left;
}
/* line 21, ../sass/_viewport.scss */
.controls .input-group input, .controls .input-group button {
  display: block;
}
/* line 25, ../sass/_viewport.scss */
.controls .reader-config-group {
  float: right;
}
/* line 28, ../sass/_viewport.scss */
.controls .reader-config-group label {
  display: block;
}
/* line 30, ../sass/_viewport.scss */
.controls .reader-config-group label span {
  width: 11rem;
  display: inline-block;
  text-align: right;
}
/* line 37, ../sass/_viewport.scss */
.controls:after {
  content: '';
  display: block;
  clear: both;
}

/* line 22, ../sass/_viewport.scss */
#result_strip {
  margin: 10px 0;
  border-top: 1px solid #EEE;
  border-bottom: 1px solid #EEE;
  padding: 10px 0;
}
/* line 28, ../sass/_viewport.scss */
#result_strip ul.thumbnails {
  padding: 0;
  margin: 0;
  list-style-type: none;
  width: auto;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
/* line 37, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li {
  display: inline-block;
  vertical-align: middle;
  width: 160px;
}
/* line 41, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail {
  padding: 5px;
  margin: 4px;
  border: 1px dashed #CCC;
}
/* line 46, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail img {
  max-width: 140px;
}
/* line 49, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail .caption {
  white-space: normal;
}
/* line 51, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail .caption h4 {
  text-align: center;
  word-wrap: break-word;
  height: 40px;
  margin: 0px;
}
/* line 61, ../sass/_viewport.scss */
#result_strip ul.thumbnails:after {
  content: "";
  display: table;
  clear: both;
}

@media (max-width: 603px) {
  /* line 2, ../sass/phone/_core.scss */
  #container {
    margin: 10px auto;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
@media (max-width: 603px) {
  /* line 5, ../sass/phone/_viewport.scss */
  #interactive.viewport {
    width: 100%;
    height: auto;
    overflow: hidden;
  }

  /* line 20, ../sass/phone/_viewport.scss */
  #result_strip {
    margin-top: 5px;
    padding-top: 5px;
  }

  #result_strip ul.thumbnails {
    width: 100%;
    height: auto;
  }

  /* line 24, ../sass/phone/_viewport.scss */
  #result_strip ul.thumbnails > li {
    width: 150px;
  }
  /* line 27, ../sass/phone/_viewport.scss */
  #result_strip ul.thumbnails > li .thumbnail .imgWrapper {
    width: 130px;
    height: 130px;
    overflow: hidden;
  }
  /* line 31, ../sass/phone/_viewport.scss */
  #result_strip ul.thumbnails > li .thumbnail .imgWrapper img {
    margin-top: -25px;
    width: 130px;
    height: 180px;
  }
}

#videoWindow {
   width: 50vw;
   height: 50vh;
   background: black;
   position: relative;
   display: flex;
   align-items: center;
}
canvas,
video {
	position: absolute;
	width: 100%;
	height: auto;
}
</style>