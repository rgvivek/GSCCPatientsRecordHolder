import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }  from './login/login.component';
import { SignUpComponent }  from './sign-up/sign-up.component';
import { MainComponent }  from './main/main.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { AddPatientComponent }  from './add-patient/add-patient.component';

const appRoutes: Routes = [
  	{
  		path: '',
  		redirectTo: "/main",
  		pathMatch:"full"
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'signup',
      component: SignUpComponent
    },{
      path: 'main',
      component: MainComponent
    },{
      path: 'patients',
      component: PatientsComponent
    },{
      path: 'patients/:id',
      component: PatientDetailComponent
    },{
    	path: 'detail/:id',
    	component: PatientDetailComponent
  	},{
      path: 'patients/new',
      component: AddPatientComponent
    }
];

export const routing = RouterModule.forRoot(appRoutes);