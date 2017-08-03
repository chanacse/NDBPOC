import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersServiceClass } from '../service/user.service'
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUsers } from '../models/user';
import { IShareOfferCode } from '../models/shareoffercode';
import { IShareType } from '../models/sharetype';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';
import 'rxjs/add/operator/share';
import { Observer } from 'rxjs/Observer';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UsersFilterPipe } from '../filter/user.pipe';
import * as jsPDF from 'jspdf'
import { Router } from '@angular/router'
import { UtilityService } from '../service/utility.service';

@Component({
    templateUrl: 'app/components/user.component.html',
})

export class UserInfo implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    users: IUsers[];
    user: IUsers;
    userFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    myModalTitle: string;
    modalBtnTitle: string;
    msg: string;
    indLoading: boolean = false;
    listFilter: string;
    MyUserName: string;

    constructor(private fb: FormBuilder, private usersService: UsersServiceClass, private router: Router, private util: UtilityService) {
        //this.MyUserName = this.util.myUsername;
    }

    ngOnInit(): void {

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


    }

    Loadusers(): void {
        this.usersService.get(Global.BASE_USER_ENDPOINT)
            .subscribe(users => { this.users = users; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addCompany() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New User";
        this.modalBtnTitle = "Save";
        this.userFrm.reset();
        this.modal.open();
    }

    editFile(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.user = this.users.filter(x => x.ID == id)[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    }

    deleteFile(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete the User?";
        this.modalBtnTitle = "Delete";
        this.user = this.users.filter(x => x.ID == id)[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }

    onSubmit(formData: any) {
        this.msg = "";
        switch (this.dbops) {
            case DBOperation.create:
                this.usersService.post(Global.BASE_USER_ENDPOINT, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully Saved.";
                            this.Loadusers();
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
                this.usersService.put(Global.BASE_USER_ENDPOINT, formData._value.ID, formData._value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully updated.";
                            this.Loadusers();
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
                this.usersService.delete(Global.BASE_USER_ENDPOINT, formData._value.ID).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Data successfully deleted.";
                            this.Loadusers();
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
        else if (value == '--Select--')
            this.listFilter = null;
        else
            this.listFilter = value.target.value;
    }
}