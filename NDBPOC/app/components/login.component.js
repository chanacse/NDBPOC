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
var logininfo_service_1 = require("../service/logininfo.service");
var forms_1 = require("@angular/forms");
var global_1 = require("../Shared/global");
var router_1 = require("@angular/router");
var logininfo = (function () {
    function logininfo(fb, _loginInfoService, _router) {
        this.fb = fb;
        this._loginInfoService = _loginInfoService;
        this._router = _router;
    }
    logininfo.prototype.ngOnInit = function () {
        this.loginFrm = this.fb.group({
            ID: [''],
            LoginName: ['', forms_1.Validators.required],
            Password: ['', forms_1.Validators.required],
            isActive: false,
            RoleType: [''],
            Email: [''],
            CurrentManager: ['']
        });
    };
    logininfo.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this._loginInfoService.getLoginInfo(global_1.Global.BASE_LOGINDETAILS_ENDPOINT, formData._value.LoginName, formData._value.Password)
            .subscribe(function (localUser) {
            _this.valuePassed = localUser;
            if (_this.valuePassed) {
                _this._router.navigate(['./home']);
                global_1.Global.BASE_USERROLE = _this.valuePassed.RoleType;
            }
            else {
                alert('Failed to log');
            }
        }, function (error) { return _this.msg = error; });
    };
    return logininfo;
}());
logininfo = __decorate([
    core_1.Component({
        templateUrl: 'app/components/login.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, logininfo_service_1.LoginInfoServiceClass, router_1.Router])
], logininfo);
exports.logininfo = logininfo;
//# sourceMappingURL=login.component.js.map