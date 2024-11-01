/**
 * A handy class to calculate color values.
 *
 * @version 1.0
 * @author Robert Eisele <robert@xarg.org>
 * @copyright Copyright (c) 2010, Robert Eisele
 * @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
 * @license http://www.opensource.org/licenses/bsd-license.php BSD License
 *
 */

// Modified by George Chan <gchan@21cn.com>

// Further modified by Will O'B <@wbobeirne> to make it
// UglifyJS and "use strict"; friendly

class PNGlib {
  width: number;
  height: number;
  depth: number;
  pix_size: number;
  data_size: number;
  ihdr_offs: number;
  ihdr_size: number;
  plte_offs: number;
  plte_size: number;
  trns_offs: number;
  trns_size: number;
  idat_offs: number;
  idat_size: number;
  iend_offs: number;
  iend_size: number;
  buffer_size: number;
  buffer: string[];
  palette: { [key: number]: string };
  pindex: number;
  _crc32: number[];

  constructor(width: number, height: number, depth: number) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.pix_size = height * (width + 1);
    this.data_size =
      2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

    this.ihdr_offs = 0;
    this.ihdr_size = 4 + 4 + 13 + 4;
    this.plte_offs = this.ihdr_offs + this.ihdr_size;
    this.plte_size = 4 + 4 + 3 * depth + 4;
    this.trns_offs = this.plte_offs + this.plte_size;
    this.trns_size = 4 + 4 + depth + 4;
    this.idat_offs = this.trns_offs + this.trns_size;
    this.idat_size = 4 + 4 + this.data_size + 4;
    this.iend_offs = this.idat_offs + this.idat_size;
    this.iend_size = 4 + 4 + 4;
    this.buffer_size = this.iend_offs + this.iend_size;

    this.buffer = new Array(this.buffer_size).fill('\x00');
    this.palette = {};
    this.pindex = 0;
    this._crc32 = new Array(256);

    this.initBuffer();
    this.initCRC32();
  }

  private write(buffer: string[], offs: number, ...args: string[]): void {
    for (const arg of args) {
      for (const char of arg) {
        buffer[offs++] = char;
      }
    }
  }

  private byte2(w: number): string {
    return String.fromCharCode((w >> 8) & 255, w & 255);
  }

  private byte4(w: number): string {
    return String.fromCharCode(
      (w >> 24) & 255,
      (w >> 16) & 255,
      (w >> 8) & 255,
      w & 255,
    );
  }

  private byte2lsb(w: number): string {
    return String.fromCharCode(w & 255, (w >> 8) & 255);
  }

  private initBuffer(): void {
    this.write(
      this.buffer,
      this.ihdr_offs,
      this.byte4(this.ihdr_size - 12),
      'IHDR',
      this.byte4(this.width),
      this.byte4(this.height),
      '\x08\x03',
    );
    this.write(
      this.buffer,
      this.plte_offs,
      this.byte4(this.plte_size - 12),
      'PLTE',
    );
    this.write(
      this.buffer,
      this.trns_offs,
      this.byte4(this.trns_size - 12),
      'tRNS',
    );
    this.write(
      this.buffer,
      this.idat_offs,
      this.byte4(this.idat_size - 12),
      'IDAT',
    );
    this.write(
      this.buffer,
      this.iend_offs,
      this.byte4(this.iend_size - 12),
      'IEND',
    );

    const header = ((8 + (7 << 4)) << 8) | (3 << 6);
    const adjustedHeader = header + 31 - (header % 31);
    this.write(this.buffer, this.idat_offs + 8, this.byte2(adjustedHeader));

    for (let i = 0; (i << 16) - 1 < this.pix_size; i++) {
      const size =
        i + 0xffff < this.pix_size ? 0xffff : this.pix_size - (i << 16) - i;
      const bits = i + 0xffff < this.pix_size ? '\x00' : '\x01';
      this.write(
        this.buffer,
        this.idat_offs + 8 + 2 + (i << 16) + (i << 2),
        bits,
        this.byte2lsb(size),
        this.byte2lsb(~size),
      );
    }
  }

  private initCRC32(): void {
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c =
          c & 1 ? -306674912 ^ ((c >> 1) & 0x7fffffff) : (c >> 1) & 0x7fffffff;
      }
      this._crc32[i] = c;
    }
  }

  index(x: number, y: number): number {
    const i = y * (this.width + 1) + x + 1;
    const j = this.idat_offs + 8 + 2 + 5 * Math.floor(i / 0xffff + 1) + i;
    return j;
  }

  color(red: number, green: number, blue: number, alpha: number = 255): string {
    const color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

    if (this.palette[color] === undefined) {
      if (this.pindex === this.depth) {
        return '\x00';
      }

      const ndx = this.plte_offs + 8 + 3 * this.pindex;
      this.buffer[ndx + 0] = String.fromCharCode(red);
      this.buffer[ndx + 1] = String.fromCharCode(green);
      this.buffer[ndx + 2] = String.fromCharCode(blue);
      this.buffer[this.trns_offs + 8 + this.pindex] =
        String.fromCharCode(alpha);

      this.palette[color] = String.fromCharCode(this.pindex++);
    }
    return this.palette[color];
  }

  getBase64(): string {
    const s = this.getDump();
    const ch =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let r = '';
    let i = 0;

    while (i < s.length) {
      const c1 = s.charCodeAt(i);
      const e1 = c1 >> 2;
      const c2 = s.charCodeAt(i + 1);
      const e2 = ((c1 & 3) << 4) | (c2 >> 4);
      const c3 = s.charCodeAt(i + 2);
      const e3 = s.length < i + 2 ? 64 : ((c2 & 0xf) << 2) | (c3 >> 6);
      const e4 = s.length < i + 3 ? 64 : c3 & 0x3f;
      r += ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
      i += 3;
    }
    return r;
  }

  getDump(): string {
    const BASE = 65521;
    const NMAX = 5552;
    let s1 = 1;
    let s2 = 0;
    let n = NMAX;

    for (let y = 0; y < this.height; y++) {
      for (let x = -1; x < this.width; x++) {
        s1 += this.buffer[this.index(x, y)].charCodeAt(0);
        s2 += s1;
        if (--n === 0) {
          s1 %= BASE;
          s2 %= BASE;
          n = NMAX;
        }
      }
    }
    s1 %= BASE;
    s2 %= BASE;
    this.write(
      this.buffer,
      this.idat_offs + this.idat_size - 8,
      this.byte4((s2 << 16) | s1),
    );

    const crc32 = (png: string[], offs: number, size: number) => {
      let crc = -1;
      for (let i = 4; i < size - 4; i++) {
        crc =
          this._crc32[(crc ^ png[offs + i].charCodeAt(0)) & 0xff] ^
          ((crc >> 8) & 0x00ffffff);
      }
      this.write(png, offs + size - 4, this.byte4(crc ^ -1));
    };

    crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
    crc32(this.buffer, this.plte_offs, this.plte_size);
    crc32(this.buffer, this.trns_offs, this.trns_size);
    crc32(this.buffer, this.idat_offs, this.idat_size);
    crc32(this.buffer, this.iend_offs, this.iend_size);

    return '\x89PNG\r\n\x1a\n' + this.buffer.join('');
  }
}

export default PNGlib;
