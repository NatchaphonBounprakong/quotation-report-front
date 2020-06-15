import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MasterService {

	private url: string = "https://localhost:44362/";

	constructor(private http: HttpClient) {
	}


	fetchEquipment() {
		return this.http.get<any>(this.url + "master/getequipments")
	}

	fetchCustomers() {
		return this.http.get<any>(this.url + "master/getcustomers")
	}

	fetchCustomerContact() {
		return this.http.get<any>(this.url + "master/getlistcustomercontact")
	}

	fetchSaleOffice() {
		return this.http.get<any>(this.url + "master/getsaleoffice")
	}


}
