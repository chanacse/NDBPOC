import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginInfoServiceClass } from '../service/logininfo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

import { ILoginInfo } from '../models/logininfo';


@Component({

    templateUrl: 'app/components/login.component.html'

})

export class logininfo implements OnInit {
    loginFrm: FormGroup;
    msg: string;
    user: ILoginInfo;
    valuePassed: any;

    constructor(private fb: FormBuilder, private _loginInfoService: LoginInfoServiceClass) { }

    ngOnInit(): void {

        this.loginFrm = this.fb.group({
            ID: [''],
            LoginName: ['', Validators.required],
            Password: ['', Validators.required],
            isActive: false,
            RoleType: [''],
            Email: [''],
            CurrentManager: ['']
        });

    }


    onSubmit(formData: any) {
        this.msg = "";

        this._loginInfoService.getLoginInfo(Global.BASE_LOGINDETAILS_ENDPOINT, formData._value.LoginName, formData._value.Password)
            .subscribe(localUser => { this.valuePassed = localUser; },
            error => this.msg = <any>error);
    }
}