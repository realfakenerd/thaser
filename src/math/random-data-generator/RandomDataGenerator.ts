/**
 * A seeded Random Data Generator.
 *
 * Access via `Phaser.Math.RND` which is an instance of this class pre-defined
 * by Phaser. Or, create your own instance to use as you require.
 *
 * The `Math.RND` generator is seeded by the Game Config property value `seed`.
 * If no such config property exists, a random number is used.
 *
 * If you create your own instance of this class you should provide a seed for it.
 * If no seed is given it will use a 'random' one based on Date.now.
 */
export default class RandomDataGenerator {
  private c = 1;
  private s0 = 0;
  private s1 = 0;
  private s2 = 0;
  private n = 0;

  /**
   * Signs to choose from.
   */
  signs = [-1, 1];

  /**
   *
   * @param seeds The seeds to use for the random number generator.
   */
  constructor(
    seeds: string | string[] = [(Date.now() * Math.random()).toString()]
  ) {}

  /**
   * Private random helper.
   */
  private rnd() {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;

    this.c = t | 0;
    this.s0 = this.s1;
    this.s1 = this.s2;
    this.s2 = t - this.c;

    return this.s2;
  }

  /**
   * Internal method that creates a seed hash.
   *
   * @param data - The value to hash.
   *
   * @return The hashed value.
   */
  private hash(data: string): number {
    let h: number;
    let n = this.n;

    data = data.toString();

    let i = 0;
    for (i; i < data.length; i++) {
      n += data.charCodeAt(i);
      h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000;
    }
    this.n = n;

    return (n >>> 0) * 2.3283064365386963e-10;
  }

  /**
   * Initialize the state of the random data generator.
   * @param seeds The seeds to initialize the random data generator with.
   */
  init(seeds: string | string[]): void {
    if (typeof seeds === 'string') {
      this.state(seeds);
    } else {
      this.sow(seeds);
    }
  }

  /**
   * Reset the seed of the random data generator.
   *
   * _Note_: the seed array is only processed up to the first `undefined` (or `null`) value, should such be present.
   * @param seeds The array of seeds: the `toString()` of each value is used.
   */
  sow(seeds: string[]): void {
    this.n = 0xefc8249d;
    this.s0 = this.hash(' ');
    this.s1 = this.hash(' ');
    this.s2 = this.hash(' ');
    this.c = 1;

    if (!seeds) return;

    let i = 0;
    for (i; i < seeds.length && seeds[i] != null; i++) {
      const seed = seeds[i];

      this.s0 -= this.hash(seed);
      this.s0 += ~~(this.s0 < 0);
      this.s1 -= this.hash(seed);
      this.s1 += ~~(this.s1 < 0);
      this.s2 -= this.hash(seed);
      this.s2 += ~~(this.s2 < 0);
    }
  }

  /**
   * @return a random integer between 0 and 2^32.
   */
  integer(): number {
    return this.rnd() * 0x100000000;
  }

  /**
   * @return a random real number between 0 and 1.
   */
  frac(): number {
    return this.rnd() + ((this.rnd() * 0x200000) | 0) * 1.1102230246251565e-16;
  }

  /**
   * @return a random real number between 0 and 2^32.
   */
  real(): number {
    return this.integer() + this.frac();
  }

  /**
   * Returns a random integer between and including min and max.
   * @param min The minimum value in the range.
   * @param max The maximum value in the range.
   *
   * @return A random number between min and max.
   */
  integerInRange(min: number, max: number): number {
    return Math.floor(this.realInRange(0, max - min + 1) + min);
  }

  /**
   * Returns a random integer between and including min and max.
   * This method is an alias for RandomDataGenerator.integerInRange.
   * @param min The minimum value in the range.
   * @param max The maximum value in the range.
   *
   * @return A random number between min and max.
   */
  between(min: number, max: number): number {
    return Math.floor(this.realInRange(0, max - min + 1) + min);
  }

  /**
   * Returns a random real number between min and max.
   * @param min The minimum value in the range.
   * @param max The maximum value in the range.
   *
   * @return A random real number between -1 and 1.
   */
  realInRange(min: number, max: number): number {
    return this.frac() * (max - min) + min;
  }

  /**
   * @return a random real number between -1 and 1.
   */
  normal(): number {
    return 1 - 2 * this.frac();
  }

  /**
   * @return a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
   */
  uuid(): string {
    let a = '';
    let b = '';
    for (
      b = a = '';
      (a as any)++ < 36;
      b +=
        ~a % 5 | (((a as any) * 3) & 4)
          ? ((a as any) ^ 15
              ? 8 ^ (this.frac() * ((a as any) ^ 20 ? 16 : 4))
              : 4
            ).toString(16)
          : '-'
    ) {}
    return b;
  }

  /**
   * Returns a random element from within the given array.
   * @param array The array to pick a random element from.
   *
   * @return A random member of the array.
   */
  pick<T>(array: T[]): T {
    return array[this.integerInRange(0, array.length - 1)];
  }

  /**
   * @return a sign to be used with multiplication operator. -1 or +1.
   */
  sign(): number {
    return this.pick(this.signs);
  }

  /**
   * Returns a random element from within the given array, favoring the earlier entries.
   * @param array The array to pick a random element from.
   *
   * @return A random member of the array.
   */
  weightedPick<T>(array: T[]): T {
    return array[~~(Math.pow(this.frac(), 2) * (array.length - 1) + 0.5)];
  }

  /**
   * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
   * @param min The minimum value in the range.
   * @param max The maximum value in the range.
   *
   * @return A random timestamp between min and max.
   */
  timestamp(min: number, max: number): number {
    return this.realInRange(min || 946684800000, max || 1577862000000);
  }

  /**
   * @return a random angle between -180 and 180.
   */
  angle(): number {
    return this.integerInRange(-180, 180);
  }

  /**
   * @return a random rotation in radians, between -3.141 and 3.141
   */
  rotation(): number {
    return this.realInRange(-3.1415926, 3.1415926);
  }

  /**
   * Gets or Sets the state of the generator. This allows you to retain the values
   * that the generator is using between games, i.e. in a game save file.
   *
   * To seed this generator with a previously saved state you can pass it as the
   * `seed` value in your game config, or call this method directly after Phaser has booted.
   *
   * Call this method with no parameters to return the current state.
   *
   * If providing a state it should match the same format that this method
   * returns, which is a string with a header `!rnd` followed by the `c`,
   * `s0`, `s1` and `s2` values respectively, each comma-delimited.
   * @param state Generator state to be set.
   */
  state(state?: string): string {
    if (typeof state === 'string' && state.match(/^!rnd/)) {
      // @ts-ignore
      state = state.split(',');

      this.c = parseFloat(state![1]);
      this.s0 = parseFloat(state![2]);
      this.s1 = parseFloat(state![3]);
      this.s2 = parseFloat(state![4]);
    }

    return ['!rnd', this.c, this.s0, this.s1, this.s2].join(',');
  }

  /**
   * Shuffles the given array, using the current seed.
   * @param array The array to be shuffled.
   */
  shuffle<T>(array?: T[]): T[] {
    const len = array!.length - 1;
    let i = len;
    for (i; i > 0; i--) {
      const randomIndex = Math.floor(this.frac() * (i + 1));
      const itemAtIndex = array![randomIndex];

      array![randomIndex] = array![i];
      array![i] = itemAtIndex;
    }
    return array!;
  }
}
