"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-implicit-dependencies */
require("jest");
require("raf/polyfill");
const enzyme_1 = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
enzyme_1.configure({ adapter: new Adapter() });
