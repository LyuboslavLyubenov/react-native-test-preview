import fs from 'fs';
import path from 'path';
import type { ScreenDebugType } from './ScreenDebugType';

function deepClone(obj: any, clonesMap = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (clonesMap.has(obj)) {
    return clonesMap.get(obj);
  }

  if (Array.isArray(obj)) {
    const newArray: any[] = [];
    clonesMap.set(obj, newArray);
    for (let i = 0; i < obj.length; i++) {
      newArray[i] = deepClone(obj[i], clonesMap);
    }
    return newArray;
  }

  const newObj: Record<any, any> = {};
  clonesMap.set(obj, newObj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key], clonesMap);
    }
  }
  return newObj;
}

function stringifyWithCircular(obj: unknown) {
  const seen = new WeakSet();

  function replacer(_key: string, value: object) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        //@ts-ignore
        return deepClone(seen[value]);
      }

      seen.add(value);
    }

    return value;
  }

  return JSON.stringify(obj, replacer, 2);
}

export function savePreview(rendered: ScreenDebugType) {
  fs.writeFileSync(
    path.join(__dirname, 'rendered.json'),
    stringifyWithCircular(rendered)
  );
}
