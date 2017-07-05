import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { samplefile } from './components/samplefile.component';
import { logininfo } from './components/login.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'samplefile', component: samplefile },
    { path: 'login', component: logininfo }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);