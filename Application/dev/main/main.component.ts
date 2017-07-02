import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'nsf-main',
    templateUrl:"app/main/main.html"
})
export class MainComponent implements OnInit{
	constructor(private patientService: PatientService, private router: Router) {
		this.patientService.loginSuccess.subscribe(this.setView.bind(this));
	};
	
	private isAdminView : boolean = false;
	private setView(user: User) {
		this.isAdminView = user && user.isadmin;
	} 

	goToPatients(): void {
	  let link = ['/patients'];
	  this.router.navigate(link);
	}
	addPatient() : void {
	  let link = ['/patients/0'];
	  this.router.navigate(link);
	}
	createUser() : void {
	  let link = ['/createUser'];
	  this.router.navigate(link);
	}
	manageTests() : void {
	  let link = ['/manageTests'];
	  this.router.navigate(link);
	}
	ngOnInit(): void {
		this.patientService.authenticate().subscribe(
                    patients => this.patients = patients,
                    error =>  this.errorMessage = <any>error);
	}
}