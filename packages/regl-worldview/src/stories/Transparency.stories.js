// @flow

import { storiesOf } from "@storybook/react";
import React from "react";
import { withScreenshot } from "storybook-chrome-screenshot";

import { BlendMode } from "../commands/Cubes";
import type { Color, Point } from "../types";
import Container from "./Container";

import { Cubes, Axes, DEFAULT_CAMERA_STATE } from "..";

const cube = ({ position, color }: {| position: Point, color: Color |}) => {
  return {
    pose: {
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      position,
    },
    scale: { x: 10, y: 10, z: 10 },
    color,
  };
};

const cameraState = {
  ...DEFAULT_CAMERA_STATE,
  distance: 35,
  perspective: true,
  phi: 0.5 * Math.PI,
  thetaOffset: 0,
};

function Example({ sorted, blendMode, children }: {| sorted: Boolean, blendMode: BlendMode, children: any[] |}) {
  let cubes = [
    cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
    cube({ position: { x: -7.5, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
    cube({ position: { x: 7.5, y: 15, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
    cube({ position: { x: 0, y: 30, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
  ];

  if (sorted) {
    // simple sorting based on 'y' component
    cubes = cubes.sort((c1, c2) => c2.pose.position.y - c1.pose.position.y);
  }

  return (
    <Container cameraState={cameraState}>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>{children}</div>
      <Cubes blendMode={blendMode}>{cubes}</Cubes>
      <Axes />
    </Container>
  );
}

storiesOf("Worldview/Transparency", module)
  .addDecorator(withScreenshot())
  .add("default", () => (
    <Example sorted={false} blendMode={BlendMode.default}>
      <p>Our current approach to transparency</p>
      <ul>
        <li>+ Fastest. Single pass rendering.</li>
        <li>+ Object inner faces are visible</li>
        <li>&nbsp;</li>
        <li>- Sorting required.</li>
        <li>- Transparent objects can end up occluding opaque ones. Magenta box is not visible.</li>
        <li>
          - Transparent objects occlude other transparent objects. Red box partially occludes green and blue ones.
        </li>
      </ul>
    </Example>
  ))
  .add("default (manual sorting)", () => (
    <Example sorted={true} blendMode={BlendMode.default}>
      <p>Objects are MANUALLY sorted to produce the correct result. This is what we should aim for.</p>
      <ul>
        <li>Magenta box is visible.</li>
        <li>Green and blue boxes are fully visible.</li>
        <li>Inner faces are visible.</li>
        <li>Colors are correctly blended.</li>
        <li>NOTE: This is only for demo purposes.</li>
      </ul>
    </Example>
  ))
  .add("single pass, opaque first then transparent", () => (
    <Example sorted={false} blendMode={BlendMode.singlePassOpaqueFirst}>
      <p>Creates two render lists when rendering. One for opaque objects and another one for transparent ones.</p>
      <p>Opaque objects are drawn first.</p>
      <p>Transparent objects are drawn once.</p>
      <ul>
        <li>+ No sorting required. Single pass rendering.</li>
        <li>+ Opaque objects are visible.</li>
        <li>+ Object inner faces are visible</li>
        <li>&nbsp;</li>
        <li>- May duplicate draw calls since we cannot use instancing to render objects in a single command.</li>
        <li>
          - Transparent objects occlude other transparent objects. Red box partially occludes green and blue ones.
        </li>
        <li>- Needs extra processing to split render commands.</li>
      </ul>
    </Example>
  ))
  .add("single pass, opaque first then transparent - read only depth", () => (
    <Example sorted={false} blendMode={BlendMode.singlePassOpaqueFirstDepthReadOnly}>
      <p>Creates two render lists when rendering. One for opaque objects and another one for transparent ones.</p>
      <p>Opaque objects are drawn first.</p>
      <p>Transparent objects are rendered only once without writing to the depth buffer.</p>
      <ul>
        <li>+ No sorting required. Single pass rendering.</li>
        <li>+ Opaque objects are visible.</li>
        <li>+ Transparent objects do not occlude each others.</li>
        <li>&nbsp;</li>
        <li>- May duplicate draw calls since we cannot use instancing to render objects in a single command.</li>
        <li>- Needs extra processing to split render commands.</li>
        <li>- Colors are not correct. Too dark.</li>
        <li>- Object inner faces are not visible</li>
        <li>- Sorting not completely fixed.</li>
      </ul>
    </Example>
  ))
  .add("multipass, opaque first then transparent - back/front", () => (
    <Example sorted={false} blendMode={BlendMode.multipassBackFront}>
      <p>Create two render lists when rendering. One for opaque objects and another one for transparent ones.</p>
      <p>Opaque objects are drawn first.</p>
      <p>Transparent objects are drawn twice. Back faces first, then front faces.</p>
      <ul>
        <li>+ No sorting required.</li>
        <li>+ Opaque objects are visible.</li>
        <li>+ Transparent objects do not occlude each others.</li>
        <li>+ Colors are less dark. </li>
        <li>&nbsp;</li>
        <li>- Multiple render passes. May lead to performance issues.</li>
        <li>- May duplicate draw calls since we cannot use instancing to render objects in a single command.</li>
        <li>- Needs extra processing to split render commands.</li>
        <li>- Colors are still not correct.</li>
        <li>+ Object inner faces are not visible</li>
        <li>- Sorting not completely fixed.</li>
      </ul>
    </Example>
  ))
  .add("multipass, opaque first then transparent - back/front custom blending", () => (
    <Example sorted={false} blendMode={BlendMode.multipassBackFrontCustomBlend}>
      <p>Create two render lists when rendering. One for opaque objects and another one for transparent ones.</p>
      <p>Opaque objects are drawn first.</p>
      <p>Transparent objects are drawn twice. Back faces first, then front faces with custom blend settings.</p>
      <ul>
        <li>+ No sorting required.</li>
        <li>+ Opaque objects are visible.</li>
        <li>+ Transparent objects do not occlude each others.</li>
        <li>+ Colors are less dark. Acceptable? </li>
        <li>&nbsp;</li>
        <li>- Multiple render passes. May lead to performance issues.</li>
        <li>- May duplicate draw calls since we cannot use instancing to render objects in a single command.</li>
        <li>- Needs extra processing to split render commands.</li>
        <li>- Colors are still not correct.</li>
        <li>- Object inner faces are not visible</li>
        <li>- Sorting not completely fixed.</li>
      </ul>
    </Example>
  ));
