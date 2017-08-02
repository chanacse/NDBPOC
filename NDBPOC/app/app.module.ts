﻿import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { HomeComponent } from './components/home.component';
import { SampleFileService } from './service/samplefile.service';
import { samplefile } from './components/samplefile.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal'
import { LoginInfoServiceClass } from './service/logininfo.service';
import { logininfo } from './components/login.component';
import { SampleFileFilterPipe } from './filter/samplefile.pipe';
import { SearchComponent } from './shared/search.shared';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { UtilityService } from './service/utility.service';
import { companyInfo } from './components/company.component';
//import { FroalaEditorModule } from 'ng2-froala-editor/ng2-froala-editor';

@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, HttpModule, routing, Ng2Bs3ModalModule, FormsModule],
    declarations: [AppComponent, HomeComponent, samplefile, logininfo, SampleFileFilterPipe, SearchComponent, companyInfo],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, SampleFileService, LoginInfoServiceClass, UtilityService],
    bootstrap: [AppComponent]
})

export class AppModule { }