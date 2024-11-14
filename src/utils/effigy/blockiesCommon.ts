/**
 * Some common functions to generate ethereum "blockie" identicon
 *
 * @version 0.01
 * @autor Harper <harper@modest.com>
 * @link https://effigy.im
 * @license https://opensource.org/licenses/MIT MIT License
 *
 */

const randseed: number[] = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

function randomizeSeed(seed: string): void {
  for (let i = 0; i < randseed.length; i++) {
    randseed[i] = 0;
  }
  for (let i = 0; i < seed.length; i++) {
    randseed[i % 4] =
      (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
  }
}

function rand(): number {
  // based on Java's String.hashCode(), expanded to 4 32bit values
  const t = randseed[0] ^ (randseed[0] << 11);

  randseed[0] = randseed[1];
  randseed[1] = randseed[2];
  randseed[2] = randseed[3];
  randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);

  return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
}

export { rand, randomizeSeed, randseed };
