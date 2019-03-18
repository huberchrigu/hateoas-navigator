export class PropertyCombiner<T> {
  constructor(private priorityList: T[]) {

  }

  getFirst<K extends keyof T>(fieldName: K): T[K] {
    return this.priorityList.map(value => value[fieldName]).find(value => value !== undefined);
  }

  all<K extends keyof T>(fieldName: K): boolean {
    return !this.priorityList.some(value => !value[fieldName]);
  }

  /**
   * Currently null values are filtered out as well, and if no value left, undefined is returned.
   * Actually null is not undefined and should be treated differently. But yet it is easier for testing.
   */
  map<K extends keyof T, R>(fieldName: K, mapFunc: (parent: T, value: T[K]) => R): Array<R> {
    const array = this.priorityList.map(value => {
      const field = value[fieldName];
      return field ? mapFunc(value, field) : undefined;
    }).filter(value => value);
    if (array.length > 0) {
      return array;
    } else {
      return undefined;
    }
  }

  reduce<K extends keyof T, U>(fieldName: K, reduceFunc: (previous: U, current: T[K]) => U, reduceInitial: U): U {
    const mapped = this.map(fieldName, (parent, value) => value);
    return mapped ? mapped.reduce((previous, current) => reduceFunc(previous, current), reduceInitial) : undefined;
  }

  /**
   * Gets the array for each item, removes null/undefined values, and either returns
   * * undefined, if there is no non-empty array
   * * or else, a regrouped array of arrays, where each inner array is a group with the same key
   *
   * @param valueFunction Gets the array for each item
   * @param keyFunction The function provides the key, after which the arrays are regrouped
   * @param ignoreNewKeysFor If this function returns true for an element, any inner array element resulting from this element is ignored,
   * if it is the only inner array element
   * with the given key.
   */
  groupValuesBy<R>(valueFunction: (T) => Array<R>, keyFunction: (value: R) => string, ignoreNewKeysFor: (T) => boolean): Array<Array<R>> {
    const values: Array<Array<R>> = this.priorityList
      .filter(value => !ignoreNewKeysFor(value))
      .map(value => valueFunction(value) as Array<R>)
      .filter(value => value);
    if (values.some(v => v.length > 0)) {
      const regroupedByKey = this.regroupBy<R>(values, keyFunction);
      this.priorityList.filter(value => ignoreNewKeysFor(value))
        .map(value => valueFunction(value))
        .filter(value => value)
        .reduce((previous, current) => previous.concat(current), [])
        .forEach(ignoredValue => {
          const key = keyFunction(ignoredValue);
          if (regroupedByKey[key]) {
            regroupedByKey[key].push(ignoredValue);
          }
        });
      return Object.values(regroupedByKey);
    } else {
      return undefined;
    }
  }

  private regroupBy<TYPE>(values: Array<Array<TYPE>>, keyFunction: (TYPE) => string): { [key: string]: Array<TYPE> } {
    const map: { [key: string]: Array<TYPE> } = {};
    values.forEach(innerValues => innerValues.forEach(value => {
      const key = keyFunction(value);
      const array: Array<TYPE> = map[key];
      if (array) {
        array.push(value);
      } else {
        map[key] = [value];
      }
    }));
    return map;
  }
}
