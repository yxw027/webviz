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
  phi: 1.3,
  thetaOffset: 0.75,
};

storiesOf("Worldview/Transparency", module)
  .addDecorator(withScreenshot())
  .add("default", () => {
    return (
      <Container cameraState={cameraState}>
        <Cubes>
          {[
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
        <Axes />
      </Container>
    );
  })
  .add("multipass (no sort)", () => {
    return (
      <Container cameraState={cameraState}>
        <Cubes blendMode={BlendMode.multipass}>
          {[
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
        <Axes />
      </Container>
    );
  })
  .add("multipass (correct order)", () => {
    return (
      <Container cameraState={cameraState}>
        <Cubes blendMode={BlendMode.multipass}>
          {[
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
        <Axes />
      </Container>
    );
  })
  .add("multipass (correct order) - axes first", () => {
    return (
      <Container cameraState={cameraState}>
        <Axes />
        <Cubes blendMode={BlendMode.multipass}>
          {[
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
      </Container>
    );
  })
  .add("multiplicative blend", () => {
    return (
      <Container cameraState={cameraState}>
        <Cubes blendMode={BlendMode.multiplicative}>
          {[
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
        <Axes />
      </Container>
    );
  })
  .add("opaque first", () => {
    return (
      <Container cameraState={cameraState}>
        <Cubes blendMode={BlendMode.opaqueFirst}>
          {[
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
        <Axes />
      </Container>
    );
  })
  .add("opaque first and sort transparent", () => {
    return (
      <Container cameraState={cameraState}>
        <Cubes blendMode={BlendMode.opaqueFirstAndSortTransparent}>
          {[
            cube({ position: { x: 0, y: 0, z: 0 }, color: { r: 1.0, g: 0.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 0, y: 15, z: 0 }, color: { r: 0.0, g: 1.0, b: 0.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 0, z: 0 }, color: { r: 0.0, g: 0.0, b: 1.0, a: 0.5 } }),
            cube({ position: { x: 15, y: 15, z: 0 }, color: { r: 1.0, g: 0.0, b: 1.0, a: 1.0 } }),
          ]}
        </Cubes>
        <Axes />
      </Container>
    );
  });
