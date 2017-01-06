import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }  from './login/login.component';
import { CreateUserComponent }  from './create-user/create-user.component';
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
  	}
];

export const routing = RouterModule.forRoot(appRoutes);