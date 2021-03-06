"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var app_routing_1 = require("./app.routing");
var home_component_1 = require("./components/home.component");
var samplefile_service_1 = require("./service/samplefile.service");
var company_service_1 = require("./service/company.service");
var user_service_1 = require("./service/user.service");
var samplefile_component_1 = require("./components/samplefile.component");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var logininfo_service_1 = require("./service/logininfo.service");
var login_component_1 = require("./components/login.component");
var samplefile_pipe_1 = require("./filter/samplefile.pipe");
var company_pipe_1 = require("./filter/company.pipe");
var user_pipe_1 = require("./filter/user.pipe");
var search_shared_1 = require("./shared/search.shared");
var utility_service_1 = require("./service/utility.service");
var company_component_1 = require("./components/company.component");
var user_component_1 = require("./components/user.component");
var ng2_pdf_viewer_1 = require("ng2-pdf-viewer");
var ng2_ckeditor_1 = require("ng2-ckeditor");
//import { FroalaEditorModule } from 'ng2-froala-editor/ng2-froala-editor';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, http_1.HttpModule, app_routing_1.routing, ng2_bs3_modal_1.Ng2Bs3ModalModule, forms_1.FormsModule, ng2_ckeditor_1.CKEditorModule],
        declarations: [app_component_1.AppComponent, home_component_1.HomeComponent, samplefile_component_1.samplefile, login_component_1.logininfo, samplefile_pipe_1.SampleFileFilterPipe, company_pipe_1.CompanyFilterPipe, user_pipe_1.UsersFilterPipe, search_shared_1.SearchComponent, company_component_1.companyInfo, user_component_1.UserInfo, ng2_pdf_viewer_1.PdfViewerComponent],
        providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }, samplefile_service_1.SampleFileService, company_service_1.CompanyServiceClass, user_service_1.UsersServiceClass, logininfo_service_1.LoginInfoServiceClass, utility_service_1.UtilityService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map