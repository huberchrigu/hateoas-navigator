import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

class ProxyFactory<T> {
  private cache: { [key: string]: any } = {};

  private static getKey(args: any[]) {
    return JSON.stringify(args);
  }

  constructor(private proxyTarget: ((...args: any) => any) | undefined) {
  }

  getProxy(): (...args: any) => Observable<T> {
    const self = this;
    return (...args) => {
      const key = ProxyFactory.getKey(args);
      const value = self.cache[key];
      if (value) {
        return from([value]);
      } else {
        const observable = self.proxyTarget!.apply(this, args);
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
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const proxyTarget = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return new ProxyFactory(proxyTarget).getProxy().apply(this, args);
    };
    return descriptor;
  };
}
