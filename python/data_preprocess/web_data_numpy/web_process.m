%% This file is used for 

%% Crop images
L = 36;
Xsub = zeros(20,L,L,3,'single');
height = 640;
width = 480;

for i = 1:20
    vidFrame = int16(squeeze(data(i, :, :, :)));
    size(vidFrame)
    vidLxL = imresize(im2single(vidFrame(:,height/2-width/2+1:width/2+height/2,:)),[L,L]);
    vidLxL(vidLxL>1) = 1;
    vidLxL(vidLxL<1/255) = 1/255; 
    Xsub(i,:,:,:) = vidLxL;
end
% figure,imshow(uint8(imresize(vidFrame(vidObj.Height/2-vidObj.Width/2+1:vidObj.Width/2+vidObj.Height/2,:,:),[L,L])));

%% Difference
dXsub = zeros(19,L,L,3,'single');
for i = 1:19
    dXsub(i,:,:,:)=(Xsub(i+1,:,:,:)-Xsub(i,:,:,:))./(Xsub(i+1,:,:,:)+Xsub(i,:,:,:));
end

%% Normalization
dXsub = dXsub/std(dXsub(:));
Xsub = Xsub - mean(Xsub(:));
Xsub = Xsub/std(Xsub(:));

%% Concat
dXsub = cat(4,dXsub,Xsub(1:end-1,:,:,:));

%% Save
save(['matlab_web', '.mat'],'dXsub');

