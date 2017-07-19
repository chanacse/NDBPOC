﻿import { Component, OnInit, ViewChild } from '@angular/core';
import { SampleFileService } from '../service/samplefile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

import { ISampleFile } from '../models/samplefile';
import { ICompany } from '../models/company';
import { IShareOfferCode } from '../models/shareoffercode';
import { IShareType } from '../models/sharetype';
import * as jsPDF from 'jspdf'
//import { FroalaEditorComponent } from 'ng2-froala-editor/ng2-froala-editor'; 

@Component({

    templateUrl: 'app/components/samplefile.component.html'
})

export class samplefile implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('mymodalID') mymodalID: ModalComponent;
    @ViewChild('mygenerateProof') mygenerateProofID: ModalComponent;
    @ViewChild('myViewProof') myViewProofID: ModalComponent;

    files: ISampleFile[];
    file: ISampleFile;
    msg: string;
    indLoading: boolean = false;
    fileFrm: FormGroup;
    frmApproval: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    companies: ICompany[];
    company: ICompany;
    shareoffercodes: IShareOfferCode[];
    shareoffercode: IShareOfferCode;
    sharetypes: IShareType[];
    sharetype: IShareType;
    FileDetails: File;
    htmlTemplateData: string;
    listFilter: string;
    @ViewChild('mymodalID') mymodalObj: ModalComponent;
    isAdmin: boolean;
    isProofGenerated: boolean;
    isSentForApproval: boolean;
    firstRowdata: any;
    //localFileData: string;
    templateVal: any;

    constructor(private fb: FormBuilder, private _sampleFileService: SampleFileService) { }


    ngOnInit(): void {

        this.fileFrm = this.fb.group({
            FID: [''],
            CID: [''],
            Fname: ['', Validators.required],
            Cname: ['', Validators.required],
            ShareType: ['', Validators.required],
            OfferCode: ['', Validators.required],
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
            ProofComment: [''],
            ProofAuthor: [''],
            ProofTime: [''],
        });

        this.CheckAdmin();
        //Dropdown Items
        this.LoadCompanies();
        this.LoadShareOfferCodes();
        this.LoadShareTypes();
        //main ITEM
        this.LoadSampleFiles();
    }

    LoadSampleFiles(): void {
        this.indLoading = true;
        this._sampleFileService.get(Global.BASE_SAMPLEFILE_ENDPOINT)
            .subscribe(sampleFiles => { this.files = sampleFiles; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    LoadCompanies(): void {
        this._sampleFileService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(localcom => { this.companies = localcom; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    LoadShareOfferCodes(): void {
        this._sampleFileService.get(Global.BASE_SHAREOFFERCODE_ENDPOINT)
            .subscribe(localshareoffer => { this.shareoffercodes = localshareoffer; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    LoadShareTypes(): void {
        this._sampleFileService.get(Global.BASE_SHARETYPE_ENDPOINT)
            .subscribe(localsharetype => { this.sharetypes = localsharetype; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    getFileDetails(event: any): void {
        this.FileDetails = event.target.files[0];
    }

    fileUpload() {
        let myFile: File = this.FileDetails;
        let formData = new FormData();
        formData.append('uploadFile', myFile, myFile.name);
        this._sampleFileService.fileupload(Global.BASE_FILESAVE_ENDPOINT, formData)
            .subscribe(error => this.msg = <any>error);
    }

    addFile() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Sample File";
        this.modalBtnTitle = "Add";
        this.fileFrm.reset();
        this.modal.open();
    }

    editFile(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit File";
        this.modalBtnTitle = "Update";
        this.file = this.files.filter(x => x.FID == id)[0];
        this.fileFrm.setValue(this.file);
        this.modal.open();
    }

    deleteFile(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.file = this.files.filter(x => x.FID == id)[0];
        this.fileFrm.setValue(this.file);
        this.modal.open();
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.fileFrm.enable() : this.fileFrm.disable();
    }

    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {
            case DBOperation.create:
                this.fileUpload();
                formData._value.FilePath = Global.BASE_FOLDER_PATH + this.FileDetails.name; //for testing purpose
                formData._value.FILEADD = null;
                formData._value.ApprovalStatus = "Initiated";
                this._sampleFileService.post(Global.BASE_SAMPLEFILE_ENDPOINT, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully added.";
                            this.LoadSampleFiles();
                        }
                        else {
                            this.msg = "There is some issue in saving records, please contact to system administrator!"
                        }

                        this.modal.dismiss();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.update:
                this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, formData._value.FID, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully updated.";
                            this.LoadSampleFiles();
                        }
                        else {
                            this.msg = "There is some issue in saving records, please contact to system administrator!"
                        }

                        this.modal.dismiss();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.delete:
                this._sampleFileService.delete(Global.BASE_SAMPLEFILE_ENDPOINT, formData._value.FID).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully deleted.";
                            this.LoadSampleFiles();
                        }
                        else {
                            this.msg = "There is some issue in saving records, please contact to system administrator!"
                        }

                        this.modal.dismiss();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;

        }
    }

    filterSampleFiles(companyName: any) {
        this.indLoading = true;
        //Filter Values and Re-Bind to GRID       
        this._sampleFileService.getLoginInfo(Global.BASE_SAMPLEFILE_ENDPOINT, companyName.target.value)
            .subscribe(localFiles => { this.files = localFiles; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    criteriaChange(value: any): void {
        if (value != '[object Event]')
            this.listFilter = value;
        else
            this.listFilter = value.target.value;
    }

    ViewFilePOPUP(id: number) {
        this.SetControlsState(true);
        this.modalTitle = "Approver Page";
        this.file = this.files.filter(x => x.FID == id)[0];
        this.fileFrm.setValue(this.file);
        this.mymodalObj.open();
    }

    CheckAdmin() {
        this.isAdmin = false; //ONLY FOR TESTING

        if (Global.BASE_USERROLE == 'admin') {
            this.isAdmin = true;
        }
    }

    ApproveSampleFile(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Sample File Approved";
        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadSampleFiles();
                }
                else {
                    this.msg = "There is some issue in saving records, please contact to system administrator!"
                }

                this.mymodalID.dismiss();
            },
            error => {
                this.msg = error;
            }
        );
    }

    RejectSampleFile(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Sample File Rejected";
        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadSampleFiles();
                }
                else {
                    this.msg = "There is some issue in saving records, please contact to system administrator!"
                }

                this.mymodalID.dismiss();
            },
            error => {
                this.msg = error;
            }
        );
    }

    generateProofPOPUP(id: number) {

        this.LoadSampleFiles();
        this.file = this.files.filter(x => x.FID == id)[0];
        this.GetFileContent();

        if (this.file.Description != null) {
            this.fileFrm.setValue(this.file);
            this.htmlTemplateData = this.file.Description;            
        }
        else {
            this.GetDataFromDB();
        }

        this.mygenerateProofID.open();
    }

    ViewProofPOPUP(id: number) {
        this.file = this.files.filter(x => x.FID == id)[0];
        this.fileFrm.setValue(this.file);
        this.SetControlsState(true);
        this.modalTitle = "Approve Proof";
        this.myViewProofID.open();
    }

    ApproveProof(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Proof Approved";
        paraFrm._value.ProofAuthor = "ChanakaG";
        paraFrm._value.PrrofTime = Date.now();

        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadSampleFiles();
                }
                else {
                    this.msg = "There is some issue in saving records, please contact to system administrator!"
                }

                this.myViewProofID.dismiss();
            },
            error => {
                this.msg = error;
            }
        );
    }

    RejectProof(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Proof Rejected";
        paraFrm._value.ProofAuthor = "ChanakaG";
        paraFrm._value.PrrofTime = Date.now();

        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadSampleFiles();
                }
                else {
                    this.msg = "There is some issue in saving records, please contact to system administrator!"
                }

                this.myViewProofID.dismiss();
            },
            error => {
                this.msg = error;
            }
        );
    }


    GetFileContent() {
        let val = this.file.FilePath.split('/')[this.file.FilePath.split('/').length - 1];
        let fileNameOnly = val.split('.')[0];
        let localFileData = '';

        //READ THE CONTENT of LOCAL FILE
        this._sampleFileService.getLoginInfo(Global.BASE_FILESAVE_ENDPOINT, fileNameOnly)
            .subscribe(localFileDataX => {
                localFileData = localFileDataX;
                this.firstRowdata = localFileData.split("\r\n")[1];               
            },
            error => this.msg = <any>error);
    }

    GetDataFromDB() {
        //GET DATA FROM DATABASE
        this._sampleFileService.get(Global.BASE_HTMLTEMPLATE_ENDPOINT)
            .subscribe(data => {
                this.htmlTemplateData = data[0].Description;
                this.CreatePopUpPageWithHTMLData();          
            },
            error => this.msg = <any>error);

    }

    CreatePopUpPageWithHTMLData()
    {
        if (this.file.ApprovalStatus == "Proof Created" || this.file.ApprovalStatus == "Sent For Approval") {
            this.isProofGenerated = true;
        }
        else { this.isProofGenerated = false; }
        if (this.file.ApprovalStatus == "Sent For Approval") {
            this.isSentForApproval = true;
        }
        else { this.isSentForApproval = false; }

        this.htmlTemplateData = this.htmlTemplateData.replace('param0', this.firstRowdata.split(",")[0]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param1', this.firstRowdata.split(",")[1]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param2', this.firstRowdata.split(",")[2]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param3', this.firstRowdata.split(",")[3]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param4', this.firstRowdata.split(",")[5]);

        this.SetControlsState(true);

        this.modalTitle = "Generate Proof Page";
        this.fileFrm.setValue(this.file);

        this.file.Description = this.htmlTemplateData;
        this.templateVal = this.htmlTemplateData;

                //alert(this.file.Description);
    }

    GenerateProof(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Proof Created";
        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadSampleFiles();
                }
                else {
                    this.msg = "There is some issue in saving records, please contact to system administrator!"
                }
                this.mygenerateProofID.dismiss();
            },
            error => {
                this.msg = error;
            }
        );
    }

    SendForApproval(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Sent For Approval";
        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadSampleFiles();
                }
                else {
                    this.msg = "There is some issue in saving records, please contact to system administrator!"
                }
                this.mygenerateProofID.dismiss();
            },
            error => {
                this.msg = error;
            }
        );
    }

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

    viewPDFTest(): void {
        var doc = new jsPDF();
        doc.text(20, 20, 'Hello world!');
        doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        doc.addPage();
        doc.text(20, 20, 'Do you like that?');

        // Save the PDF
        doc.save('Test.pdf');
    }

    viewPDF(data: any): void {

        var doc = new jsPDF();

        var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4RDwRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAExAAIAAAAeAAAIYgEyAAIAAAAUAAAIgIdpAAQAAAABAAAIlJybAAEAAAASAAAQ1uocAAcAAAgMAAAAVgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEFkb2JlIFBob3Rvc2hvcCBDUzIgTWFjaW50b3NoADIwMTA6MTE6MjUgMTU6NTE6NDkAAASgAQADAAAAAQABAACgAgAEAAAAAQAABqGgAwAEAAAAAQAACDTqHAAHAAAIDAAACMoAAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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PC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj48ZGM6dGl0bGU+PHJkZjpBbHQgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPk5EQiBMb2dvPC9yZGY6bGk+PC9yZGY6QWx0Pg0KCQkJPC9kYzp0aXRsZT48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94bXA6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIP/bAEMABAIDAwMCBAMDAwQEBAQFCQYFBQUFCwgIBgkNCw0NDQsMDA4QFBEODxMPDAwSGBITFRYXFxcOERkbGRYaFBYXFv/bAEMBBAQEBQUFCgYGChYPDA8WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFv/AABEIAfkGoQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APv6iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKaHBFADqKxfFfiTRfDdmlzrOoR2yyyCOFDlpJnPRI0GWdj6KCa0tPuTc2Ec8kMsBkXcY5QA6/XBIpJpuxfs5qCqOL5Xs+/oWKKKKZAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUVzfxb8caD8Ofh/qPjHxNLPDpemIHuHghMrgFgvCjk8mvB/wDhvf8AZ4/6DOtf+CeWgD6cor5j/wCG9/2eP+gzrX/gnlo/4b3/AGeP+gzrX/gnloA+nKK+Y/8Ahvf9nj/oM61/4J5aP+G9/wBnj/oM61/4J5aAPpyivmP/AIb3/Z4/6DOtf+CeWj/hvf8AZ4/6DOtf+CeWgD6cor5j/wCG9/2eP+gzrX/gnlo/4b3/AGeP+gzrX/gnloA+nKK+Y/8Ahvf9nj/oM61/4J5aP+G9/wBnj/oM61/4J5aAPpyivmP/AIb3/Z4/6DOtf+CeWj/hvf8AZ4/6DOtf+CeWgD6cor5j/wCG9/2eP+gzrX/gnlo/4b3/AGeP+gzrX/gnloA+nKK+Y/8Ahvf9nj/oM61/4J5aP+G9/wBnj/oM61/4J5aAPpyivmP/AIb3/Z4/6DOtf+CeWj/hvf8AZ4/6DOtf+CeWgD6cor5j/wCG9/2eP+gzrX/gnlo/4b3/AGeP+gzrX/gnloA+nKK+Y/8Ahvf9nj/oM61/4J5aP+G9/wBnj/oM61/4J5aAPpyivmP/AIb3/Z4/6DOtf+CeWlH7ev7PJIA1jWuf+oPL/hQB9N0V4t8F/wBp74cfFfxGNH8C2/iTUpAcTXC6HMtvbD1llI2oPqa9pGe9ABRRRQAUUUUAFIWAPNIWA6g15F8bPj94N8BiXT7WZdY1tOljbPxEfWR84Ufmfas6lWFKPNN2R3ZfluMzGsqGEpucuy6ebfRebPVdRvrWys5Lq6uIoIIV3SSyuFVB7k8Cvn34s/tLWkd//wAI98M7Btc1WdxDHdtExtwxOAEUfNIffoexNfP3xM+JXjz4q6/FY308sscsypa6RY5EWT04H3z7nn6V9OfstfBO18A6cNf1+JZ/ElxHjlQVsEY/cTtuPdhj0GOSfLjjKuMnyUNI9Zf5H6DV4Xy7hrCLF5y1VrP4KS+G/wDee7S62sumpf8AgX8M9Xsr3/hO/iPfy6v4snU+UJ3ymmxt/Ai9A3rjgdBXsAX/AD60nl/Ljin16lKnGnHlR+e5hmFfH13Wrb7JLRRS2UV0SCiiitDiCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPC/+CkQx+xj41OTxax4wf+mqV+OtfsX/AMFJP+TMPG3/AF6x/wDo5K/HSgBcj0FGR6CkooAXI9BRkegpKKAFyPQUZHoKSigBcj0FGR6CkooAXI9BRkegpKKAFyPQUZHoKSigBcj0FGR6CkooAXI9BRkegpKKAFyPQUZHoKSigBcj0FGR6Ckowc0ALkego49BSxxvI4RFLMxwFUZJ+gr6n/ZZ/Yj+IfxI+z654y8zwj4ek5U3Ef8Aptwv/TOIj5R7vj6UAfNXhLw/rfifXbfRvD2kXWqahdMEhtrWJndyewAr7k/Za/4J+3Fx9n1/41Xv2dTh18PWEvzkek0w6fRCf96vsL4DfBL4dfB/RBYeCfD9vaTuoW51CUeZd3OP78hGcf7IwPavQlGBgADNAGR4L8KeHvB/h6DQvC2jWWk6bbDEdrawhE+pxyT7nn1zWzRRQAUU0uo6n8KyvFfiPRfDelyarrupwWFnEMvLM2B+A6k+wzSbSV2VCE6klCCu3slrc1twxn2zXGfFX4neEPh/pr3PiDVUjlYfurSIh55T6Kmf54r58+NH7Ut7eiXTPh3A1tE37s6pcrl8+saZIA9zXztq19e6nqj6lqV3Pd3c3MtxPIXkc+7Ht7DFePis3hB8tLV/gfqfDnhji8Xavmb9nD+VfG/X+X53foesfGf9ojxf41WXT9EdtA0dsr5cEmbidT/fk/h+i4+teTaXZXuo6nFp2nQTXl7eTCOGCMb2kkPT3z7ngd8U7RtPvtW1KDTtMtJrq9upPLhgiXczt7f4n8a+1f2WvgnZ/D7TV1vW0juvEt1F+8l/htEP/LNOPzPU15dCjXx9Xmk9Or/yP0PN8zyfg/LuTDU0pP4YLeT7ye9vN+iGfsxfA+w8A6dHrmtol34kuI+XxlLFW/gj9/Vup9q9qRfkAAApdn6ds06vqaVKFKChBaI/nbM8zxeZ4qWKxc+ab/Bdl2QUUUVocAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAeGf8ABST/AJMw8bf9esf/AKOSvx0r9i/+Ckn/ACZh42/69Y//AEclfjpQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRS7T6H8q6j4S/Dnxr8TPEyaB4H8PXmr3pwZBAnyQKf45HPyovuxFAHLkHHQ+lewfs0/s2/E3406gj+HtHNlowcCbWr8FLaMd9vGZD7KD+FfZf7K/7BHhXwv9n1/4tyw+JNVB3ppUIIsLc/7ecNN+IC/7NfZOmWVrp+nxWNhawW1tAmyGGGMRpGOwCgYA+lAHg/7MH7Inww+EEMGpSWaeIvEqAFtXv4QfKf8A6YxcrGPflvevflUgYOPzz+FPooAKKKbvHOQRigALqO4/Ooru5it4HmlkWOOMbnd2Cqo9yelec/GX41+Dvh7HJDc3o1DVcfLp1o4LA/7bdEH1NfJHxk+NHjT4iTtDe3rafpYbKabZuVjYf9NG6uf09q4MVmNGhpuz7Ph3gXNc5aqcvs6X80uq/urd/l5n0D8a/wBprw94e83S/B0aa1qaEq1wTi2gPqT/ABn2FfLHxC8Z+JvHGtHU/E2qS3sufljJ2xRD/YToP881gdABgbVYkLnA5pRXzmJx1bEP3nZdj944f4SyzJIp4eF6nWb+L/gfIQgn7wJ7H5u1WtD06+1jV7fS9LtZLu8u5RFBDEuWkJ6Y9vftT/Dmk6jrutW2k6RZy3V5dyBIYo1yWJ7+w9zwK+3P2a/grpnw400alelL7xFdxjz7lhgQL/zzi44HqeCaeCwU8TPT4erM+KuK8LkGG5pe9Vkvdj+r7Jfjshn7MPwWsfhzo/8AamqBLvxJeJuuJwMi2X/nlH7ep4Jr2ALkDjp2zShcJgAA9eD1p1fW0qUKUFCCskfzNmWZYrMsVLFYqXNOX9WXZLogooorQ4QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPDP+Ckn/JmHjb/r1j/9HJX46V+x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ilg8NW7gqrZVtRcdh32epqx+yr8DLjxxeReJvFFvJD4cifdBC2Va/Yd/+ufv39K+z7Cxt7KzjtLOCOCCGMRxRxjaqKOwA6VeXZbz2q1tui7mHHXHawXPl2XS/e7Skvs+S/vd309djTrC2sLOK0soIreC3Ty4Yok2rGo6ACrQ6UUV9Ifgzbbbe4GmSSIkbO5CqgJYscAAd802eeKKGSWV1jSNSzs7AAAdST2HvX5v/wDBRH9r+bxVcXfw3+Fupyw6EhaLVdWgcq+oMOPLiPURDueC1Ai7/wAFG/2vW15r34X/AAt1KRNLUmHWdZt3wbw94YWHROzN36V8Ns2RjsOgxQxBGP6U2gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD9Kf8AgiR/yRLxh/2MK/8ApPHX2rXxV/wRI/5Il4w/7GFf/SeOvtWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPMP2wmx+zt4k4P/HsPT+8K+ef2WfgPc+Mp4fFHiqB4fD6Nvht3yr6gR36cR+/f0r7A8YeH9M8T6BNous2y3NlcY82JmIDAEHFXrS1htoY4YI0jjiUKiIoVVA7ADoPauGrgYVq6qT2S2Pr8r4uxGVZLUwGEVqk5NuXZNJWXm7PXp011TbKzhs7aO2tokihiUJHGg2qoHQADoParNFFdx8g3d3YVFdXNvbW8lxczJDFEpeSSRgqooGSzE8AAdzUtcf8bPh1pfxP8Bz+ENb1LVbPTbtwbpdNuvIe4Uf8s3YDlD3HegD4F/4KG/tgSeNEu/hv8Lr+WDw9vaPVdWj+RtSx/wAs4znIi9ehbuAOD8Wls/ljk5r9Uv8Ah358BcD/AJGTp0/tPj/0Gk/4d9fAb18R/wDgy/8AsaAPysor9U/+HfXwG9fEf/gy/wDsaP8Ah318BvXxH/4Mv/saAPysor9U/wDh318BvXxH/wCDL/7Gj/h318BvXxH/AODL/wCxoA/Kyiv1T/4d9fAb18R/+DL/AOxo/wCHfXwG9fEf/gy/+xoA/Kyiv1T/AOHfXwG9fEf/AIMv/saP+HfXwG9fEf8A4Mv/ALGgD8rKK/VP/h318BvXxH/4Mv8A7Gj/AId9fAb18R/+DL/7GgD8rKK/VP8A4d9fAb18R/8Agy/+xo/4d9fAb18R/wDgy/8AsaAPysor9U/+HfXwG9fEf/gy/wDsaP8Ah318BvXxH/4Mv/saAPysor9U/wDh318BvXxH/wCDL/7Gj/h318BvXxH/AODL/wCxoA/Kyiv1T/4d9fAb18R/+DL/AOxo/wCHfXwG9fEf/gy/+xoA/Kyiv1T/AOHfXwG9fEf/AIMv/saP+HfXwG9fEf8A4Mv/ALGgD8rKK/VP/h318BvXxH/4Mv8A7Gj/AId9fAb18R/+DL/7GgD8rKK/VP8A4d9fAb18R/8Agy/+xo/4d9fAb18R/wDgy/8AsaAPysor9U/+HfXwG9fEf/gy/wDsaP8Ah318BvXxH/4Mv/saAOU/4IlkL8EvF4zknxCvA/6946+1q82/Zs+CPg74H+HNQ0PwY1+bTU7sXc4vLjzSHCKnBwOy16TQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/2Q=='


        //HTML Data
        doc.fromHTML(data._value.Description, 20, 25, {
            'width': 220 // max width of content on PDF
        });
        //End

        doc.setFont('times')
        doc.setFontType('normal');
        doc.setFontSize(12)
        doc.text(20, 45, this.firstRowdata.split(',')[7]);

        doc.setFont('times')
        doc.setFontSize(12)
        doc.setFontType('normal')
        doc.text(20, 75, 'Please find below, a cheque for the value of rejected shares.');

        doc.setFontSize(9)
        doc.setFontType('normal')
        doc.text(50, 90, '*This is a computer generated document and so requires no signature.');


        //main cheque
        doc.rect(0, 150, 210, 100)
        //image
        doc.addImage(imgData, 'JPEG', 0, 152, 90, 30)

        //date field
        var today = new Date();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
        var yy = today.getFullYear();
        doc.setFontSize(14)
        doc.text(145, 174, 'Date');
        //yyyy
        doc.text(196, 174, yy.toString().charAt(3));
        doc.rect(160, 170, 5, 5)
        doc.text(191, 174, yy.toString().charAt(2));
        doc.rect(165, 170, 5, 5)
        doc.text(186, 174, yy.toString().charAt(1));
        doc.rect(170, 170, 5, 5)
        doc.text(181, 174, yy.toString().charAt(0));
        doc.rect(175, 170, 5, 5)
        //mm
        if (mm.toString().length < 2) {
            doc.text(176, 174, mm.toString().charAt(0));
            doc.rect(180, 170, 5, 5)
            doc.text(171, 174, '0');
            doc.rect(185, 170, 5, 5)
        }
        else {
            doc.text(176, 174, mm.toString().charAt(1));
            doc.rect(180, 170, 5, 5)
            doc.text(171, 174, mm.toString().charAt(0));
            doc.rect(185, 170, 5, 5)
        }
        //dd
        doc.text(166, 174, dd.toString().charAt(1));
        doc.rect(190, 170, 5, 5)
        doc.text(161, 174, dd.toString().charAt(0));
        doc.rect(195, 170, 5, 5)


        //text line 1:1
        doc.setFontSize(14)
        doc.text(7, 190, 'Pay to ');
        //text line 1:2
        doc.setFontSize(20)
        doc.text(25, 190, '**' + this.firstRowdata.split(',')[0] + '**');

        //text line 2:1
        doc.setFontSize(14)
        doc.text(7, 200, 'The sum of Rupees');
        //text line 2:2
        doc.setFontSize(20)
        doc.text(7, 210, '**' + this.firstRowdata.split(',')[8] + '**');

        //text line 3:1
        doc.setFontSize(14)
        doc.text(140, 200, 'Rs.');

        //text line 3:2
        doc.setFontSize(20)
        doc.text(150, 200, '**' + this.firstRowdata.split(',')[5] + '**');

        //text line 4:1
        doc.setFontSize(14)
        doc.text(150, 240, 'Authorized Officer');


        doc.save("ChequeDemo.pdf");
        doc.output('dataurlnewwindow');
    }
}




