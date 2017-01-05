import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'nsf-add-patient',
    templateUrl:"app/add-patient/add-patient.html"
})

export class AddPatientComponent implements OnInit{
	public sexList:Array<string> = ['Male', 'Female'];
	private patient:Patient;

	constructor(private patientService: PatientService, private router: Router) { };
	ngOnInit(): void {
		this.patient = new Patient();
	}
	addPatient(): void {
	  this.patientService.savePatient(this.patient).subscribe(
	  	success => {
	  		let link = ['/patients'];
	  		this.router.navigate(link);
	  	},
	  	error =>  this.errorMessage = <any>error);
	  );
	}
}