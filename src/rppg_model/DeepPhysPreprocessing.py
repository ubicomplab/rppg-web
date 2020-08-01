import numpy as np
import cv2
from skimage.util import img_as_float
import matplotlib.pyplot as plt
import time
!pip install ffmpeg
import ffmpeg

def DeepPhysPreprocessing(videoFilePath, dim):

    # load parameters
    start_time = time.time()
    dataURL = videoFilePath

    L = dim # 36
    t = []
    i = 1

    print(dataURL)
    vidObj = cv2.VideoCapture(dataURL);   
    totalFrames = int(vidObj.get(cv2.CAP_PROP_FRAME_COUNT)) # get total frame size
    print(totalFrames)
    Xsub = np.zeros((totalFrames + 1, L, L, 3), dtype = np.float32)
    height = vidObj.get(cv2.CAP_PROP_FRAME_HEIGHT)
    width = vidObj.get(cv2.CAP_PROP_FRAME_WIDTH)

    print("height", height)
    print("width", width)

    success, img = vidObj.read()
    dims = img.shape
    print(dims[0])  #height
    print(dims[1])  # width
    print(dims[2]) # channels

    #plt.imshow(img)
    plt.imshow(cv2.flip(img, 0))

    while success:
      t.append(vidObj.get(cv2.CAP_PROP_POS_MSEC))# current timestamp in milisecond 
      time_cur = time.time()
      vidLxL = cv2.resize(img_as_float(img[:, int(width/2) - int(height/2 + 1) : int(height/2) + int(width/2), :]), (L, L))
      plt.imshow(cv2.rotate(vidLxL, cv2.ROTATE_90_CLOCKWISE))
      vidLxL[vidLxL > 1] = 1
      vidLxL[vidLxL < (1/255)] = 1/255
      Xsub[i, :, :, :] = vidLxL
      success, img = vidObj.read() # read the next one
      i = i + 1
    
    time_cur = time.time()
    dXsub = np.zeros((len(t) - 1, L, L, 3), dtype = np.float32)
    for j in range(1, len(t) - 1):
      dXsub[j, :, :, :] = (Xsub[j+1, :, :, :] - Xsub[j, :, :, :]) / (Xsub[j+1, :, :, :] + Xsub[j, :, :, :])
    print(time.time()-time_cur)
    print(np.shape(dXsub))
    print(np.shape(Xsub))
    dXsub = dXsub / np.std(dXsub, ddof=1)
    Xsub = Xsub - Xsub.mean(axis = 0)
    Xsub = Xsub  / np.std(Xsub, ddof=1)

    Xsub = Xsub[1:totalFrames, :, :, :]
    dXsub = np.concatenate((dXsub, Xsub), axis = 3);
    print(time.time() - start_time)
    print(dXsub.shape)
    return dXsub