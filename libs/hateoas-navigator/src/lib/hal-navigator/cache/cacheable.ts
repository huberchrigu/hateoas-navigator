import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

class ProxyFactory<T> {
  private cache = {};

  private static getKey(args: any[]) {
    return JSON.stringify(args);
  }

  constructor(private proxyTarget: (...args) => Observable<T>) {
  }

  getProxy(): (...args) => Observable<T> {
    const self = this;
    return function(...args) {
      const key = ProxyFactory.getKey(args);
      const value = self.cache[key];
      if (value) {
        return from([value]);
      } else {
        const observable = self.proxyTarget.apply(this, args);
        return observable.pipe(map(newValue => {
          if (newValue) {
            self.cache[key] = newValue;
          }
          return newValue;
        }));
      }
    };
  }
}

export function Cacheable(): MethodDecorator {
  return cacheableFunction as (...args) => any;

  function cacheableFunction(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args) => any>) {
    const proxyTarget = descriptor.value;
    descriptor.value = new ProxyFactory(proxyTarget).getProxy();
    return descriptor;
  }
}
