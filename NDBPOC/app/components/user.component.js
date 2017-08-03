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
var forms_1 = require("@angular/forms");
var user_service_1 = require("../service/user.service");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
require("rxjs/add/operator/share");
var router_1 = require("@angular/router");
var utility_service_1 = require("../service/utility.service");
var UserInfo = (function () {
    function UserInfo(fb, usersService, router, util) {
        this.fb = fb;
        this.usersService = usersService;
        this.router = router;
        this.util = util;
        this.indLoading = false;
        //this.MyUserName = this.util.myUsername;
    }
    UserInfo.prototype.ngOnInit = function () {
        this.userFrm = this.fb.group({
            ID: [''],
            LoginName: [''],
            Password: [''],
            isActive: [''],
            RoleType: [''],
            Email: [''],
            CurrentManager: ['']
        });
        //Method Caling OnLoad
        this.Loadusers();
    };
    UserInfo.prototype.Loadusers = function () {
        var _this = this;
        this.usersService.get(global_1.Global.BASE_USER_ENDPOINT)
            .subscribe(function (users) { _this.users = users; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    UserInfo.prototype.addCompany = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New User";
        this.modalBtnTitle = "Save";
        this.userFrm.reset();
        this.modal.open();
    };
    UserInfo.prototype.editFile = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.user = this.users.filter(function (x) { return x.ID == id; })[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    };
    UserInfo.prototype.deleteFile = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete the User?";
        this.modalBtnTitle = "Delete";
        this.user = this.users.filter(function (x) { return x.ID == id; })[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    };
    UserInfo.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    UserInfo.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this.usersService.post(global_1.Global.BASE_USER_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully Saved.";
                        _this.Loadusers();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.update:
                this.usersService.put(global_1.Global.BASE_USER_ENDPOINT, formData._value.ID, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully updated.";
                        _this.Loadusers();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.delete:
                this.usersService.delete(global_1.Global.BASE_USER_ENDPOINT, formData._value.ID).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully deleted.";
                        _this.Loadusers();
                    }
                    else {
                        _this.msg = "There is some issue in saving records, please contact to system administrator!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
        }
    };
    UserInfo.prototype.criteriaChange = function (value) {
        if (value != '[object Event]')
            this.listFilter = value;
        else if (value == '--Select--')
            this.listFilter = null;
        else
            this.listFilter = value.target.value;
    };
    return UserInfo;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], UserInfo.prototype, "modal", void 0);
UserInfo = __decorate([
    core_1.Component({
        templateUrl: 'app/components/user.component.html',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UsersServiceClass, router_1.Router, utility_service_1.UtilityService])
], UserInfo);
exports.UserInfo = UserInfo;
//# sourceMappingURL=user.component.js.map