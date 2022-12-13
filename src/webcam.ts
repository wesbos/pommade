const webcam = document.querySelector<HTMLVideoElement>('.webcam');
const webcamSelect = document.querySelector<HTMLSelectElement>('[name="choose-cam"]');
const webcamCanvas = document.querySelector<HTMLCanvasElement>('.webcam-canvas');
const ctx = webcamCanvas?.getContext('2d');
const { ipcRenderer } = window;
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

async function init() {
  // first populate Webcams
  await populateVideo();
  await populateCams();
}

const populateVideo = async function (deviceId?: string) {
  if(!webcam) return;
  const sizes: MediaTrackConstraints = {
    width: { ideal: 3840 },
    height: { ideal: 2160 }
  }
  const options: MediaStreamConstraints = { video: sizes };
  if (deviceId) {
    options.video = {
      ...sizes,
      deviceId: { exact: deviceId },
    };
  }
  // check local storage for deviceId
  const savedDeviceId = localStorage.getItem('camera');
  if (!deviceId && savedDeviceId) {
    console.log('using saved device id', savedDeviceId)
    options.video = { ...sizes, deviceId: { exact: savedDeviceId } };
  }

  const stream = await navigator.mediaDevices.getUserMedia(options).catch();
  webcam.srcObject = stream;
  await webcam.play();

  console.log(appWindow)
  // Size it in Tauri
  if(appWindow) {
    const width = 960;
    const multiplier = width / webcam.videoWidth;
    appWindow.setSize(new LogicalSize(width, webcam.videoHeight * multiplier));
  }

  // Size it in Electron
  if(ipcRenderer) {
    ipcRenderer.send('video:play', {
      width: webcam.videoWidth,
      height: webcam.videoHeight
    });
  }
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
    webcamSelect?.appendChild(option);
  });
}

function handleWebCamChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  const deviceId = target.value;
  populateVideo(deviceId);
  // save it for next time
  localStorage.setItem('camera', deviceId);
}

webcamSelect?.addEventListener('change', handleWebCamChange);

init();
