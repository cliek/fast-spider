"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tasks = (function () {
    function Tasks() {
        this.task = {};
    }
    Tasks.prototype.addTask = function (taskName, fn) {
        if (this.task.hasOwnProperty(taskName)) {
            console.error(taskName + " is already exists");
            return false;
        }
        this.task[taskName] = fn;
        return this.task;
    };
    Tasks.prototype.removeTask = function (taskName) {
        return delete this.task[taskName];
    };
    Tasks.prototype.getTask = function (tn) {
        return this.task[tn];
    };
    Tasks.prototype.getTasks = function () {
        return this.task;
    };
    return Tasks;
}());
exports.default = Tasks;
//# sourceMappingURL=index.js.map