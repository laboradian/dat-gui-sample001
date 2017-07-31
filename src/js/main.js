/* global dat */
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
import 'babel-polyfill'

//import _ from 'lodash'

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');

// JS ファイルをコピーする
require('file-loader?name=../../dist/js/[name].[ext]!../../node_modules/dat.gui/build/dat.gui.min.js');

// 画像ファイルをコピーする
require('file-loader?name=../../dist/img/[name].[ext]!../img/icon.png');

console.log('%c 🌈 Laboradian.com 🌈 %c http://laboradian.com ',
  'background: #2383BF; color: #fff; font-size: 1.4em;',
  'background: #e3e3e3; color: #000; margin-bottom: 1px; padding-top: 4px; padding-bottom: 1px;');


class ImageController {
  constructor() {
    this.x = 150;
    this.y = 150;
    this.scale = 1;
    this.speed = 1;
    this.directionRotation = '0';
  }
}

window.addEventListener('load', () => {

  const canvas = document.querySelector('#screen');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  const imgController = new ImageController();
  const gui = new dat.GUI();
  document.querySelector('#lr-dat-container').appendChild(gui.domElement);

  gui.add(imgController, 'x', 0, 300);
  gui.add(imgController, 'y', 0, 300);
  gui.add(imgController, 'scale', 0.5, 2);
  gui.add(imgController, 'speed', 0.1, 20);
  gui.add(imgController, 'directionRotation', {'時計回り': 0, '反時計回り': 1});// 0と1は文字列として扱われる

  const TO_RADIANS = Math.PI/180;
  const drawRotatedImage = (image, x, y, angle = 0, scale = 1) => {
    scale = 1/scale;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * TO_RADIANS);
    //ctx.drawImage(image, -(image.width/2), -(image.height/2));
    ctx.drawImage(image, 0, 0, image.width, image.height,
      -(image.width/(2 * scale)), -(image.height/(2 * scale)), image.width/scale, image.height/scale);
    ctx.restore();
  }

  const img = new Image();
  img.addEventListener('load', () => {

    let angle = 0;
    let sign = 1;
    const loop = (/*timestamp*/) => {
      ctx.clearRect(0, 0, 300, 300);

      // 0 or 1 は文字列として取得される
      if (imgController.directionRotation === '0') {
        sign = 1;
      } else {
        sign = -1;
      }
      angle = angle + (sign * imgController.speed);

      drawRotatedImage(img, imgController.x, imgController.y, angle, imgController.scale);
      if (angle > 360) angle = 0;

      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);

  });
  img.src = 'img/icon.png';
});
