/**
 * A class to generate PNG ethereum "blockie" identicon
 *
 * @version 0.01
 * @author Harper <harper@modest.com>
 * @link https://effigy.im
 * @license https://opensource.org/licenses/MIT MIT License
 *
 * Mostly based on https://github.com/MyCryptoHQ/ethereum-blockies-base64
 *
 */

import PNGlib from './pnglib';
import hsl2rgb from './hsl2rgb';
import { rand, randomizeSeed } from './blockiesCommon';

interface BlockiesOptions {
  seed: string;
  size?: number;
  scale?: number;
  color?: [number, number, number];
  bgcolor?: [number, number, number];
  spotcolor?: [number, number, number];
}

function createColor(): [number, number, number] {
  const h = Math.floor(rand() * 360);
  const s = rand() * 60 + 40;
  const l = (rand() + rand() + rand() + rand()) * 25;

  return [h / 360, s / 100, l / 100];
}

function createImageData(size: number): number[] {
  const width = size;
  const height = size;

  const dataWidth = Math.ceil(width / 2);
  const mirrorWidth = width - dataWidth;

  const data: number[] = [];
  for (let y = 0; y < height; y++) {
    let row: number[] = [];
    for (let x = 0; x < dataWidth; x++) {
      row[x] = Math.floor(rand() * 2.3);
    }
    const r = row.slice(0, mirrorWidth).reverse();
    row = row.concat(r);

    for (let i = 0; i < row.length; i++) {
      data.push(row[i]);
    }
  }

  return data;
}

function buildOptions(opts: BlockiesOptions): BlockiesOptions {
  if (!opts.seed) {
    throw new Error('No seed provided');
  }

  randomizeSeed(opts.seed);

  return Object.assign(
    {
      size: 8,
      scale: 16,
      color: createColor(),
      bgcolor: createColor(),
      spotcolor: createColor(),
    },
    opts,
  );
}

function fillRect(
  png: PNGlib,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      png.buffer[png.index(x + i, y + j)] = color;
    }
  }
}

function render(opts: BlockiesOptions): Buffer {
  opts = buildOptions(opts);

  const imageData = createImageData(opts.size!);
  const width = Math.sqrt(imageData.length);

  const p = new PNGlib(opts.size! * opts.scale!, opts.size! * opts.scale!, 3);
  const bgcolor = p.color(...hsl2rgb(...opts.bgcolor!));
  const color = p.color(...hsl2rgb(...opts.color!));
  const spotcolor = p.color(...hsl2rgb(...opts.spotcolor!));

  for (let i = 0; i < imageData.length; i++) {
    const row = Math.floor(i / width);
    const col = i % width;
    if (imageData[i]) {
      const pngColor = imageData[i] == 1 ? color : spotcolor;
      fillRect(
        p,
        col * opts.scale!,
        row * opts.scale!,
        opts.scale!,
        opts.scale!,
        pngColor,
      );
    }
  }

  const buf = Buffer.from(p.getBase64(), 'base64');
  return buf;
}

export default render;
