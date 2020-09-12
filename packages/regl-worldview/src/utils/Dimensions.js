// @flow
//
//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import React, { useRef, useEffect, useState } from "react";

type DimensionsParams = {| height: number, width: number |};
type Props = {|
  children: (DimensionsParams) => React.Node,
|};

export default function Dimensions({ children }: Props) {
  const initialDivRef = useRef();
  const resizeObserverRef = useRef();
  const [parentElement, setParentElement] = useState(undefined);
  const [dimensions, setDimensions] = useState<DimensionsParams>({ width: undefined, height: undefined });

  useEffect(
    () => {
      if (initialDivRef.current && initialDivRef.current.parentElement) {
        setParentElement(initialDivRef.current.parentElement);
      }
    },
    [initialDivRef.current]
  );

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (!entries || !entries.length) {
        return;
      }

      const newWidth = Math.round(entries[0].contentRect.width);
      const newHeight = Math.round(entries[0].contentRect.height);
      setDimensions({ width: newWidth, height: newHeight });
    });
  }, []);

  useEffect(
    () => {
      if (!parentElement) {
        return;
      }
      resizeObserverRef.current.observe(parentElement);
      return () => resizeObserverRef.current.unobserve(parentElement);
    },
    [parentElement]
  );

  if (dimensions.width === undefined) {
    return <div ref={initialDivRef} />;
  }
  return children(dimensions);
}
