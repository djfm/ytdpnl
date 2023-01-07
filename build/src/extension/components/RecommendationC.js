"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.RecommendationC = void 0;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var RecommendationC = function (rec) { return (react_1["default"].createElement("div", null,
    react_1["default"].createElement("a", { href: rec.url },
        react_1["default"].createElement(material_1.Box, { sx: {
                display: 'flex'
            } },
            react_1["default"].createElement(material_1.Box, { sx: { mr: 2 } },
                react_1["default"].createElement(material_1.Box, { component: 'img', alt: rec.title, className: 'yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded', src: rec.miniatureUrl, sx: {
                        width: 168,
                        height: 94
                    } })),
            react_1["default"].createElement(material_1.Box, null,
                react_1["default"].createElement(material_1.Typography, { variant: 'body2', component: 'span' }, rec.title)))))); };
exports.RecommendationC = RecommendationC;
exports["default"] = exports.RecommendationC;
