"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: "user-app",
        template: "\n                \n<nav class=\"navbar navbar-inverse navbar-fixed-left\">\n  <a class=\"navbar-brand\" [routerLink]=\"['home']\">NDB POC</a>\n  <ul class=\"nav navbar-nav\">\n    <li><a [routerLink]=\"['home']\">Home</a></li>\n    <li><a [routerLink]=\"['samplefile']\">Sample File</a></li>\n  </ul>\n</nav>\n<div class=\"container\">\n <router-outlet></router-outlet>\n</div>\n",
        styles: ["\n    .navbar-fixed-left {\n  width: 140px;\n  position: fixed;\n  border-radius: 0;\n  height: 100%;\n}\n\n.navbar-fixed-left .navbar-nav > li {\n  float: none;  / Cancel default li float: left /\n  width: 139px;\n}\n\n.navbar-fixed-left + .container {\n  padding-left: 160px;\n}\n\n/ On using dropdown menu (To right shift popuped) /\n.navbar-fixed-left .navbar-nav > li > .dropdown-menu {\n  margin-top: -50px;\n  margin-left: 140px;\n}\n  "],
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map