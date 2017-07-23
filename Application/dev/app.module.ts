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
import { HistoryInformationComponent }  from './patient-detail/history-information/history-information.component';
import { InvestigationInformationComponent }  from './patient-detail/investigation-information/investigation-information.component';
import { FamilyHistoryComponent }  from './patient-detail/history-information/family-history/family-history.component';
import { PersonalHistoryComponent }  from './patient-detail/history-information/personal-history/personal-history.component';
import { VisitsTreatmentInformationComponent }  from './patient-detail/visits-treatment-information/visits-treatment-information.component';
import { VisitsInformationComponent }  from './patient-detail/visits-treatment-information/visits/visits.component';
import { DiagnosisInformationComponent }  from './patient-detail/visits-treatment-information/diagnosis/diagnosis.component';
import { PrescriptionInformationComponent }  from './patient-detail/visits-treatment-information/prescription/prescription.component';
import { MedicationsInformationComponent }  from './patient-detail/visits-treatment-information/medications/medications.component';
import { HistoryOfIllnessComponent }  from './patient-detail/history-information/history-of-illness/history-of-illness.component';
import { MedicalHistoryComponent }  from './patient-detail/history-information/medical-history/medical-history.component';
import { CurrentMedicationsComponent }  from './patient-detail/history-information/current-medications/current-medications.component';
import { ObstetricHistoryComponent }  from './patient-detail/history-information/obstetric-history/obstetric-history.component';
import { GynaecologicalHistoryComponent }  from './patient-detail/history-information/gynaecological-history/gynaecological-history.component';
import { AddPatientComponent }  from './add-patient/add-patient.component';
import { ManageTestsComponent }  from './manage-tests/manage-tests.component';
import { ManageMedicinesComponent }  from './manage-medicines/manage-medicines.component';
import { ManageDoctorsComponent }  from './manage-doctors/manage-doctors.component';
import { UserService } from './user/user.service';
import { TestService } from './test/test.service';
import { MedicineService } from './medicine/medicine.service';
import { TreatmentService } from './treatment/treatment.service';


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
    GeneralInformationComponent,
    HistoryInformationComponent,
    InvestigationInformationComponent,
    FamilyHistoryComponent,
    PersonalHistoryComponent,
    VisitsTreatmentInformationComponent,
    VisitsInformationComponent,
    DiagnosisInformationComponent,
    MedicationsInformationComponent,
    PrescriptionInformationComponent,
    HistoryOfIllnessComponent,
    MedicalHistoryComponent,
    CurrentMedicationsComponent,
    ObstetricHistoryComponent,
    GynaecologicalHistoryComponent,
    ManageTestsComponent,
    ManageMedicinesComponent,
    ManageDoctorsComponent
  ],
  providers: [PatientService, UserService, CookieService, TestService, MedicineService, TreatmentService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }