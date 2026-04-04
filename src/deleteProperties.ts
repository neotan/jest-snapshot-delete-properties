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
    print(val: unknown, serialize: (val: unknown) => string): string {
      if (!hasProps(val)) return serialize(val);
      const newProps = { ...val.props };
      for (const key of keys) {
        delete newProps[key];
      }
      return serialize({ ...val, props: newProps });
    },
  };
}
