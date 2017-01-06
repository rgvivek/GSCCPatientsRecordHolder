import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'nsf-patient-detail',
    templateUrl:"app/patient-detail/patient-detail.html"
})

export class PatientDetailComponent implements OnInit{
	private sexList:Array<string> = ['Male', 'Female'];
	private patient:Patient;

	constructor(private patientService: PatientService, private route: ActivatedRoute, private router: Router) { };
	ngOnInit(): void {
	  this.route.params.forEach((params: Params) => {
	    let id = +params['id'];
	    this.patient = new Patient();
	    if(id != 0){
	    	this.patientService.getPatient(id).subscribe(
                patient => this.patient = patient,
                error =>  this.errorMessage = <any>error);
        }
	  });
	}

	savePatient(): void {
	  this.patientService.savePatient(this.patient).subscribe(
	  	success => {
	  		alert('patient details saved');
	  		let link = ['/patients'];
	  		this.router.navigate(link);
	  	},
	  	error =>  this.errorMessage = <any>error);
	  );
	}

	goBack(): void {
	  window.history.back();
	}
}