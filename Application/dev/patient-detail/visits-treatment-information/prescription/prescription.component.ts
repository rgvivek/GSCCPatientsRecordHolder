import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from 'app/treatment/appointment';
import { MedicineCombinationIssued } from 'app/treatment/medicine-combination-issued';
import { MedicineIssued } from 'app/treatment/medicine-issued';
import { TreatmentService } from 'app/treatment/treatment.service';
import { Prescription } from 'app/treatment/prescription';
import { Doctor } from 'app/treatment/doctor';
import { Patient } from 'app/patient/patient';

@Component({
    selector: 'pd-prescription',
    templateUrl:"app/patient-detail/visits-treatment-information/prescription/prescription.html"
})

export class PrescriptionInformationComponent{
	@Input() doctors:Array<Doctor> = new Array<Doctor>();
	@Input() patient:Patient = new Patient();
	@Input() appointment:Appointment = null;
	private prescriptionList:Array<Prescription> = new Array<Prescription>();
	private fb: FormBuilder = new FormBuilder();
	
	private newPrescription:Prescription = new Prescription();
	
	private saveButtonClicked:boolean = false;
	private status:string = null;
	private editMode:boolean = false;
	
	constructor(private treatmentService: TreatmentService, private router: Router) {
	};

	getPrescriptionList(patientId:number):void{
		this.treatmentService.getPrescription(patientId).subscribe(
	        prescriptionList => {
	        	this.prescriptionList = prescriptionList
	        },
	        error =>  this.errorMessage = <any>error);
	};

	ngOnChanges(changes: any) {
		if(this.patient && this.patient.id){
			this.getPrescriptionList(this.patient.id);
		}
	}

	viewPrescription(prescription:Prescription):void{
		prescription.print = true;
		setTimeout(()=>{
			window.print();
			prescription.print = false;
		},500);
	}

	print():void{
		window.print();
	}

	editPrescription(prescription:Prescription):void{
		this.editMode = true;
		this.prescriptionForm = this.fb.group({
			'id': [prescription.id],
			'patientid': [this.patient.id],
			'appointmentid': [this.appointment.id],
			'doctorid': [prescription.doctorid, Validators.required],
			'comments': [prescription.comments, Validators.required]
		});
	}

	savePrescription(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.prescriptionForm.valid && this.prescriptionForm.dirty){
			this.treatmentService.savePrescription(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				if(this.prescriptionForm){
			  					this.prescriptionForm.markAsPristine();
			  				}
			  				this.newPrescription = new Prescription();
			  				this.editMode = false;
			  				this.successMessage = 'Prescription Saved Successfully';
			  				this.getPrescriptionList(this.patient.id);
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
	}
	
	cancel():void{
		this.editMode = false;
	}
}