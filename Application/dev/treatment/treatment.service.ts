import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { User } from 'app/user/user';
import { Appointment } from 'app/treatment/appointment';
import { Doctor } from 'app/treatment/doctor';
import { Diagnosis } from 'app/treatment/diagnosis';
import { MedicineCombinationIssued } from 'app/treatment/medicine-combination-issued';
import { MedicineIssued } from 'app/treatment/medicine-issued';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable({
	providers: [CookieService]
})

export class TreatmentService {
	// Resolve HTTP using the constructor
    constructor (private http: Http, private cookieService: CookieService, public router: Router) {
    	this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
    }
    
    // private instance variable to hold base url
    private visitsUrl = 'http://localhost:8000/visits';
    private medicationUrl = 'http://localhost:8000/medications'; 
    private doctorsUrl = 'http://localhost:8000/doctors'; 
    private diagnosisUrl = 'http://localhost:8000/diagnosis'; 
    private header = {headers:{}};
    private isLoginSuccess : Boolen = false;
    loginSuccess:BehaviorSubject = new BehaviorSubject(null);

	getDoctors() : Observable<Doctor[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(this.doctorsUrl, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}


	getVisits(patientId:number) : Observable<Appointment[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(`${this.visitsUrl}/${patientId}`, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	getDiagnosis(patientId:number) : Observable<Diagnosis[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(`${this.diagnosisUrl}/${patientId}`, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	getMedications(patientId:number) : Observable<MedicineCombinationIssued[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(`${this.medicationUrl}/${patientId}`, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	saveDoctor(doctor : Doctor) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.doctorsUrl, doctor, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	saveVisit(appointment : Appointment) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.visitsUrl, appointment, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	saveDiagnosis(diagnosis : Diagnosis) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.diagnosisUrl, diagnosis, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	saveMedication(medicineCombinationIssued : MedicineCombinationIssued) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.medicationUrl, medicineCombinationIssued, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	private extractData(res: Response) {
		let body = res.json();
		if(body && body.status != null){
			switch(body.status){
				case 4:{
					this.cookieService.put('gscc-token', null);
					this.header.headers['x-access-token'] = null;
					this.router.navigate(['/login']);
					break;
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