/* tslint:disable:no-implicit-dependencies */
import "jest";
import "raf/polyfill";

import {configure} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});