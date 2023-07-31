function applyMixins<T extends new (...args: any[]) => any>(...mixins: T[]): new (...args: any[]) => InstanceType<T> & InstanceType<T> {
    return class {
      constructor(...args: any[]) {
        mixins.forEach(mixin => {
          const instance = new mixin(...args);
          Object.assign(this, instance);
        });
      }
    } as new (...args: any[]) => InstanceType<T> & InstanceType<T>;
  }

export default applyMixins;
