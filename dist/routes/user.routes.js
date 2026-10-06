"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.get("/me", auth_1.authenticate, user_controller_1.me);
