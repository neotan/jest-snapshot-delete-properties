"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const __1 = require("../");
const enzyme_1 = require("enzyme");
expect.addSnapshotSerializer(__1.default(["data-remove"]));
test("should remove attributes", () => {
    const component = enzyme_1.shallow(React.createElement("div", { "data-remove": "remove", id: "div1" }, "div1"));
    expect(component).toMatchSnapshot();
});
