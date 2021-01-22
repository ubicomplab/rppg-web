# Multi-Task Temporal Shift Attention Networks for On-Device Contactless Vitals Measurement


This respository is a web form demo for the research paper [Multi-Task Temporal Shift Attention Networks for On-Device Contactless Vitals Measurement](https://papers.nips.cc/paper/2020/file/e1228be46de6a0234ac22ded31417bc7-Paper.pdf). The paper is accepted in NeurIPS 2020.



## Demo

You can visit the website link [here](https://vitals.cs.washington.edu/) to see the live demo.

Instructions:
1. Please allow the camera access
2. After that, we suggest you to put your face inside the red square
3. The result will be shown after 30 seconds.

## Run in local

First, install the pacakges:
```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Docker

```bash
docker build -t web-rppg .
```
