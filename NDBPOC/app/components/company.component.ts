import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyServiceClass } from '../service/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';
import { ICompany } from '../models/company';

@Component({
    templateUrl: 'app/components/company.component.html'
})

export class companyInfo implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('mymodalID') mymodalID: ModalComponent;
    @ViewChild('mygenerateProof') mygenerateProofID: ModalComponent;
    @ViewChild('myViewProof') myViewProofID: ModalComponent;
    @ViewChild('myFinalPrint') myFinalPrint: ModalComponent;
    @ViewChild('ViewCsvFile') viewCsv: ModalComponent;
    @ViewChild('mymodalID') mymodalObj: ModalComponent;

    companies: ICompany[];
    company: ICompany;
    msg: string;
    indLoading: boolean = false;
    fileFrm: FormGroup;
    frmApproval: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    userNameGlobal: string;
    modalBtnTitle: string;
    FileDetails: File;
    htmlTemplateData: string;
    listFilter: string;

    isAdmin: boolean;
    isProofGenerated: boolean;
    isSentForApproval: boolean;
    firstRowdata: any;
    CSVfileContent: any;
    //localFileData: string;
    templateVal: any;
    enablePrintAllButton = false;
    enablePrintFirstRecordButton = false;
    hideCheckBox = false;
    isFileUploadVisible = false;

    constructor(private fb: FormBuilder, private _sampleFileService: CompanyServiceClass) { }


    ngOnInit(): void {

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
    }


    LoadCompanies(): void {
        this._sampleFileService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(localcom => { this.companies = localcom; this.indLoading = false; },
            error => this.msg = <any>error);
    }


    //SAVE to DB
    addCompany() {
        this.dbops = DBOperation.create;
        this.isFileUploadVisible = true;
        this.SetControlsState(true);
        this.modalTitle = "Create Company";
        this.modalBtnTitle = "Create New Company";
        this.fileFrm.reset();
        this.modal.open();
    }

    editCompany(id: number) {
        this.dbops = DBOperation.update;
        this.isFileUploadVisible = false;
        this.SetControlsState(true);
        this.modalTitle = "Edit Company";
        this.modalBtnTitle = "Update";
        this.company = this.companies.filter(x => x.CID == id)[0];
        this.fileFrm.setValue(this.company);
        this.modal.open();
    }

    deleteCompany(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.company = this.companies.filter(x => x.CID == id)[0];
        this.isFileUploadVisible = false;
        this.fileFrm.setValue(this.company);
        this.modal.open();
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.fileFrm.enable() : this.fileFrm.disable();
    }

    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {
            case DBOperation.create:
                // this is to create data in DATABASE
                formData._value.ApprovalStatus = "Created";
                this._sampleFileService.post(Global.BASE_COMPANY_ENDPOINT, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully added.";
                            this.LoadCompanies();
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
                this._sampleFileService.put(Global.BASE_COMPANY_ENDPOINT, formData._value.CID, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully updated.";
                            this.LoadCompanies();
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
                this._sampleFileService.delete(Global.BASE_COMPANY_ENDPOINT, formData._value.CID).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully deleted.";
                            this.LoadCompanies();
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
   

    criteriaChange(value: any): void {
        if (value != '[object Event]')
            this.listFilter = value;
        else
            this.listFilter = value.target.value;
    }

    ViewFilePOPUP(id: number) {
        this.SetControlsState(true);
        this.modalTitle = "Approver Page";
        this.company = this.companies.filter(x => x.CID == id)[0];
        this.fileFrm.setValue(this.company);
        this.mymodalObj.open();
    }

    CheckAdmin() {
        this.isAdmin = false; //ONLY FOR TESTING

        this.userNameGlobal = Global.BASE_USERNAME;
        if (Global.BASE_USERROLE == 'admin') {
            this.isAdmin = true;
        }
        else {
            this.isAdmin = false;
        }
    }

    ApproveSampleFile(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Sample File Approved";
        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadCompanies();
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
                    this.LoadCompanies();
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



    ViewProofPOPUP(id: number) {
        this.company = this.companies.filter(x => x.CID == id)[0];
        this.fileFrm.setValue(this.company);
        this.SetControlsState(true);
        this.modalTitle = "Approve Proof";
        this.myViewProofID.open();
    }

    ApproveProof(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Proof Approved";
        paraFrm._value.ProofAuthor = "ChanakaG";
        paraFrm._value.ProofTime = Date.now();

        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadCompanies();
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
        paraFrm._value.ProofTime = Date.now();

        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadCompanies();
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

    GetHTMLTEMPLATEDataFromDB() {
        //GET DATA FROM DATABASE
        this._sampleFileService.get(Global.BASE_HTMLTEMPLATE_ENDPOINT)
            .subscribe(data => {
                this.htmlTemplateData = data[0].Description;
                this.CreatePopUpPageWithHTMLData();
            },
            error => this.msg = <any>error);

    }

    CreatePopUpPageWithHTMLData() {

        this.htmlTemplateData = this.htmlTemplateData.replace('param0', this.firstRowdata.split(",")[0]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param1', this.firstRowdata.split(",")[1]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param2', this.firstRowdata.split(",")[2]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param3', this.firstRowdata.split(",")[3]);
        this.htmlTemplateData = this.htmlTemplateData.replace('param4', this.firstRowdata.split(",")[5]);


    }

    GenerateProof(paraFrm: any) {
        paraFrm._value.ApprovalStatus = "Proof Created";
        this._sampleFileService.put(Global.BASE_SAMPLEFILE_ENDPOINT, paraFrm._value.FID, paraFrm._value).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Data successfully updated.";
                    this.LoadCompanies();
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
                    this.LoadCompanies();
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




    HideApproveSampleButtonByStatus(status: string) {

        if (status == "Created") {
            return false;
        }
        else {
            return true;
        }

    }

    HideApproveProofButtonByStatus(status: string) {

        if (status == "Sent For Approval") {
            return false;
        }
        else {
            return true;
        }

    }

    HideGenerateProofButtonByStatus(status: string) {

        if (status == "Sample File Approved" || status == "Proof Created") {
            return false;
        }
        else {
            return true;
        }

    }

    HideFinalPrintButtonByStatus(status: string) {
        if (status == "Proof Approved" || status == "First Print OK" || status == "Print All Done") {
            return false;
        }
        else {
            return true;
        }

    }

    HideEditDeleteButtonByStatus(status: string) {
        if (status == "Created") {
            return false;
        }
        else {
            return true;
        }
    }

    HideFirstPrintOK(status: any): any {

    }
}




