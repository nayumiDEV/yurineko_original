import { Prisma } from '@prisma/client';

function convertDateOffset(obj: object) {
  if (!obj) return;

  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Date) {
      obj[key].setHours(obj[key].getHours() - 7);
    } else if (typeof obj[key] === 'object') {
      convertDateOffset(obj[key]);
    }
  });

  return obj;
}

export const dbNow = () => {
  const newDate = new Date();
  newDate.setHours(newDate.getHours() + 7);
  return newDate;
};

export function DateUnpackMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const result = await next(params);
    convertDateOffset(result);
    return result;
  };
}
