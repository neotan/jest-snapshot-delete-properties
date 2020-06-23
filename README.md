# Delete properties from snapshot

Use this serializer to remove any unwanted properties from snapshot, keeping it sparkling clean :sparkles:

## Install

Add the package as a dev dependency

```bash
# With npm
npm install --save-dev jest-snapshot-delete-properties

# With yarn
yarn add --dev jest-snapshot-delete-properties
```

[Register serializer with Jest](jest-snapshot-delete-properties) in your `setupTests.js`:

```js
import snapshotDeleteProperties from "jest-snapshot-delete-properties";

expect.addSnapshotSerializer(snapshotDeleteProperties(["want-to-delete-attr1", "want-to-delete-attr2"]));
```

## Vanilla JS Example

```js
test('should remove data attributes', () => {
  expect(<Component want-to-delete-attr1="bye" id="keep-me">Children</Component>).toMatchSnapshot();
});
```

Will output:

```js
exports[`should remove data attributes`] = `
<div
  id="keep-me"
>
  Children
</div>
`;
```
