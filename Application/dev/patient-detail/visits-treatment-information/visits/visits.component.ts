import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from 'app/treatment/appointment';
import { MedicineCombinationIssued } from 'app/treatment/medicine-combination-issued';
import { MedicineIssued } from 'app/treatment/medicine-issued';
import { TreatmentService } from 'app/treatment/treatment.service';
import { Medicine } from 'app/medicine/medicine';
import { Doctor } from 'app/treatment/doctor';
import { Patient } from 'app/patient/patient';

@Component({
    selector: 'pd-visits',
    templateUrl:"app/patient-detail/visits-treatment-information/visits/visits.html"
})

export class VisitsInformationComponent{
	@Input() doctors:Array<Doctor> = new Array<Doctor>();
	@Input() medicines:Array<Medicine> = new Array<Medicine>();
	@Input() patient:Patient = new Patient();
	private visits:Array<Appointment> = new Array<Appointment>();
	private fb: FormBuilder = new FormBuilder();
	
	private newVisit:Appointment = new Appointment();
	
	private saveButtonClicked:boolean = false;
	private status:string = null;
	private editMode:boolean = false;
	
	constructor(private treatmentService: TreatmentService, private router: Router) {
	};

	getVisits(patientId:number):void{
		this.treatmentService.getVisits(patientId).subscribe(
	        visits => {
	        	this.visits = visits
	        },
	        error =>  this.errorMessage = <any>error);
	};

	ngOnChanges(changes: any) {
		if(this.patient && this.patient.id){
			this.getVisits(this.patient.id);
		}
	}

	editVisit(visit:Appointment):void{
		this.editMode = true;
		this.visitForm = this.fb.group({
			'id': [visit.id],
			'patientid': [this.patient.id],
			'doctorid': [visit.doctorid, Validators.required],
			'dateofappointment': [visit.dateofappointment, Validators.required],
			'timeofappointment' : [visit.timeofappointment, Validators.required],
		    'isactive' : [true]
		});
	}

	cancelVisit(visit:Appointment):void{
		this.editMode = false;
		this.saveAppointment({
			'id': visit.id,
		    'iscancelled' : true,
		    'isactive' : false
		}, 'Visit cancelled successfully');
	}

	saveVisit(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.visitForm.valid && this.visitForm.dirty){
			this.saveAppointment(formData)
		}
	}

	saveAppointment(formData:any, message:string):void{
		this.treatmentService.saveVisit(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				if(this.visitForm){
			  					this.visitForm.markAsPristine();
			  				}
			  				this.newVisit = new Appointment();
			  				this.editMode = false;
			  				this.successMessage = message || 'Visit Saved Successfully';
			  				this.getVisits(this.patient.id);
			  				break;
			  			}
			  			case 1:{
			  				this.status = 'error';
			  				this.errorMessage = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  {
			  		this.status = 'error';
			  		this.errorMessage = <any>error;
			  	}
			);
	}
	cancel():void{
		this.editMode = false;
	}
}