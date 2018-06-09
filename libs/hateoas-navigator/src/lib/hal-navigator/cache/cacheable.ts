import {from, Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';

export function Cacheable(): MethodDecorator {
  return <(...args) => any> function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args) => any>) {
    const proxyTarget = descriptor.value;
    descriptor.value = new ProxyFactory(proxyTarget).getProxy();
    return descriptor;
  };
}

class ProxyFactory<T> {
  private cache = {};

  private static getKey(args: any[]) {
    return JSON.stringify(args);
  }

  constructor(private proxyTarget: (...args) => Observable<T>) {
  }

  getProxy<T>(): (...args) => Observable<T> {
    const self = this;
    return function (...args) {
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
