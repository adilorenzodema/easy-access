import { Park, User } from "./class";


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
  idPermesso?: number;
  idTipoPermesso?: PermissionType;
  idObu?: Obu;
  dataInizioValidita: Date;
  dataFineValidita: Date;
  flagAnnullato: boolean;
  userAnnullamento?: number;
  dataAnnullamento?: Date;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;

}

export interface PermissionType {
  idPermissionType: number;
  permissionTypeDesc: string;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
}

export interface Obu {
  codiceObu: string;
  nomeRiferimentoObu: string;
  targa: string;
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
  userAntenna: string;
  passwordAntenna: string;
  idUserDeactivation: number;
  deactivationDate: Date;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
}
