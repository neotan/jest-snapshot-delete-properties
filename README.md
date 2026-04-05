# jest-snapshot-delete-properties

Remove unwanted properties from Jest snapshots, keeping them clean and focused.

[![npm version](https://img.shields.io/npm/v/jest-snapshot-delete-properties)](https://www.npmjs.com/package/jest-snapshot-delete-properties)
[![license](https://img.shields.io/npm/l/jest-snapshot-delete-properties)](./LICENSE)

## Install

```bash
npm install --save-dev jest-snapshot-delete-properties
```

## Setup

Register the serializer in your Jest setup file (e.g. `setupTests.ts`):

```ts
import deleteProperties from "jest-snapshot-delete-properties";

expect.addSnapshotSerializer(
  deleteProperties(["data-testid", "data-tracking"])
);
```

## Usage

Any snapshot containing the specified properties will have them automatically removed:

```tsx
test("removes unwanted props from snapshot", () => {
  expect(
    <button data-testid="submit-btn" data-tracking="click" className="primary">
      Submit
    </button>
  ).toMatchSnapshot();
});
```

Produces:

```
exports[`removes unwanted props from snapshot`] = `
<button
  className="primary"
>
  Submit
</button>
`;
```

## API

### `deleteProperties(keys: string[])`

Returns a Jest snapshot serializer that strips the specified property names from React element snapshots.

- **keys** — array of property names to remove

## Requirements

- Node.js >= 18
- Jest >= 29

## License

[MIT](./LICENSE)
