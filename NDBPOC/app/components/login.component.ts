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
    LoginFrm: FormGroup;

    constructor(private fb: FormBuilder, private _loginInfoService: LoginInfoServiceClass) { }

    ngOnInit(): void {

        this.LoginFrm = this.fb.group({
            ID: [''],
            LoginName: [''],
            Password: [''],
            isActive: false,
            RoleType: [''],
            Email: [''],
            CurrentManager: ['']
        });

    }
}