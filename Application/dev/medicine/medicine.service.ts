import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { User } from 'app/user/user';
import { Medicine } from 'app/medicine/medicine';
import { MedicinePurchase } from 'app/medicine/medicine-purchase';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable({
	providers: [CookieService]
})

export class MedicineService {
	// Resolve HTTP using the constructor
    constructor (private http: Http, private cookieService: CookieService, public router: Router) {
    	this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
    }
    
    // private instance variable to hold base url
    private medicineUrl = 'http://localhost:8000/medicines';
    private medicinePurchaseUrl = 'http://localhost:8000/medicinePurchase'; 
    private header = {headers:{}};
    private isLoginSuccess : Boolen = false;
    loginSuccess:BehaviorSubject = new BehaviorSubject(null);

	getMedicines() : Observable<Medicine[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(this.medicineUrl, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	getMedicinesPurchases(startDate:number, endDate:number) : Observable<MedicinePurchase[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(this.medicinePurchaseUrl + '?startDate='+startDate+'&endDate='+endDate, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	saveMedicine(medicine : Medicine) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.medicineUrl, medicine, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	saveMedicinePurchase(medicinePurchase : MedicinePurchase) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.medicinePurchaseUrl, medicinePurchase, this.header).map(this.extractData.bind(this))
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