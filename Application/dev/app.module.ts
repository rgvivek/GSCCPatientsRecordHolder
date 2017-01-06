import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule, JsonpModule } from '@angular/http';
import { AgGridModule } from 'ag-grid-ng2/main';
import { routing }        from './app.routing';

import { AppComponent }  from './app.component';
import { PatientService } from './patient/patient.service';
import { HeaderComponent }  from './common/header/header.component';
import { FooterComponent }  from './common/footer/footer.component';
import { GnccInputComponent }  from './common/gncc-input/gncc-input.component';
import { Tab }  from './common/tabs/tab';
import { Tabs }  from './common/tabs/tabs';
import { LoginComponent }  from './login/login.component';
import { CreateUserComponent }  from './create-user/create-user.component';
import { MainComponent }  from './main/main.component';
import { PatientsComponent }  from './patients/patients.component';
import { PatientDetailComponent }  from './patient-detail/patient-detail.component';
import { GeneralInformationComponent }  from './patient-detail/general-information/general-information.component';
import { AddPatientComponent }  from './add-patient/add-patient.component';
import { UserService } from './user/user.service';

@NgModule({
  imports: [ 
  	BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    AgGridModule.withNg2ComponentSupport(),
  	routing
  ],
  declarations: [ 
  	AppComponent, 
  	HeaderComponent,
  	FooterComponent,
    GnccInputComponent,
    Tab,
    Tabs,
    LoginComponent,
    CreateUserComponent,
    MainComponent,
  	PatientsComponent,
  	PatientDetailComponent,
    AddPatientComponent,
    GeneralInformationComponent
  ],
  providers: [PatientService, UserService, CookieService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }