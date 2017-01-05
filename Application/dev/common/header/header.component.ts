import {Component, Input} from '@angular/core';
import { Header } from './header';
import { Router } from '@angular/router';
import { PatientService } from 'app/patient/patient.service';
import { User } from 'app/user/user';

@Component({
    selector: 'nsf-header',
    templateUrl:"app/common/header/header.html"
})
export class HeaderComponent {
	@Input() header: Header;
	public user: User = null;
	constructor(private patientService: PatientService, private router: Router) { };
	
	ngOnInit() {
		this.patientService.loginSuccess.subscribe(this.loginSuccess.bind(this));
	} 
	
	private loginSuccess(user: User) {
		if(user && user.firstname && user.lastname){
			this.user = new User();
    		let displayName = user.firstname[0] + user.lastname[0];
    		this.user.displayName = displayName.toUpperCase();
    		this.user.fullName =  user.firstname + " " + user.lastname;
    	}else{
    		this.user = null;
    	}
	}  
	
	goHome(): void {
	  	let link = ['/main'];
	  	this.router.navigate(link);
	}
	
	logout(): void{
		this.patientService.logoffUser();
	}
}