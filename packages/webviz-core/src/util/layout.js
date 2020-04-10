// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import * as Sentry from "@sentry/browser";
import { createRemoveUpdate, getNodeAtPath, updateTree } from "react-mosaic-component";

import type { Config as TabPanelConfig } from "webviz-core/src/panels/Tab";
import type {
  SaveConfigsPayload,
  PanelConfig,
  MosaicNode,
  MosaicPath,
  MosaicDropTargetPosition,
} from "webviz-core/src/types/panels";

export const DEFAULT_TAB_PANEL_CONFIG = { activeTabIdx: 0, tabs: [{ title: "1", layout: null }] };

const validateTabPanelConfig = (config: ?PanelConfig) => {
  if (!Array.isArray(config?.tabs) || typeof config?.activeTabIdx !== "number") {
    Sentry.captureException(new Error("A non-Tab panel config is being operated on as if it were a tab panel."));
    return false;
  }
  return true;
};

export const updateTabPanelLayout = (layout: ?MosaicNode, tabPanelConfig: TabPanelConfig): TabPanelConfig => {
  return {
    ...tabPanelConfig,
    tabs: tabPanelConfig.tabs.map((tab, i) => {
      if (i === tabPanelConfig.activeTabIdx) {
        return { ...tab, layout };
      }
      return tab;
    }),
  };
};

export const removePanelFromTabPanel = (
  path: MosaicPath = [],
  config: PanelConfig,
  tabId: string
): SaveConfigsPayload => {
  if (!validateTabPanelConfig(config)) {
    return { configs: [] };
  }

  const currentTabLayout = config.tabs[config.activeTabIdx].layout;
  let newTree: ?MosaicNode;
  if (!path.length) {
    newTree = null;
  } else {
    const update = createRemoveUpdate(currentTabLayout, path);
    newTree = updateTree(currentTabLayout, [update]);
  }

  const saveConfigsPayload = {
    configs: [
      {
        id: tabId,
        config: updateTabPanelLayout(newTree, config),
      },
    ],
  };
  return saveConfigsPayload;
};

export const getTreeFromMovePanel = (
  panelId: string,
  newPath: MosaicPath,
  position: MosaicDropTargetPosition,
  tree: MosaicNode
): MosaicNode => {
  const node = getNodeAtPath(tree, newPath);
  const before = position === "left" || position === "top";
  const [first, second] = before ? [panelId, node] : [node, panelId];
  const direction = position === "left" || position === "right" ? "row" : "column";
  const updates = [{ path: newPath, spec: { $set: { first, second, direction } } }];
  const newTree = updateTree(tree, updates);

  return newTree;
};

export const addPanelToTab = (
  insertedPanelId: string,
  destinationPath: ?MosaicPath,
  destinationPosition: ?MosaicDropTargetPosition,
  tabConfig: ?PanelConfig,
  tabId: string
): SaveConfigsPayload => {
  const safeTabConfig =
    typeof tabConfig?.activeTabIdx === "number" && tabConfig?.tabs
      ? ((tabConfig: any): TabPanelConfig)
      : DEFAULT_TAB_PANEL_CONFIG;

  const currentTabLayout = safeTabConfig.tabs[safeTabConfig.activeTabIdx].layout;
  const newTree =
    currentTabLayout && destinationPath && destinationPosition
      ? getTreeFromMovePanel(insertedPanelId, destinationPath, destinationPosition, currentTabLayout)
      : insertedPanelId;

  const saveConfigsPayload = {
    configs: [
      {
        id: tabId,
        config: updateTabPanelLayout(newTree, safeTabConfig),
      },
    ],
  };
  return saveConfigsPayload;
};
