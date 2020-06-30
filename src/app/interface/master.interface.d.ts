export interface equipment{
  AUTO_ID:number,
  NAME:string,
  TYPE:number
}

export interface quotationPaylod {
  AUTO_ID: number;
  NO: string;
  TYPE?: any;
  BOSS_RATE?: number;
  BOSS_SHIFT_1?: number;
  BOSS_SHIFT_2?: number;
  GUARD_MAN_RATE?: number;
  GUARD_MAN_SHIFT_1?: number;
  GUARD_MAN_SHIFT_2?: number;
  GUARD_WOMAN_RATE?: number;
  GUARD_WOMAN_SHIFT_1?: number;
  GUARD_WOMAN_SHIFT_2?: number;
  BAIL_RATE?: number;
  CREATE_DATE?: Date;
  CONTACT_ID?: number;
  SALE_OFFICE_ID?: number;
  EMPLOYEE_ID?: any;
  EQUIPMENT_ID: number[];
  NOTE: string[];
  CUSTOMER:string;
  CUSTOMER_CONTACT:string
  CUSTOMER_CONTACT_PHONE:string
}
