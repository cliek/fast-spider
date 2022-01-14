"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tasks = (function () {
    function Tasks() {
        this._task = {};
    }
    Tasks.prototype.addTask = function (taskName, fn) {
        if (this._task.hasOwnProperty(taskName)) {
            console.error(taskName + " is already exists");
            return false;
        }
        this._task[taskName] = fn;
        return this._task;
    };
    Tasks.prototype.removeTask = function (taskName) {
        return delete this._task[taskName];
    };
    Tasks.prototype.getTask = function (tn) {
        return this._task[tn];
    };
    Tasks.prototype.getTasks = function () {
        return this._task;
    };
    return Tasks;
}());
exports.default = Tasks;
//# sourceMappingURL=index.js.map