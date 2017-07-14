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
var samplefile_service_1 = require("../service/samplefile.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var jsPDF = require("jspdf");
var samplefile = (function () {
    function samplefile(fb, _sampleFileService) {
        this.fb = fb;
        this._sampleFileService = _sampleFileService;
        this.indLoading = false;
    }
    samplefile.prototype.ngOnInit = function () {
        this.fileFrm = this.fb.group({
            FID: [''],
            CID: [''],
            Fname: ['', forms_1.Validators.required],
            Cname: ['', forms_1.Validators.required],
            ShareType: ['', forms_1.Validators.required],
            OfferCode: ['', forms_1.Validators.required],
            ApprovalStatus: [''],
            ApprovalComment: [''],
            FileStorage: [''],
            ChequeOption: [''],
            Description: [''],
            isPrintFirstRecord: false,
            isPrintFirstOK: false,
            isPrintAll: false,
            CreatedBy: [''],
            FILEADD: [],
            FilePath: [''],
        });
        this.CheckAdmin();
        //Dropdown Items
        this.LoadCompanies();
        this.LoadShareOfferCodes();
        this.LoadShareTypes();
        //main ITEM
        this.LoadSampleFiles();
    };
    samplefile.prototype.LoadSampleFiles = function () {
        var _this = this;
        this.indLoading = true;
        this._sampleFileService.get(global_1.Global.BASE_SAMPLEFILE_ENDPOINT)
            .subscribe(function (sampleFiles) { _this.files = sampleFiles; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    samplefile.prototype.LoadCompanies = function () {
        var _this = this;
        this._sampleFileService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (localcom) { _this.companies = localcom; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    samplefile.prototype.LoadShareOfferCodes = function () {
        var _this = this;
        this._sampleFileService.get(global_1.Global.BASE_SHAREOFFERCODE_ENDPOINT)
            .subscribe(function (localshareoffer) { _this.shareoffercodes = localshareoffer; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    samplefile.prototype.LoadShareTypes = function () {
        var _this = this;
        this._sampleFileService.get(global_1.Global.BASE_SHARETYPE_ENDPOINT)
            .subscribe(function (localsharetype) { _this.sharetypes = localsharetype; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    samplefile.prototype.getFileDetails = function (event) {
        this.FileDetails = event.target.files[0];
    };
    samplefile.prototype.fileUpload = function () {
        var _this = this;
        var myFile = this.FileDetails;
        var formData = new FormData();
        formData.append('uploadFile', myFile, myFile.name);
        this._sampleFileService.fileupload(global_1.Global.BASE_FILESAVE_ENDPOINT, formData)
            .subscribe(function (error) { return _this.msg = error; });
    };
    samplefile.prototype.addFile = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Sample File";
        this.modalBtnTitle = "Add";
        this.fileFrm.reset();
        this.modal.open();
    };
    samplefile.prototype.editFile = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit File";
        this.modalBtnTitle = "Update";
        this.file = this.files.filter(function (x) { return x.FID == id; })[0];
        this.fileFrm.setValue(this.file);
        this.modal.open();
    };
    samplefile.prototype.deleteFile = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.file = this.files.filter(function (x) { return x.FID == id; })[0];
        this.fileFrm.setValue(this.file);
        this.modal.open();
    };
    samplefile.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.fileFrm.enable() : this.fileFrm.disable();
    };
    samplefile.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this.fileUpload();
                formData._value.FilePath = global_1.Global.BASE_FOLDER_PATH + this.FileDetails.name; //for testing purpose
                formData._value.ApprovalStatus = "Initiated";
                this._sampleFileService.post(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully added.";
                        _this.LoadSampleFiles();
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
                this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, formData._value.FID, formData._value).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully updated.";
                        _this.LoadSampleFiles();
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
                this._sampleFileService.delete(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, formData._value.FID).subscribe(function (data) {
                    if (data == 1) {
                        _this.msg = "Data successfully deleted.";
                        _this.LoadSampleFiles();
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
    samplefile.prototype.filterSampleFiles = function (companyName) {
        var _this = this;
        this.indLoading = true;
        //Filter Values and Re-Bind to GRID       
        this._sampleFileService.getLoginInfo(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, companyName.target.value)
            .subscribe(function (localFiles) { _this.files = localFiles; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    samplefile.prototype.criteriaChange = function (value) {
        if (value != '[object Event]')
            this.listFilter = value;
        else
            this.listFilter = value.target.value;
    };
    samplefile.prototype.ViewFilePOPUP = function (id) {
        this.SetControlsState(true);
        this.modalTitle = "Approver Page";
        this.file = this.files.filter(function (x) { return x.FID == id; })[0];
        this.fileFrm.setValue(this.file);
        this.mymodalObj.open();
    };
    samplefile.prototype.CheckAdmin = function () {
        this.isAdmin = false; //ONLY FOR TESTING
        if (global_1.Global.BASE_USERROLE == 'admin') {
            this.isAdmin = true;
        }
    };
    samplefile.prototype.ApproveSampleFile = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Sample File Approved";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadSampleFiles();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mymodalID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    samplefile.prototype.RejectSampleFile = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Sample File Rejected";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadSampleFiles();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mymodalID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    samplefile.prototype.generateProofPOPUP = function (id) {
        var _this = this;
        this.LoadSampleFiles();
        //GET DATA FROM DATABASE
        this._sampleFileService.get(global_1.Global.BASE_HTMLTEMPLATE_ENDPOINT)
            .subscribe(function (data) {
            _this.htmlTemplateData = data[0].Description;
            _this.file = _this.files.filter(function (x) { return x.FID == id; })[0];
            _this.GetFileContent();
            _this.htmlTemplateData = _this.htmlTemplateData.replace('param0', _this.firstRowdata.split(",")[0]);
            _this.htmlTemplateData = _this.htmlTemplateData.replace('param1', _this.firstRowdata.split(",")[1]);
            _this.htmlTemplateData = _this.htmlTemplateData.replace('param2', _this.firstRowdata.split(",")[2]);
            _this.htmlTemplateData = _this.htmlTemplateData.replace('param3', _this.firstRowdata.split(",")[3]);
            _this.htmlTemplateData = _this.htmlTemplateData.replace('param4', _this.firstRowdata.split(",")[5]);
            _this.SetControlsState(true);
            _this.modalTitle = "Generate Proof Page";
            _this.fileFrm.setValue(_this.file);
            _this.file.Description = _this.htmlTemplateData;
        }, function (error) { return _this.msg = error; });
        this.mygenerateProofID.open();
    };
    samplefile.prototype.GetFileContent = function () {
        var _this = this;
        var val = this.file.FilePath.split('/')[this.file.FilePath.split('/').length - 1];
        var fileNameOnly = val.split('.')[0];
        var localFileData = "";
        //READ THE CONTENT of LOCAL FILE
        this._sampleFileService.getLoginInfo(global_1.Global.BASE_FILESAVE_ENDPOINT, fileNameOnly)
            .subscribe(function (localFileDataX) {
            localFileData = localFileDataX;
            _this.firstRowdata = localFileData.split("\r\n")[1];
        }, function (error) { return _this.msg = error; });
    };
    samplefile.prototype.readCSVFile = function (filePath) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function (file) {
            var contents = file.target;
            _this.htmlTemplateData = contents.result;
        };
        //reader.readAsText(filePath);
        //console.log(reader.readAsText(fileName));
    };
    samplefile.prototype.GenerateProof = function (paraFrm) {
        var _this = this;
        paraFrm._value.ApprovalStatus = "Proof Created";
        this._sampleFileService.put(global_1.Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Data successfully updated.";
                _this.LoadSampleFiles();
            }
            else {
                _this.msg = "There is some issue in saving records, please contact to system administrator!";
            }
            _this.mygenerateProofID.dismiss();
        }, function (error) {
            _this.msg = error;
        });
    };
    //ViewPDFPOPUP(id: number) {
    //    this.LoadSampleFiles();
    //    //GET DATA FROM DATABASE
    //    this._sampleFileService.get(Global.BASE_HTMLTEMPLATE_ENDPOINT)
    //        .subscribe(data => {
    //            //this.htmlTemplateData = data[0].Description;
    //            //this.file = this.files.filter(x => x.FID == id)[0];
    //            //this.ViewPDFData(this.file.FID);          
    //            this.SetControlsState(true);
    //            this.modalTitle = "Generate PDF Page";
    //            //this.fileFrm.setValue(this.file);
    //            //this.file.Description = this.htmlTemplateData;
    //        },
    //        error => this.msg = <any>error);
    //    this.myPDFID.open();
    //}
    samplefile.prototype.viewPDF = function () {
        var doc = new jsPDF();
        doc.text(20, 20, 'Hello world!');
        doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        doc.addPage();
        doc.text(20, 20, 'Do you like that?');
        // Save the PDF
        doc.save('Test.pdf');
    };
    return samplefile;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], samplefile.prototype, "modal", void 0);
__decorate([
    core_1.ViewChild('mymodalID'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], samplefile.prototype, "mymodalID", void 0);
__decorate([
    core_1.ViewChild('mygenerateProof'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], samplefile.prototype, "mygenerateProofID", void 0);
__decorate([
    core_1.ViewChild('viewPDFData'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], samplefile.prototype, "myPDFID", void 0);
__decorate([
    core_1.ViewChild('mymodalID'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], samplefile.prototype, "mymodalObj", void 0);
samplefile = __decorate([
    core_1.Component({
        templateUrl: 'app/components/samplefile.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, samplefile_service_1.SampleFileService])
], samplefile);
exports.samplefile = samplefile;
//# sourceMappingURL=samplefile.component.js.map