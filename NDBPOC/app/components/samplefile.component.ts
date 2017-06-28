import { Component, OnInit, ViewChild } from '@angular/core';
import { SampleFileService } from '../service/samplefile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ISampleFile } from '../models/samplefile';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';


@Component({

    templateUrl: 'app/components/samplefile.component.html'

})

export class samplefile implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    files: ISampleFile[];
    file: ISampleFile;
    msg: string;
    indLoading: boolean = false;
    fileFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    constructor(private fb: FormBuilder, private _sampleFileService: SampleFileService) { }


    ngOnInit(): void {

        this.fileFrm = this.fb.group({
            FID: [''],
            CID: [''],
            Cname: ['', Validators.required],
            Fname: ['', Validators.required],
            ShareType: [''],
            OfferCode: [''],
            ApprovalStatus: [''],
            ApprovalComment: [''],
            FileStorage: [''],
            ChequeOption: [''],
            Description: [''],
            isPrintFirstRecord: false,
            isPrintFirstOK: false,
            isPrintAll: false,
            CreatedBy: ['']
        });

        this.LoadSampleFiles();

    }

    LoadSampleFiles(): void {
        this.indLoading = true;
        this._sampleFileService.get(Global.BASE_SAMPLEFILE_ENDPOINT)
            .subscribe(sampleFiles => { this.files = sampleFiles; this.indLoading = false; },
            error => this.msg = <any>error);

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
}


