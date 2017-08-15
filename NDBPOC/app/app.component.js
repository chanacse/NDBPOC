"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utility_service_1 = require("./service/utility.service");
var AppComponent = (function () {
    function AppComponent(_util) {
        this._util = _util;
    }
    AppComponent.prototype.logout = function () {
        this._util.status = false;
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "user-app",
        template: "\n                \n<nav class=\"navbar navbar-inverse navbar-fixed-left\" style=\"margin-left: -59px;\" *ngIf=\"this._util.status\">\n\n  <a class=\"navbar-brand\" style=\"color:red\">CMS Operations</a>\n  <ul class=\"nav navbar-nav\">\n    <li><a [routerLink]=\"['home']\">Home</a></li>\n    <li><a [routerLink]=\"['samplefile']\">Sample File</a></li>\n    <li><a [routerLink]=\"['samplefile']\">Actual File</a></li>\n  </ul>\n  \n  <a style=\"color:red\" class=\"navbar-brand\">Manage CMS</a>\n  <ul class=\"nav navbar-nav\">\n    <li><a [routerLink]=\"['company']\">Companies</a></li>\n    <li><a [routerLink]=\"['userm']\">Users</a></li>\n    <li><a [routerLink]=\"['#']\">Share Types</a></li>\n    <li><a [routerLink]=\"['#']\">Issue Numbers</a></li>\n  </ul>\n\n<a style=\"color:red\" class=\"navbar-brand\">Reports</a>\n<ul class=\"nav navbar-nav\">\n    <li><a [routerLink]=\"['powerbi']\">Power BI</a></li>\n</ul>\n\n<a style=\"color:red\" class=\"navbar-brand\">My Profile</a>\n<ul class=\"nav navbar-nav\">\n      <li><a [routerLink]=\"['login']\" (click)=\"logout()\">Log Out</a></li>\n</ul>\n\n</nav>\n<div class=\"container\">\n <router-outlet></router-outlet>\n</div>\n",
        styles: ["\n    .navbar-fixed-left {\n  width: 180px;\n  position: fixed;\n  border-radius: 0;\n  height: 100%;\n}\n\n.navbar-fixed-left .navbar-nav > li {\n  float: none;  / Cancel default li float: left /\n  width: 139px;\n}\n\n.navbar-fixed-left + .container {\n  padding-left: 160px;\n}\n\n/ On using dropdown menu (To right shift popuped) /\n.navbar-fixed-left .navbar-nav > li > .dropdown-menu {\n  margin-top: -50px;\n  margin-left: 140px;\n}\n  "],
    }),
    __metadata("design:paramtypes", [utility_service_1.UtilityService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map