import * as React from "react";
import snapshotRemoveProperties from "../";
import { shallow } from "enzyme";

expect.addSnapshotSerializer(snapshotRemoveProperties(["data-remove"]));

test("should remove attributes", () => {
  const component = shallow(
    <div data-remove="remove" id="div1">
      div1
    </div>
  );

  expect(component).toMatchSnapshot();
});
