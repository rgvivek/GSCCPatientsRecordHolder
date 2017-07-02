import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { User } from 'app/user/user';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable({
	providers: [CookieService]
})

export class TestService {
	// Resolve HTTP using the constructor
    constructor (private http: Http, private cookieService: CookieService, public router: Router) {
    	this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
    }
    
    // private instance variable to hold base url
    private testCategoryUrl = 'http://localhost:8000/testCategories'; 
    private testUrl = 'http://localhost:8000/tests'; 
    private header = {headers:{}};
    private isLoginSuccess : Boolen = false;
    loginSuccess:BehaviorSubject = new BehaviorSubject(null);

	getTestCategories() : Observable<TestCategory[]>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(this.testCategoryUrl, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	getTests() : Observable<Test>{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		return this.http.get(this.testUrl, this.header)
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
	}

	saveTestCategory(testCategory : TestCategory) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.testCategoryUrl, testCategory, this.header).map(this.extractData.bind(this))
                    .catch(this.handleError);
		return res;
	}

	saveTest(test : Test) : void{
		this.header.headers['x-access-token'] = this.cookieService.get('gscc-token');
		let res = this.http.post(this.testUrl, test, this.header).map(this.extractData.bind(this))
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