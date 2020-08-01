import tensorflow as tf
import numpy as np
import scipy.io
import os
import sys
sys.path.append('../../')
from model import DeepPhy_3DCNN, DeepPhysMix, Attention_mask, DeepPhys_TSM
import h5py

img_rows = 36
img_cols = 36
frame_depth = 10
sample_data_path = '/Users/xinliu/Google Drive/Research Projects/Visual PPG/on-device-rPPG/evaluation/pixel4/videos/sunshine.mat'
result_path = '/Users/xinliu/Google Drive/Research Projects/Visual PPG/on-device-rPPG/evaluation/pixel4'
model_checkpoint = '/Volumes/datasets/Results/NeurIPS2020/TSM/PPG_old/Split0/cv_0_last_model.hdf5'
batch_size = frame_depth * 10

f1 = h5py.File(sample_data_path, 'r')
dXsub = np.transpose(np.array(f1["dXsub"]))
dXsub_len = (dXsub.shape[0] // 10)  *10
dXsub = dXsub[:dXsub_len, :, :, :]

model = DeepPhys_TSM(frame_depth, 32, 64, (img_rows, img_cols, 3))
model.load_weights(model_checkpoint)

yptest = model.predict((dXsub[:, :, :, :3], dXsub[:, :, :, -3:]), batch_size=batch_size, verbose=1)
scipy.io.savemat(result_path + '/prediction_drsunshine' + '.mat',
             mdict={'yptest': yptest})
