import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { samplefile } from './components/samplefile.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'samplefile', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'samplefile', component: samplefile }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);