export function sleep(time:any) {
    return new Promise((resolve, reject) => {
      let a: unknown;
      setTimeout(() => {
        resolve(a);
      }, time);
    });
  }