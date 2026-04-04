# Full Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize jest-snapshot-delete-properties — update all deps, drop Gulp/Enzyme, add types, clean config, fix naming.

**Architecture:** Single-function Jest snapshot serializer. No runtime deps. TypeScript 5 compiled to CommonJS targeting ES2020/Node 18+. Tests use mock objects for unit tests and react-test-renderer for integration.

**Tech Stack:** TypeScript 5, Jest 29, ts-jest 29, React 18, react-test-renderer, rimraf

---

## File Structure

After modernization, the repo will look like:

```
.gitignore              (modify - add build/, .idea/)
package.json            (modify - update deps, scripts, add files/engines)
tsconfig.json           (modify - clean up, target ES2020, TS5)
jest.config.js          (modify - update ts-jest config)
index.ts                (keep as-is)
src/deleteProperties.ts (modify - add types)
__tests__/deleteProperties.spec.tsx (rename + rewrite)
```

**Removed files:** `gulpfile.js`, `src/setupTests.ts`, `build/` (from git), `.idea/` (from git), `__tests__/removeProperties.spec.tsx`, `__tests__/__snapshots__/removeProperties.spec.tsx.snap`

---

### Task 1: Clean Git-Tracked Artifacts and Update .gitignore

**Files:**
- Modify: `.gitignore`
- Remove from git: `build/`, `.idea/`

- [ ] **Step 1: Update .gitignore**

Replace the entire `.gitignore` with:

```
node_modules
*.log
*-lock.json
build
.idea
```

- [ ] **Step 2: Remove build/ and .idea/ from git tracking**

Run:
```bash
git rm -r --cached build .idea
```
Expected: files listed as deleted from index

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: remove build artifacts and IDE config from git tracking"
```

---

### Task 2: Drop Gulp, Update package.json

**Files:**
- Modify: `package.json`
- Delete: `gulpfile.js`

- [ ] **Step 1: Delete gulpfile.js**

```bash
rm gulpfile.js
```

- [ ] **Step 2: Rewrite package.json**

Replace the full `package.json` with:

```json
{
  "name": "jest-snapshot-delete-properties",
  "version": "1.0.0",
  "description": "Delete properties from generated snapshots",
  "main": "./build/index.js",
  "types": "./build/index.d.ts",
  "files": [
    "build"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "clean": "rimraf build",
    "prebuild": "npm run clean",
    "build": "tsc",
    "test": "jest"
  },
  "keywords": [
    "jest",
    "react",
    "react-native",
    "snapshot",
    "test",
    "json"
  ],
  "author": "Neo Tan",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/neotan/jest-snapshot-delete-properties"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "jest": "^29.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-test-renderer": "^18.2.0",
    "rimraf": "^5.0.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 3: Commit (before install, to capture the change)**

```bash
git add package.json
git rm gulpfile.js
git commit -m "chore: drop Gulp, update deps to modern versions

Replace Gulp clean with rimraf. Update to Jest 29, TypeScript 5,
React 18, ts-jest 29. Add files/engines fields. Bump to 1.0.0."
```

- [ ] **Step 4: Delete old lock file and install fresh deps**

```bash
rm -f yarn.lock package-lock.json
npm install
```

Expected: clean install with no peer dep errors (warnings are OK)

- [ ] **Step 5: Commit lock file**

```bash
git add package-lock.json
git commit -m "chore: add fresh package-lock.json"
```

---

### Task 3: Clean Up tsconfig.json

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "jsx": "react",
    "declaration": true,
    "outDir": "./build",
    "baseUrl": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["index.ts", "src/**/*.ts"],
  "exclude": ["node_modules", "build", "__tests__"]
}
```

Key changes from old config:
- `strict: true` (was false)
- `target: ES2020` (was es6)
- `esModuleInterop: true` (replaces `allowSyntheticDefaultImports`)
- Added `include`/`exclude` to avoid compiling tests
- Removed all commented boilerplate

- [ ] **Step 2: Verify it compiles (will fail until we fix types in Task 4, that's OK)**

Run:
```bash
npx tsc --noEmit
```

Expected: type errors in `src/deleteProperties.ts` (no types yet) — this is expected and fixed in the next task.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: clean up tsconfig — strict mode, ES2020 target"
```

---

### Task 4: Add Types to Core Library

**Files:**
- Modify: `src/deleteProperties.ts`

- [ ] **Step 1: Rewrite src/deleteProperties.ts with proper types**

```typescript
interface ReactLikeElement {
  props: Record<string, unknown>;
  [key: string]: unknown;
}

function hasProps(val: unknown): val is ReactLikeElement {
  return (
    val !== null &&
    typeof val === 'object' &&
    Object.prototype.hasOwnProperty.call(val, 'props') &&
    typeof (val as ReactLikeElement).props === 'object' &&
    (val as ReactLikeElement).props !== null
  );
}

export default function deleteProperties(keys: string[]) {
  return {
    test(val: unknown): boolean {
      if (!hasProps(val)) return false;
      return Object.keys(val.props).some((prop) => keys.includes(prop));
    },
    print(val: ReactLikeElement, serialize: (val: unknown) => string): string {
      const newProps = { ...val.props };
      for (const key of keys) {
        delete newProps[key];
      }
      return serialize({ ...val, props: newProps });
    },
  };
}
```

