"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
var node_worker_threads_pool_1 = require("node-worker-threads-pool");
var Pool = new node_worker_threads_pool_1.DynamicPool(4);
exports.Pool = Pool;
//# sourceMappingURL=index.js.map