import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { samplefile } from './components/samplefile.component';
import { logininfo } from './components/login.component';
import { companyInfo } from './components/company.component';
import { UserInfo } from './components/user.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'samplefile', component: samplefile },
    { path: 'login', component: logininfo },
    { path: 'company', component: companyInfo },
    { path: 'userm', component: UserInfo },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);