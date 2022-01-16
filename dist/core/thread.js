"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var Thread = (function () {
    function Thread(filePath, WorkerOptions) {
        this.worker = new worker_threads_1.Worker(filePath, WorkerOptions);
        this.threadId = this.worker.threadId;
        this.state = "IDLE";
    }
    Thread.prototype.setState = function (state) {
        this.state = state;
    };
    Thread.prototype.run = function (task) {
        this.worker.postMessage(task);
        this.state = 'BUSY';
    };
    return Thread;
}());
exports.default = Thread;
//# sourceMappingURL=thread.js.map