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
