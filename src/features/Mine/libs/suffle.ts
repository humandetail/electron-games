/**
 * 获取 [0,num) 的随机数组
 * @param num - 大于或等于 0 的整数
 * @returns [0,num) 的随机数组
 */
export function getSuffleArray (num: number): number[] {
  if (num < 1 || num % 1 !== 0) {
    throw new RangeError('`num` is Out of range');
  }

  const nums: number[] = [];
  for(let i = 0; i < num; i++ ) {
      nums.push(i);
  }

  const len = nums.length;
  let r = len;
  let rand = 0;

  while (r) {
    rand = Math.floor(Math.random() * r--);
    [nums[r], nums[rand]] = [nums[rand], nums[r]];
  }

  return nums;
}
