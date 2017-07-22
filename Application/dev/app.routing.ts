import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }  from './login/login.component';
import { CreateUserComponent }  from './create-user/create-user.component';
import { MainComponent }  from './main/main.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { AddPatientComponent }  from './add-patient/add-patient.component';
import { ManageTestsComponent }  from './manage-tests/manage-tests.component';
import { ManageMedicinesComponent }  from './manage-medicines/manage-medicines.component';
import { ManageDoctorsComponent }  from './manage-doctors/manage-doctors.component';

const appRoutes: Routes = [
  	{
  		path: '',
  		redirectTo: "/main",
  		pathMatch:"full"
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'createUser',
      component: CreateUserComponent
    },{
      path: 'main',
      component: MainComponent
    },{
      path: 'patients',
      component: PatientsComponent
    },{
      path: 'patients/0',
      component: AddPatientComponent
    },{
      path: 'patients/:id',
      component: PatientDetailComponent
    },{
    	path: 'detail/:id',
    	component: PatientDetailComponent
  	},{
      path: 'manageTests',
      component: ManageTestsComponent
    },{
      path: 'manageMedicines',
      component: ManageMedicinesComponent
    },{
      path: 'manageDoctors',
      component: ManageDoctorsComponent
    }
];

export const routing = RouterModule.forRoot(appRoutes);