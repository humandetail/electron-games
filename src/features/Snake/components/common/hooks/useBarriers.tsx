/**
 * useBarriers hook
 */

import { ICoordinate } from '../../../types';
import { Mode, Size } from '../../../views/Snake';

export default function useBarriers(
  mode: Mode,
  { row, col }: typeof Size
): Array<ICoordinate> {
  const barriers = [];
  if (mode === Mode.HELL) {
    for (let i = 3; i < 10; i++) {
      barriers.push({ x: i, y: 3 });
      barriers.push({ x: i, y: col - 4 });
    }
    for (let j = row - 4; j >= row - 10; j--) {
      barriers.push({ x: j, y: 3 });
      barriers.push({ x: j, y: col - 4 });
    }
    for (let k = 4; k < 10; k++) {
      barriers.push({ x: 3, y: k });
      barriers.push({ x: row - 4, y: k });
    }
    for (let k = col - 4; k >= col - 10; k--) {
      barriers.push({ x: 3, y: k });
      barriers.push({ x: row - 4, y: k });
    }
  }
  return barriers;
}
