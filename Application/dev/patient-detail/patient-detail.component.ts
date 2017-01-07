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
	private patient:Patient = new Patient();

	constructor(private patientService: PatientService, private route: ActivatedRoute, private router: Router) { };
	ngOnInit(): void {
	  this.route.params.forEach((params: Params) => {
	    let id = +params['id'];
	    this.patient = new Patient();
	    if(id != 0){
	    	this.patientService.getPatient(id).subscribe(
                patient => {
                	this.patient = patient;
                	this.displayName = patient.firstname + " " + patient.lastname[0] + " " + patient.sex[0]+"/"+this.calculateAge(new Date(patient.dateofbirth));
                },
                error =>  this.errorMessage = <any>error);
        }
	  });
	}

	calculateAge(birthday:Date):string {
	    var ageDifMs = Date.now() - birthday.getTime();
	    var ageDate = new Date(ageDifMs); 
	    return Math.abs(ageDate.getUTCFullYear() - 1970);
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