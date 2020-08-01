import numpy as numpy
import cv2
from skimage.util import img_as_float


def DeepPhysPreprocessing(videoFilePath, saveFileName, dim):
# load parameters
startTime = 1
endTime = 12
dataURL = videoFilePath

L = dim # 36
t = []
i = 1

print(dataURL)
vidObj = cv2.videoCapture(dataURL);
totalFrames = int(vidObj.get(cv2.CAP_PROP_FRAME_COUNT)) # get total frame size
print(totalFrames)
Xsub = np.zeros((totalFrames, L, L, 3), dtype = np.float32)
height = vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
width = vid.get(cv2.CAP_PROP_FRAME_WIDTH)


success, img = vidObj.read()
fno = 0
while success:
	do_something(img)
	t.append(vidObj.CAP_PROP_POS_MSEC) # current timestamp in milisecond 
	vidLxL = cv2.resize(img_as_float(img[height/2 - width/2 + 1 : width/2 + height/2, :, :]), 
		(L, L)
	vidLxL[a > 1] = 1
	vidLxL[a < 1/255] = 1/255
	Xsub[i, :, :, :] = vidLxl
	success, img = vidObj.read() # read the next one
	i = i + 1


dXsub = np.zeros((len(t) - 1, L, L, 3), dtype = np.float32)
for j in range(1, len(t) - 1):
	dXsub[j, :, :, :] = (Xsub[j+1, :, :, :] - Xsub[j, :, :, :]) / (Xsub[j+1, :, :, :] + Xsub[j, :, :, :])


dXsub = dXsub / np.std(dXsub, ddof=1)
Xsub = Xsub - Xsub.mean(axis = 0)
Xsub = Xsub  / np.std(Xsub, ddof=1)


dXsub = np.concatenate(dXsub, Xsub[1:, :, :, :]);