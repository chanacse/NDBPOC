import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({

    templateUrl: 'app/components/samplefile.component.html'

})

export class samplefile implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('mymodalID') mymodalID: ModalComponent;
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

    generateProof(id: number) {
        //GET DATA FROM DATABASE
        this._sampleFileService.get(Global.BASE_HTMLTEMPLATE_ENDPOINT)
            .subscribe(data => { this.htmlTemplateData = data[0].Description; },
            error => this.msg = <any>error);
        //GET DATA FROM .CSV
        this.file = this.files.filter(x => x.FID == id)[0];
        this.readCSVFile(this.file.FilePath);
    }

    readCSVFile(filePath: string) {
        var reader = new FileReader();
        reader.onload = file => {
            var contents: any = file.target;
            this.htmlTemplateData = contents.result;
        };
        //reader.readAsText(filePath);
        //console.log(reader.readAsText(fileName));
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

    filterSampleFiles(companyName: any)
    {       
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

    ViewFile(id: number) {
        this.SetControlsState(true);
        this.modalTitle = "Approver Page";
        this.file = this.files.filter(x => x.FID == id)[0];
        this.fileFrm.setValue(this.file);
        this.mymodalObj.open();
    }

    CheckAdmin()
    {
        this.isAdmin = true; //ONLY FOR TESTING

        if (Global.BASE_USERROLE == 'admin')
        {
            this.isAdmin = true;
        }
    }

    ApproveSampleFile(paraFrm: any)
    {
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

    RejectSampleFile(paraFrm: any)
    {
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
}


