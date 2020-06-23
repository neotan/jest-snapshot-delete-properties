"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(keys) {
    return {
        test: (val) => {
            return (val &&
                typeof val === "object" &&
                val.hasOwnProperty("props") &&
                Object.keys(val.props).some((prop) => keys.some((key) => key === prop)));
        },
        print: (val, serialize) => {
            keys.forEach((key) => {
                delete val.props[key];
            });
            return serialize(val);
        },
    };
}
exports.default = default_1;
