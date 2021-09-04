/**
 * utils
 */

export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    if (time <= 0) resolve();
    let timer: number;
    let i = 1;
    function run() {
      i++;
      if (i >= time) {
        resolve();
        cancelAnimationFrame(timer);
      } else {
        requestAnimationFrame(run);
      }
    }
    run();
  });
}
