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
var company_service_1 = require("../service/company.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var companyInfo = (function () {
    function companyInfo(fb, _sampleFileService) {
        this.fb = fb;
        this._sampleFileService = _sampleFileService;
        this.indLoading = false;
        this.enablePrintAllButton = false;
        this.enablePrintFirstRecordButton = false;
        this.hideCheckBox = false;
        this.isFileUploadVisible = false;
    }
    companyInfo.prototype.ngOnInit = function () {
        this.fileFrm = this.fb.group({
            CID: [''],
            CName: [''],
            AccountNumber: [''],
            ContactName: [''],
            FaxNumber: [''],
            Email: [''],
            ApprovalComment: [''],
            CompanyStatus: false,
            ApprovalStatus: [''],
            CreatedBy: [''],
        });
        this.CheckAdmin();
        //main ITEM
        this.LoadCompanies();
    };
    companyInfo.prototype.LoadCompanies = function () {
        var _this = this;
        this._sampleFileService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (localcom) { _this.companies = localcom; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    //SAVE to DB
    companyInfo.prototype.addCompany = function () {
        this.dbops = enum_1.DBOperation.create;
        this.isFileUploadVisible = true;
        this.SetControlsState(true);
        this.modalTitle = "Create Company";
        this.modalBtnTitle = "Create New Company";
        this.fileFrm.reset();
        this.modal.open();
    };
    companyInfo.prototype.editCompany = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.isFileUploadVisible = false;
        this.SetControlsState(true);
        this.modalTitle = "Edit Company";
        this.modalBtnTitle = "Update";
        this.company = this.companies.filter(function (x) { return x.CID == id; })[0];
        this.fileFrm.setValue(this.company);
        this.modal.open();
    };
    companyInfo.prototype.deleteCompany = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.company = this.companies.filter(function (x) { return x.CID == id; })[0];
        this.isFileUploadVisible = false;
        this.fileFrm.setValue(this.company);
        this.modal.open();
    };
    companyInfo.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.fileFrm.enable() : this.fileFrm.disable();
    };
    companyInfo.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                // this is to create data in DATABASE
                formData._value.ApprovalStatus = "Created";
                this._sampleFileService.post(global_1.Global.BASE_COMPANY_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully added.";
                        _this.LoadCompanies();
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
                this._sampleFileService.put(global_1.Global.BASE_COMPANY_ENDPOINT, formData._value.CID, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully updated.";
                        _this.LoadCompanies();
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
                this._sampleFileService.delete(global_1.Global.BASE_COMPANY_ENDPOINT, formData._value.CID).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully deleted.";
                        _this.LoadCompanies();
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
    companyInfo.prototype.criteriaChange = function (value) {
        if (value != '[object Event]')
            this.listFilter = value;
        else
            this.listFilter = value.target.value;
    };
    companyInfo.prototype.ViewFilePOPUP = function (id) {
        this.SetControlsState(true);
        this.modalTitle = "Approver Page";
        this.company = this.companies.filter(function (x) { return x.CID == id; })[0];
        this.fileFrm.setValue(this.company);
        this.mymodalObj.open();
    };
    companyInfo.prototype.CheckAdmin = function () {
        this.isAdmin = false; //ONLY FOR TESTING
        this.userNameGlobal = global_1.Global.BASE_USERNAME;
        if (global_1.Global.BASE_USERROLE == 'admin') {
            this.isAdmin = true;
        }
        else {
            this.isAdmin = false;
        }
    };
    companyInfo.prototype.ApproveSampleFile = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Sample File Approved";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadCompanies();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mymodalID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    companyInfo.prototype.RejectSampleFile = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Sample File Rejected";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadCompanies();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mymodalID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    companyInfo.prototype.ViewProofPOPUP = function (id) {
        this.company = this.companies.filter(function (x) { return x.CID == id; })[0];
        this.fileFrm.setValue(this.company);
        this.SetControlsState(true);
        this.modalTitle = "Approve Proof";
        this.myViewProofID.open();
    };
    companyInfo.prototype.ApproveProof = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Proof Approved";
        paraFrm._value.ProofAuthor = "ChanakaG";
        paraFrm._value.ProofTime = Date.now();
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadCompanies();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.myViewProofID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    companyInfo.prototype.RejectProof = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Proof Rejected";
        paraFrm._value.ProofAuthor = "ChanakaG";
        paraFrm._value.ProofTime = Date.now();
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadCompanies();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.myViewProofID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    companyInfo.prototype.GetHTMLTEMPLATEDataFromDB = function () {
        var _this = this;
        //GET DATA FROM DATABASE
        this._sampleFileService.get(global_1.Global.BASE_HTMLTEMPLATE_ENDPOINT)
            .subscribe(function (data) {
            _this.htmlTemplateData = data[0].Description;
            _this.CreatePopUpPageWithHTMLData();
        }, function (error) { return _this.msg = error; });
    };
    companyInfo.prototype.CreatePopUpPageWithHTMLData = function () {
        this.htmlTemplateData = this.htmlTemplateData.replace('param0', this.firstRowdata.split(",")[0]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param1', this.firstRowdata.split(",")[1]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param2', this.firstRowdata.split(",")[2]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param3', this.firstRowdata.split(",")[3]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param4', this.firstRowdata.split(",")[5]);
    };
    companyInfo.prototype.GenerateProof = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Proof Created";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadCompanies();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mygenerateProofID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    companyInfo.prototype.SendForApproval = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Sent For Approval";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadCompanies();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mygenerateProofID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    companyInfo.prototype.HideApproveSampleButtonByStatus = function (status) {
        if (status == "Created") {
            return false;
        }
        else {
            return true;
        }
    };
    companyInfo.prototype.HideApproveProofButtonByStatus = function (status) {
        if (status == "Sent For Approval") {
            return false;
        }
        else {
            return true;
        }
    };
    companyInfo.prototype.HideGenerateProofButtonByStatus = function (status) {
        if (status == "Sample File Approved" || status == "Proof Created") {
            return false;
        }
        else {
            return true;
        }
    };
    companyInfo.prototype.HideFinalPrintButtonByStatus = function (status) {
        if (status == "Proof Approved" || status == "First Print OK" || status == "Print All Done") {
            return false;
        }
        else {
            return true;
        }
    };
    companyInfo.prototype.HideEditDeleteButtonByStatus = function (status) {
        if (status == "Created") {
            return false;
        }
        else {
            return true;
        }
    };
    companyInfo.prototype.HideFirstPrintOK = function (status) {
    };
    return companyInfo;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "modal", void 0);
__decorate([
    core_1.ViewChild('mymodalID'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "mymodalID", void 0);
__decorate([
    core_1.ViewChild('mygenerateProof'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "mygenerateProofID", void 0);
__decorate([
    core_1.ViewChild('myViewProof'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "myViewProofID", void 0);
__decorate([
    core_1.ViewChild('myFinalPrint'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "myFinalPrint", void 0);
__decorate([
    core_1.ViewChild('ViewCsvFile'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "viewCsv", void 0);
__decorate([
    core_1.ViewChild('mymodalID'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], companyInfo.prototype, "mymodalObj", void 0);
companyInfo = __decorate([
    core_1.Component({
        templateUrl: 'app/components/company.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, company_service_1.CompanyServiceClass])
], companyInfo);
exports.companyInfo = companyInfo;
//# sourceMappingURL=company.component.js.map