// @flow

//  Copyright (c) 2018-present, GM Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import { partition } from "lodash";
import * as React from "react";

import type { Cube } from "../types";
import { defaultBlend } from "../utils/commandUtils";
import fromGeometry from "../utils/fromGeometry";
import { createInstancedGetChildrenForHitmap } from "../utils/getChildrenForHitmapDefaults";
import Command, { type CommonCommandProps } from "./Command";

export const BlendMode = {
  default: 0,
  multipass: 1,
  multiplicative: 2,
  opaqueFirst: 3,
  opaqueFirstAndSortTransparent: 4,
};

function makeCommand({ blendMode = BlendMode.default }: {| blendMode: BlendMode |}) {
  return (regl: any) => {
    const geometry = fromGeometry(
      [
        // bottom face corners
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
        [0.5, 0.5, -0.5],
        // top face corners
        [-0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0.5],
      ],
      [
        // bottom
        [0, 1, 2],
        [2, 1, 3],
        // top
        [5, 4, 6],
        [5, 6, 7],
        // left
        [0, 2, 4],
        [4, 2, 6],
        // right
        [3, 1, 5],
        [3, 5, 7],
        //front
        [2, 3, 6],
        [6, 3, 7],
        //back
        [1, 0, 4],
        [1, 4, 5],
      ]
    )(regl);

    return (props) => {
      if (blendMode === BlendMode.multipass) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl({
          ...geometry,
        })(groups[0]);
        // two pass rendering
        regl({
          ...geometry,
          depth: {
            enable: true,
            mask: false,
          },
          cull: {
            enable: true,
            face: "front",
          },
        })(groups[1]);
        regl({
          ...geometry,
          depth: {
            enable: true,
            mask: false,
          },
          cull: {
            enable: true,
            face: "back",
          },
        })(groups[1]);
      } else if (blendMode === BlendMode.multiplicative) {
        regl({
          ...geometry,
          blend: {
            ...defaultBlend,
            func: {
              src: "one",
              dst: "one",
            },
          },
        })(props);
      } else if (blendMode === BlendMode.opaqueFirst) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl(geometry)([...groups[0], ...groups[1]]);
      } else if (blendMode === BlendMode.opaqueFirstAndSortTransparent) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl(geometry)([...groups[0], ...groups[1]]);
      } else {
        // single pass rendering
        regl(geometry)(props);
      }
    };
  };
}

const getChildrenForHitmap = createInstancedGetChildrenForHitmap(1);
export default function Cubes(props: { ...CommonCommandProps, children: Cube[] }) {
  const cubes = makeCommand({
    blendMode: props.blendMode,
  });
  return <Command getChildrenForHitmap={getChildrenForHitmap} {...props} reglCommand={cubes} />;
}
