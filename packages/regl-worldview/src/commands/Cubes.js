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
  singlePassOpaqueFirst: 30,
  singlePassOpaqueFirstDepthReadOnly: 301,
  multipassBackFront: 31,
  multipassBackFrontCustomBlend: 32,
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
      if (blendMode === BlendMode.singlePassOpaqueFirst) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl(geometry)([...groups[0], ...groups[1]]);
      } else if (blendMode === BlendMode.singlePassOpaqueFirstDepthReadOnly) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl(geometry)(groups[0]);
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
      } else if (blendMode === BlendMode.multipassBackFront) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl(geometry)(groups[0]);
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
      } else if (blendMode === BlendMode.multipassBackFrontCustomBlend) {
        const groups = partition(props, (cube) => {
          const { color: { a } = {} } = cube;
          return a === 1;
        });
        regl(geometry)(groups[0]);
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
          blend: {
            ...defaultBlend,
            func: {
              src: "src alpha",
              dst: "dst color",
            },
          },
        })(groups[1]);
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