Changes from original:
- Added `ReactLikeElement` interface and `hasProps` type guard
- `test()` uses `hasProps` instead of raw `hasOwnProperty` check
- `print()` simplified — no more `Object.defineProperties` trick, just spread-and-delete
- Uses `keys.includes()` instead of nested `.some()`
- Named export function instead of anonymous default

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/deleteProperties.ts
git commit -m "feat: add TypeScript types to core serializer

Add ReactLikeElement interface and hasProps type guard.
Simplify print() — use spread-and-delete instead of defineProperties."
```

---

### Task 5: Update Jest Config and Remove Enzyme Setup

**Files:**
- Modify: `jest.config.js`
- Delete: `src/setupTests.ts`

- [ ] **Step 1: Delete Enzyme setup file**

```bash
rm src/setupTests.ts
```

- [ ] **Step 2: Replace jest.config.js**

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.spec.+(ts|tsx)'],
};
```

Changes:
- Use `preset: 'ts-jest'` instead of manual globals/transform config (the old `globals.ts-jest.tsConfigFile` format is deprecated in ts-jest 29)
- Drop `setupFiles` (Enzyme setup removed)
- Drop `snapshotSerializers` (tests register their own)
- Drop `moduleFileExtensions` (ts-jest preset handles this)
- Use `testEnvironment: 'node'` (no DOM needed — the serializer works on object trees)

- [ ] **Step 3: Commit**

```bash
git rm src/setupTests.ts
git add jest.config.js
git commit -m "chore: update Jest config for Jest 29, remove Enzyme setup"
```

---

### Task 6: Rewrite Tests

**Files:**
- Create: `__tests__/deleteProperties.spec.tsx`
- Delete: `__tests__/removeProperties.spec.tsx`
- Delete: `__tests__/__snapshots__/removeProperties.spec.tsx.snap`

- [ ] **Step 1: Delete old test and snapshot**

```bash
rm __tests__/removeProperties.spec.tsx
rm __tests__/__snapshots__/removeProperties.spec.tsx.snap
```

- [ ] **Step 2: Write new test file `__tests__/deleteProperties.spec.tsx`**

```tsx
import * as React from 'react';
import deleteProperties from '../';

describe('deleteProperties', () => {
  const serializer = deleteProperties(['data-testid', 'data-remove']);

  describe('test()', () => {
    it('returns true for object with props containing a target key', () => {
      const val = { props: { 'data-testid': 'foo', id: 'bar' } };
      expect(serializer.test(val)).toBe(true);
    });

    it('returns false for object with props containing no target keys', () => {
      const val = { props: { id: 'bar', className: 'baz' } };
      expect(serializer.test(val)).toBe(false);
    });

    it('returns false for null', () => {
      expect(serializer.test(null)).toBe(false);
    });

    it('returns false for non-object', () => {
      expect(serializer.test('string')).toBe(false);
    });

    it('returns false for object without props', () => {
      expect(serializer.test({ id: 'bar' })).toBe(false);
    });
  });

  describe('print()', () => {
    it('removes target properties and serializes', () => {
      const val = {
        type: 'div',
        props: { 'data-testid': 'foo', 'data-remove': 'bar', id: 'keep' },
      };
      const serialize = (v: unknown) => JSON.stringify(v);
      const result = serializer.print(val as any, serialize);
      const parsed = JSON.parse(result);
      expect(parsed.props).toEqual({ id: 'keep' });
      expect(parsed.props).not.toHaveProperty('data-testid');
      expect(parsed.props).not.toHaveProperty('data-remove');
    });

    it('does not mutate the original value', () => {
      const val = {
        type: 'div',
        props: { 'data-testid': 'foo', id: 'keep' },
      };
      const serialize = (v: unknown) => JSON.stringify(v);
      serializer.print(val as any, serialize);
      expect(val.props).toHaveProperty('data-testid');
    });
  });

  describe('snapshot integration', () => {
    it('removes specified attributes from React element snapshot', () => {
      expect.addSnapshotSerializer(deleteProperties(['data-remove']));

      const element = React.createElement(
        'div',
        { 'data-remove': 'remove', id: 'div1' },
        'div1'
      );

      expect(element).toMatchSnapshot();
    });
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx jest --no-cache
```

Expected: all tests pass. The snapshot test will create a new snapshot on first run.

- [ ] **Step 4: Commit**

```bash
git rm __tests__/removeProperties.spec.tsx __tests__/__snapshots__/removeProperties.spec.tsx.snap
git add __tests__/deleteProperties.spec.tsx __tests__/__snapshots__/
git commit -m "test: rewrite tests — drop Enzyme, add unit + snapshot tests

Replace Enzyme shallow rendering with direct object tests and
React.createElement. Fix naming: removeProperties -> deleteProperties."
```

---

### Task 7: Final Verification and Cleanup

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: compiles to `build/` with no errors

- [ ] **Step 2: Run tests again**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 3: Verify published package contents**

```bash
npm pack --dry-run
```

Expected: only `build/` files, `package.json`, `README.md`, `LICENSE` are listed

- [ ] **Step 4: Delete stale snapshot directory if empty**

Check if `build/__tests__/` or other stale build artifacts exist from the old tracked `build/` and clean up any leftover files:

```bash
rm -rf build
npm run build
```

- [ ] **Step 5: Commit any remaining changes**

```bash
git add -A
git status
# Only commit if there are changes
git commit -m "chore: final cleanup after modernization"
```
