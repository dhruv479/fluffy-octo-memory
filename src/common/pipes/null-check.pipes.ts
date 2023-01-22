import { PipeTransform } from '@nestjs/common';

export class NullTransform implements PipeTransform<any> {
  transform(value) {
    deleteAllNulls(value);
    return value;
  }
}

function deleteAllNulls(obj: any, checker = (value) => value === null) {
  if (obj instanceof Array) {
    obj.forEach((data) => deleteAllNulls(data));
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      const value = obj[key];
      if (checker(value)) {
        delete obj[key];
      }
      if (obj[key] instanceof Array) {
        obj[key].forEach((data) => deleteAllNulls(data));
      } else if (typeof obj[key] === 'object') {
        deleteAllNulls(obj[key]);
      }
    }
  }
}
