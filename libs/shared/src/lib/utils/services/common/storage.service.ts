import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  get(key: string): any {
    let result = localStorage.getItem(key);

    try {
        result = JSON.parse(result);
    } catch (e) { }

    result = (result ? result : null);
    return result;
  }

  keys(): string[] {
      return Object.keys(localStorage);
  }

  set(key: string, value: any) {
      value = (typeof value !== 'string' ? JSON.stringify(value) : value);
      localStorage.setItem(key, value);
      return this.get(key);
  }

  delete(key: string) {
      const value = this.get(key);

      if (!value) {
          return undefined;
      }

      localStorage.removeItem(key);

      return value;
  }
}
