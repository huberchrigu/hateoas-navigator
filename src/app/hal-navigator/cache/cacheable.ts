import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';

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
        return Observable.from([value]);
      } else {
        const observable = self.proxyTarget.apply(this, args);
        return observable.map(newValue => {
          if (newValue) {
            self.cache[key] = newValue;
          }
          return newValue;
        });
      }
    };
  }
}
