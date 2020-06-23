export default function (keys: string[]): {
    test: (val: any) => boolean;
    print: (val: any, serialize: any) => any;
};
