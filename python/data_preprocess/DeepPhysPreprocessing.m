%% This file is used for 

function DeepPhysPreprocessing(videoFilePath, saveFileName, dim)

%% Load parameters
startTime = 1;
endTime = 5;
dataURL = videoFilePath;
%% Crop images
L = dim; %36;
t = [];
i = 1;
disp(dataURL)
vidObj = VideoReader(dataURL);
vidObj.CurrentTime = startTime;
disp(round(vidObj.FrameRate*(endTime-startTime)))
Xsub = zeros(round(vidObj.FrameRate*(endTime-startTime)),L,L,3,'single');

while hasFrame(vidObj) && (vidObj.CurrentTime <= endTime)
    vidFrame = readFrame(vidObj);
    t = [t vidObj.CurrentTime];
%     display(size(vidFrame))
%     display(vidObj.Height/2-vidObj.Width/2+1)
%     display(vidObj.Width/2+vidObj.Height/2)
    vidLxL = imresize(im2single(vidFrame(vidObj.Height/2-vidObj.Width/2+1:vidObj.Width/2+vidObj.Height/2,:,:)),[L,L]);
    vidLxL(vidLxL>1) = 1;
    vidLxL(vidLxL<1/255) = 1/255; 
    Xsub(i,:,:,:) = vidLxL;
    i=i+1;
end
% figure,imshow(uint8(imresize(vidFrame(vidObj.Height/2-vidObj.Width/2+1:vidObj.Width/2+vidObj.Height/2,:,:),[L,L])));

%% Difference
dXsub = zeros(length(t)-1,L,L,3,'single');
for i = 1:length(t)-1
    dXsub(i,:,:,:)=(Xsub(i+1,:,:,:)-Xsub(i,:,:,:))./(Xsub(i+1,:,:,:)+Xsub(i,:,:,:));
end

%% Normalization
dXsub = dXsub/std(dXsub(:));
Xsub = Xsub - mean(Xsub(:));
Xsub = Xsub/std(Xsub(:));

%% Concat
dXsub = cat(4,dXsub,Xsub(1:end-1,:,:,:));

%% Save
save([saveFileName, '.mat'],'dXsub','-v7.3');

