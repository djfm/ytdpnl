"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var client_1 = require("react-dom/client");
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var theme_1 = __importDefault(require("./theme"));
var adminApiProvider_1 = __importStar(require("./adminApiProvider"));
var Server_1 = __importDefault(require("./Server"));
var elt = document.getElementById('app');
if (!elt) {
    throw new Error('No element with id "app" found');
}
(0, client_1.createRoot)(elt).render(react_1["default"].createElement(react_1["default"].StrictMode, null,
    react_1["default"].createElement(material_1.ThemeProvider, { theme: theme_1["default"] },
        react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
            react_1["default"].createElement(adminApiProvider_1["default"], { value: adminApiProvider_1.defaultAdminApi },
                react_1["default"].createElement(Server_1["default"], null))))));
