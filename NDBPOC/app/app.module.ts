import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { HomeComponent } from './components/home.component';
import { SampleFileService } from './service/samplefile.service';
import { samplefile } from './components/samplefile.component';
import { Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal'
import { LoginInfoServiceClass } from './service/logininfo.service';
import { logininfo } from './components/login.component';
import { SampleFileFilterPipe } from './filter/samplefile.pipe';
import { SearchComponent} from './shared/search.shared'


@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, HttpModule, routing, Ng2Bs3ModalModule, FormsModule],
    declarations: [AppComponent, HomeComponent, samplefile, logininfo, SampleFileFilterPipe, SearchComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, SampleFileService, LoginInfoServiceClass],
    bootstrap: [AppComponent]
})

export class AppModule { }