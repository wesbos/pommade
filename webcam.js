const webcam = document.querySelector('.webcam');
const webcamSelect = document.querySelector('[name="choose-cam"]');

async function init() {
  // first populate Webcams
  await populateVideo();
  await populateCams();
}

async function populateVideo(deviceId) {
  const options = { video: true };
  if (deviceId) {
    options.video = { devi
  }
  // check local storage for deviceId
  const savedDeviceId = localStorage.getItem('camera');
  if (!deviceId && savedDeviceId) {
    options.video = { deviceId: { exact: savedDeviceId } };
  }

  const stream = await navigator.mediaDevices.getUserMedia(options).catch();
  webcam.srcObject = stream;
  await webcam.play();
}

async function populateCams() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const savedDeviceId = localStorage.getItem('camera');
  videoDevices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.text = device.label || device.deviceId;
    option.selected = savedDeviceId === device.deviceId;
    webcamSelect.appendChild(option);
  });
}


function handleWebCamChange() {
  const deviceId = this.value;
  populateVideo(deviceId);
  // save it for nextx time
  localStorage.setItem('camera', deviceId);
}

webcamSelect.addEventListener('change', handleWebCamChange);



init();