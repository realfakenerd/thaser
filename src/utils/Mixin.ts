type Constructor<T = {}> = new (...args: any[]) => T;

function Mixin<TBase extends Constructor[]>(...mixins: TBase) {
    return function (target) {
        for (const mixin of mixins) {
            const descriptors = Object.getOwnPropertyDescriptor(mixin.prototype);
            Object.defineProperty(target.prototype, descriptors);
        }

        return target;
    }
}

export default Mixin;

// function applyMixins(destino: any, mixins: any[]): any {
//     for (const mixin of mixins) {
//       Object.assign(destino.prototype, new mixin());
//     }
//     return destino;
//   }