import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { URLS } from '../assets/config'
@Injectable({
	providedIn: 'root'
})
export class MasterService {

	private url: string = URLS.api

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

  manageEquipment(payload:string) {
		return this.http.post<any>(this.url + "master/ManageEquipment",{payload:payload})
  }

  deleteEquipment(id:number) {
		return this.http.post<any>(this.url + "master/DeleteEquipment",{id:id})
  }
}
