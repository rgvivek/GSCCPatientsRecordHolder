import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { Patient } from './patient';
import { PatientHistory } from './patient-history';
import { User } from 'app/user/user';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable({
	providers: [CookieService]
})

export class PatientService {
	// Resolve HTTP using the constructor
     constructor (private http: Http, private cookieService: CookieService, public router: Router) {
     	this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
     }
     // private instance variable to hold base url
     private patientsUrl = 'http://localhost:8000/patients'; 
     private patientHistoryUrl = 'http://localhost:8000/patientHistory'; 
     private femalePatientHistoryUrl = 'http://localhost:8000/femalePatientHistory'; 
     private header = {headers:{}};
     private isLoginSuccess : Boolen = false;
     loginSuccess:BehaviorSubject = new BehaviorSubject(null);

	authenticate() : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.post('http://localhost:8000/authenticate',{}, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
	}
	getPatients() : Observable<Patient[]>{
		return this.http.get(this.patientsUrl, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	getPatient(id:string) : Observable<Patient>{
		return this.http.get(`${this.patientsUrl}/${id}`, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	getPatientHistory(id:string) : Observable<Patient>{
		return this.http.get(`${this.patientHistoryUrl}/${id}`, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	savePatientHistory(patientHistory : PatientHistory) : void{
		let res = this.http.post(this.patientHistoryUrl, patientHistory, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	saveFemalePatientHistory(patientHistory : PatientHistory) : void{
		let res = this.http.post(this.femalePatientHistoryUrl, patientHistory, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	savePatient(patient : Patient) : void{
		let res = this.http.post(this.patientsUrl, patient, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	signUpUser(user : User) : void{
		let res = this.http.post('http://localhost:8000/signUp', user, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	loginUser(user : User) : void{
		let res = this.http.post('http://localhost:8000/login', user, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	logoffUser(): void{
		this.cookieService.put('gscc-token', null);
		this.header.headers['x-access-token'] = null;
		this.isLoginSuccess = false;
		this.loginSuccess.next(null);
		this.router.navigate(['/login']);
	}

	private extractData(res: Response) {
		let body = res.json();
		if(body && body.status != null){
			switch(body.status){
				case 4:{
					this.logoffUser();
					break;
				}
				case 0:{
					let expiryDate = new Date();
					expiryDate.setDate(expiryDate.getDate() + 30);
					this.cookieService.put('gscc-token', body.token, {expires:expiryDate});
					this.header.headers['x-access-token'] = body.token;
					this.loginSuccess.next(body.user);
					this.isLoginSuccess = true;
					break;
				}
				case 5:{
					if(this.isLoginSuccess === false){
						this.loginSuccess.next(body.user);
						this.isLoginSuccess = true;
					}
				}
			}
		}
		return body || { };
	}
	private handleError (error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
		  const body = error.json() || '';
		  const err = body.error || JSON.stringify(body);
		  errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
		  errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}