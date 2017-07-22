import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Doctor } from 'app/treatment/doctor';
import { Router } from '@angular/router';
import { TreatmentService } from 'app/treatment/treatment.service';

@Component({
    selector: 'manage-doctors',
    templateUrl:"app/manage-doctors/manage-doctors.html"
})

export class ManageDoctorsComponent implements OnInit{
	private fb: FormBuilder = new FormBuilder();
	
	private newDoctor:Doctor = new Doctor();
	
	private saveButtonClicked:boolean = false;
	private status:string = null;
	private editMode:boolean = false;
	
	constructor(private treatmentService: TreatmentService, private router: Router) {
	};

	getDoctors():void{
		this.treatmentService.getDoctors().subscribe(
	        doctors => {
	        	this.doctors = doctors
	        },
	        error =>  this.errorMessage = <any>error);
	};

	ngOnInit(): void {
		this.getDoctors();
	};

	editDoctor(doctor:Doctor):void{
		this.editMode = true;
		this.doctorForm = this.fb.group({
			'id': [doctor.id],
			'degree' : [doctor.degree, Validators.required],
		    'name' : [doctor.name, Validators.required],
		    'additionaldetails' : [doctor.additionaldetails]
		});
	}

	saveDoctor(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.doctorForm.valid && this.doctorForm.dirty){
			this.treatmentService.saveDoctor(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.doctorForm.markAsPristine();
			  				this.newDoctor = new Doctor();
			  				this.editMode = false;
			  				this.successMessage = 'Doctor Saved Successfully';
			  				this.getDoctors();
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

	goBack(): void {
	  window.history.back();
	}
}