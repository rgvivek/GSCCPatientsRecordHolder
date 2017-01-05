import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'app/patient/patient.service';
import { User } from 'app/user/user';

@Component({
    selector: 'nsf-login',
    templateUrl:"app/login/login.html"
})

export class LoginComponent implements OnInit{
	@Input() user = new User();
	constructor(private patientService: PatientService, private router: Router) { };
	ngOnInit(): void {
		this.user = new User();
	}
	login(): void {
	  this.patientService.loginUser(this.user).subscribe(
	  	result => {
	  		if(result.status === 0){
	  			let link = ['/main'];
	  			this.router.navigate(link);
	  		}
	  	},
	  	error =>  this.errorMessage = <any>error);
	  );
	}
}