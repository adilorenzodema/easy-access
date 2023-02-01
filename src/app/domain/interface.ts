import { User } from "./class";


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
  idTransito: number;
  codiceObu: string;
  dataImpegno: Date;
  flagAcknowledge: boolean;
  tipoValidazione: string;
  flagTransitato: boolean;
  dataDisattivazione: Date;
  idUserDisattivazione: number;
  dataDisimpegno: Date;
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
  descrizioneTipoPermesso: string;
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
