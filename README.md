# jest-snapshot-delete-properties

Remove unwanted properties from Jest snapshots, keeping them clean and focused.

[![npm version](https://img.shields.io/npm/v/jest-snapshot-delete-properties)](https://www.npmjs.com/package/jest-snapshot-delete-properties)
[![license](https://img.shields.io/npm/l/jest-snapshot-delete-properties)](./LICENSE)

## Why

Snapshots often capture noisy, non-deterministic, or test-only attributes such as
`data-testid`, tracking hooks, or generated ids. These add churn to your snapshot
diffs without describing real behavior. This serializer strips the properties you
name so snapshots stay stable and readable.

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

Any element in a snapshot that carries one of the named properties will have it
removed automatically, at any nesting depth:

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

Returns a Jest snapshot serializer that strips the given property names from
React-element nodes as they are serialized.

- `keys`: array of property names to remove.

The original values are never mutated, and nodes without matching properties are
left untouched. TypeScript type definitions are bundled with the package.

## Requirements

- Node.js >= 18
- Jest >= 29

## License

[MIT](./LICENSE)
