export default function(keys: string[]) {
  return {
    test: (val) => (
        val
        && typeof val === 'object'
        && val.hasOwnProperty('props')
        && Object.keys(val.props).some((prop) => keys.some((key) => key === prop))
    ),
    print: (val, serialize) => {
      const newVal = { ...val, props: { ...val.props } };
      const newProps = {};
      keys.forEach((key) => {
        newProps[key] = { configurable: true };
      });
      Object.defineProperties(newVal.props, newProps);
      keys.forEach((key) => {
        delete newVal.props[key];
      });
      return serialize(newVal)
    },
  };
}
