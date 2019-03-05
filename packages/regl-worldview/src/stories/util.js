// @flow

import polygonGenerator from "polygon-generator";
import seedrandom from "seedrandom";

export const p = (x: number, y: number = x, z: number = x) => ({ x, y, z });
export const q = (x: number, y: number = x, z: number = x, w: number = x) => ({ x, y, z, w });

export const UNIT_QUATERNION = q(0, 0, 0, 1);

export const buildMatrix = (x: number, y: number, z: number, step: number = 1) => {
  const result = [];
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      for (let k = 0; k < z; k++) {
        result.push(p(i * step, j * step, k * step));
      }
    }
  }
  return result;
};

const seed = 123; // fixed seed for screenshot tests.

export const rng = seedrandom(seed);

export const cube = (range: number, id: number = 1) => {
  const marker = {
    id,
    pose: {
      orientation: { x: 0.038269, y: -0.01677, z: -0.8394, w: 0.541905 },
      position: { x: range, y: range, z: range },
    },
    scale: p(5, 5),
    color: { r: 1, g: 0, b: 1, a: 0.5 },
  };
  return marker;
};

export const sphere = (range: number, id: number = 1) => {
  const marker = {
    id,
    pose: {
      orientation: { x: 0.038269, y: -0.01677, z: -0.8394, w: 0.541905 },
      position: { x: range, y: range, z: range },
    },
    scale: p(5, 5),
    color: { r: 0, g: 0, b: 1, a: 0.5 },
    points: [{ x: range, y: range, z: range }],
  };
  return marker;
};

export const filledPolygon = (range: number, id: number = 1) => {
  const sideLength = 2 * range + 5;
  const startingAngle = 15 * range;
  const numSides = Math.floor(range * 15) + 1;
  const randomPolygon = polygonGenerator.coordinates(numSides, sideLength, startingAngle);
  const vertices = randomPolygon.map(({ x, y }) => ({ x, y, z: 0 }));

  return {
    id,
    color: { r: 0, g: 1, b: 0, a: 0.5 },
    points: vertices,
  };
};

export const triangle = (range: number, id: number = 1) => {
  const marker = {
    id,
    pose: {
      orientation: { x: 0.038269, y: -0.01677, z: -0.8394, w: 0.541905 },
      position: { x: range, y: range, z: range },
    },
    points: [{ x: range - 2, y: 0, z: 0 }, { x: range + 2, y: 0, z: 0 }, { x: range - 2, y: 5, z: 0 }],
    color: { r: 1, g: 1, b: 1, a: 0.5 },
    useDepthMask: true,
  };
  return marker;
};
