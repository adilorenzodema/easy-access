import { Area, Park, FasciaOraria } from "./class";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileCode: string;
  profileName: string;
}

export interface UserAssociated extends User {
  granted: boolean;
}

export interface ParkAssociated {
  idPark: number;
  namePark: string;
  associated: boolean;
}

export interface AreaAssociated {
  idArea: number;
  areaName: string;
  associated: boolean;
}

export interface Menu {
  id: number;
  code: string;
  name: string;
  route: string;
  icon: string;
}

export interface UserPermission {
  user: User;
  token: string;
  refreshToken: string;
  menu: Menu[];
}

export interface Transit {
  idTransit: number;
  codeObu: string;
  idGate: Gate;
  startDate: Date;
  flagAcknowledge: boolean;
  validationType: string;
  nackReason: string;
  flagPassed: boolean;
  endDate: Date;
  creationUser: number;
  creationDate: Date;
}

export interface Permission {
  idPermission: number;
  permissionType: PermissionType;
  category: Category;
  obu: Obu;
  validationStartDate: Date;
  issueValidationDate: Date;
  flagActive: boolean;
  startTime: string;
  endTime: string;
  validationDateStart: Date;
  validationDateEnd: Date;
  cancelationUser: number;
  cancelationDate: Date;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
  permissionStatus: PermissionSearchStatus;
  parkList: Park[];
}

export interface PermissionInterporto extends  Permission{
  license: string;
}

export type PermissionSearchStatus = 'ALL' | 'VALID' | 'EXPIRING' | 'EXPIRED';

export type Category = 'P' | 'T' | 'D';

export interface PermissionType {
  permissionTypeId: number;
  permissionTypeDesc: string;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
  timeslotList: FasciaOraria[];
}

export interface Obu {
  idObu: number;
  obuCode: string;
  nameReferenceObu: string;
  plate: string;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
}

export interface Gate {
  idGate: number;
  park: Park;
  gateDescription: string;
  flagActive: boolean;
  gateDirection: string;
  gateType: string;
  ipAntenna: string;
  portAntenna: number;
  codeAntenna: string;
  userAntenna: string;
  passwordAntenna: string;
  idUserDeactivation: number;
  deactivationDate: Date;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
  status: Status;
}

export interface GateAssociated {
  idGate: number;
  gateDescription: string;
  associated: boolean;
}

export interface ParkStatus {
  idPark: number;
  parkName: string;
  status: Status;
  incidentList: Incident[];
  areaList: String[];
}

export interface Incident {
  idIncident: number;
  errorCode: string;
  errorMessage: string;
  idGate: number;
  gateName: string;
  gateErrorCode: string;
  startDate: string;
  endDate: string;
  device: string;
}

export interface ErrorCode{
  errorCode: string;
  device: string;
}

export interface TableIncident {
  parkName: string;
  incident: Incident;
}

export interface Job {
  chronDescription: string;
  chronExpression: string;
  jobDescription: string;
  jobName: string;
  nextRunDate: Date;
  scheduled: boolean;
}

export interface GateStatus {
  antenna_id: string;
  lists: Lists;
  functionality: Functionality;
  status: DeviceStatus[];
}

export interface Functionality {
  antenna: string;
  barrier: string;
}

export interface Lists {
  efc: string;
  set: string;
  tlp: string;
  time: string;
}

export interface DeviceStatus {
  device_id: string;
  status: Status;
  error_code: string;
}
export interface Calendar {
  date: Date;
  flagHoliday: Boolean;
}

export interface EFC {
  efcCode: string;
  serviceProvider: string;
  flagActive: boolean;
}

export type Status = 'OK' | 'KO';

export type Domains = 'easyaccess' | 'interporto';

export interface Logs{
  nomeUtente: string;
  cognomeUtente?:string;
  date: Date;
  nomeOperazione: string;
  nomeComponente: string;
}
