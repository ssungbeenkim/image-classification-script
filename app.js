// node app.js [folder name in Pictures]
const path = require('path');
const fs = require('fs');
const os = require('os');

const folder = process.argv[2]; // folder name
const workingDir = path.join(os.homedir(), 'Pictures', folder);
if (!folder || !fs.existsSync(workingDir)) {
  console.error('Please enter folder name in Pictures');
}

const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated'); // path 만들기
!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir); // 만든 path로 디렉토리 생성

fs.promises.readdir(workingDir).then(processFiles).catch(console.error);
// readdir로 배열의 형태로 파일 이름들을 받아온다.

function processFiles(files) {
  files.forEach((file) => {
    if (isVideoFile(file)) {
      move(file, videoDir);
    } else if (isCapturedFile(file)) {
      move(file, capturedDir);
    } else if (isDuplicatedFile(files, file)) {
      move(file, duplicatedDir);
    }
  });
}

function isVideoFile(file) {
  const regExp = /(mp4|mov)$/gm;
  const match = file.match(regExp);
  return !!match;
}
function isCapturedFile(file) {
  const regExp = /(png|aae)$/gm;
  const match = file.match(regExp);
  return !!match;
}
function isDuplicatedFile(files, file) {
  // IMG_XXXX -> IMG_EXXXX
  if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
    return false;
  }
  const editted = `IMG_E${file.split('_')[1]}`;
  const found = files.find((v) => v.includes(editted));
  return !!found;
}

function move(file, targetDir) {
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises
    .rename(oldPath, newPath)
    .then(console.info(`move ${file} to ${path.basename(targetDir)}`))
    .catch(console.log);
}
