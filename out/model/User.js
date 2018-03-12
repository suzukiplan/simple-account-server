"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(id, name) {
        this.id = id;
        this.name = name;
        this.registerDate = Math.floor(new Date().getTime() / 1000);
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map