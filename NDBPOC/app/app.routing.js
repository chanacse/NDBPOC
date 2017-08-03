"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_component_1 = require("./components/home.component");
var samplefile_component_1 = require("./components/samplefile.component");
var login_component_1 = require("./components/login.component");
var company_component_1 = require("./components/company.component");
var user_component_1 = require("./components/user.component");
var appRoutes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'samplefile', component: samplefile_component_1.samplefile },
    { path: 'login', component: login_component_1.logininfo },
    { path: 'company', component: company_component_1.companyInfo },
    { path: 'userm', component: user_component_1.UserInfo },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map