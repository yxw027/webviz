// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import { removePanelFromTabPanel, getTreeFromMovePanel, addPanelToTab } from "webviz-core/src/util/layout";

describe("layout", () => {
  describe("removePanelFromTabPanel", () => {
    it("single panel layout", () => {
      expect(
        removePanelFromTabPanel(
          [],
          {
            activeTabIdx: 0,
            tabs: [{ title: "1", layout: "DiagnosticSummary!3v8mswd" }, { title: "2", layout: null }],
          },
          "Tab!3u9ypnk"
        )
      ).toEqual({
        configs: [
          {
            id: "Tab!3u9ypnk",
            config: { activeTabIdx: 0, tabs: [{ title: "1", layout: null }, { title: "2", layout: null }] },
          },
        ],
      });
    });
    it("multiple panel layout", () => {
      expect(
        removePanelFromTabPanel(
          ["second"],
          {
            activeTabIdx: 0,
            tabs: [
              {
                title: "1",
                layout: {
                  first: "DiagnosticSummary!1x1vwgf",
                  second: "DiagnosticSummary!3v8mswd",
                  direction: "column",
                  splitPercentage: 100,
                },
              },
              { title: "2", layout: null },
            ],
          },
          "Tab!3u9ypnk"
        )
      ).toEqual({
        configs: [
          {
            id: "Tab!3u9ypnk",
            config: {
              activeTabIdx: 0,
              tabs: [{ title: "1", layout: "DiagnosticSummary!1x1vwgf" }, { title: "2", layout: null }],
            },
          },
        ],
      });
    });
  });
  describe("getTreeFromMovePanel", () => {
    it("no tabs", () => {
      expect(getTreeFromMovePanel("DiagnosticSummary!30vin8", [], "bottom", "DiagnosticSummary!3v8mswd")).toEqual({
        first: "DiagnosticSummary!3v8mswd",
        second: "DiagnosticSummary!30vin8",
        direction: "column",
      });
    });
    it("with tab panels", () => {
      expect(
        getTreeFromMovePanel("DiagnosticSummary!3v8mswd", ["second"], "left", {
          first: "Tab!3u9ypnk",
          second: "DiagnosticSummary!1c6n55t",
          direction: "row",
        })
      ).toEqual({
        first: "Tab!3u9ypnk",
        second: { first: "DiagnosticSummary!3v8mswd", second: "DiagnosticSummary!1c6n55t", direction: "row" },
        direction: "row",
      });
    });
    it("nested paths", () => {
      expect(
        getTreeFromMovePanel("DiagnosticSummary!3v8mswd", ["second", "first"], "left", {
          first: "Tab!3u9ypnk",
          second: { first: "DiagnosticSummary!g24eyn", second: "DiagnosticSummary!1c6n55t", direction: "column" },
          direction: "row",
        })
      ).toEqual({
        first: "Tab!3u9ypnk",
        second: {
          first: { first: "DiagnosticSummary!3v8mswd", second: "DiagnosticSummary!g24eyn", direction: "row" },
          second: "DiagnosticSummary!1c6n55t",
          direction: "column",
        },
        direction: "row",
      });
    });
  });
  describe("addPanelToTab", () => {
    it("can add a new panel into a tab config", () => {
      expect(
        addPanelToTab(
          "DiagnosticSummary!30vin8",
          [],
          "bottom",
          {
            activeTabIdx: 0,
            tabs: [{ title: "1", layout: "DiagnosticSummary!3v8mswd" }, { title: "2", layout: null }],
          },
          "Tab!3u9ypnk"
        )
      ).toEqual({
        configs: [
          {
            id: "Tab!3u9ypnk",
            config: {
              activeTabIdx: 0,
              tabs: [
                {
                  title: "1",
                  layout: {
                    first: "DiagnosticSummary!3v8mswd",
                    second: "DiagnosticSummary!30vin8",
                    direction: "column",
                  },
                },
                { title: "2", layout: null },
              ],
            },
          },
        ],
      });
    });
    it("empty tab layout", () => {
      expect(
        addPanelToTab(
          "DiagnosticSummary!4dpz3hc",
          undefined,
          undefined,
          { activeTabIdx: 0, tabs: [{ title: "1", layout: null }] },
          "Tab!3u9ypnk"
        )
      ).toEqual({
        configs: [
          {
            id: "Tab!3u9ypnk",
            config: { activeTabIdx: 0, tabs: [{ title: "1", layout: "DiagnosticSummary!4dpz3hc" }] },
          },
        ],
      });
    });
    it("no tab layout", () => {
      expect(addPanelToTab("DiagnosticSummary!48lhb5y", undefined, undefined, {}, "Tab!1pyr7sm")).toEqual({
        configs: [
          {
            id: "Tab!1pyr7sm",
            config: { activeTabIdx: 0, tabs: [{ title: "1", layout: "DiagnosticSummary!48lhb5y" }] },
          },
        ],
      });
    });
  });
});
