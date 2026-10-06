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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const taskService = __importStar(require("../services/task.service"));
const task_schema_1 = require("../schemas/task.schema");
async function list(req, res) {
    const query = task_schema_1.listTasksQuerySchema.parse(req.query);
    res.json(await taskService.list(req.user, query));
}
async function getById(req, res) {
    const { id } = task_schema_1.idParamSchema.parse(req.params);
    res.json(await taskService.getById(req.user, id));
}
async function create(req, res) {
    const task = await taskService.create(req.user, req.body);
    res.status(201).json(task);
}
async function update(req, res) {
    const { id } = task_schema_1.idParamSchema.parse(req.params);
    res.json(await taskService.update(req.user, id, req.body));
}
async function remove(req, res) {
    const { id } = task_schema_1.idParamSchema.parse(req.params);
    await taskService.remove(req.user, id);
    res.status(204).send();
}
