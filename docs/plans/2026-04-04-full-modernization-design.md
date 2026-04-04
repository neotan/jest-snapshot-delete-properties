# Full Modernization of jest-snapshot-delete-properties

**Date:** 2026-04-04
**Status:** Approved

## Goal

Modernize the repo: update all deps, replace Enzyme, drop Gulp, clean up config, add proper types, fix naming inconsistencies. Target Node 18+. Keep the serializer framework-agnostic.

## 1. Project Structure & Build

- Drop Gulp — use `rimraf` via npm script for cleaning
- Upgrade to TypeScript 5.x, target ES2020, module CommonJS
- Add `"files"` field in `package.json` (publish only `build/`)
- Add `build/` and `.idea/` to `.gitignore`, remove from git tracking
- Clean `tsconfig.json` — remove all commented boilerplate

## 2. Dependencies

**Drop:** `gulp`, `del`, `enzyme`, `enzyme-adapter-react-16`, `enzyme-to-json`, `raf`, `@types/enzyme`, `@babel/core`, `babel-jest`

**Update:** `jest` -> 29.x, `typescript` -> 5.x, `@types/jest` -> 29.x, `ts-jest` -> 29.x, `react` -> 18.x, `react-dom` -> 18.x, `@types/react` -> 18.x, `@types/react-dom` -> 18.x

**Add:** `rimraf` (dev)

Zero runtime dependencies.

## 3. Core Library

- Keep API: `deleteProperties(["prop1", "prop2"])` returns a Jest snapshot serializer
- Add TypeScript types to `test(val: unknown)` and `print(val: any, serialize: (val: any) => string)`
- Rename test file from `removeProperties.spec.tsx` to `deleteProperties.spec.tsx`

## 4. Testing

- Remove Enzyme setup entirely (`src/setupTests.ts`)
- Test the serializer with mock objects (unit) plus one React rendering integration test
- Use `react-test-renderer` for the integration test (lighter than RTL for this use case)

## 5. Config Cleanup

- `tsconfig.json`: minimal, no commented lines
- `jest.config.js`: update ts-jest config format, drop snapshotSerializers global config
- `.gitignore`: add `build/`, `.idea/`
- `package.json`: add `engines`, `files`, update scripts, bump to 1.0.0

## 6. Out of Scope

- ESM dual-publish
- CI/CD setup
- Changelog/release automation
