export interface IMenuRole {
  pkMenuRole: number;
  fkNavChildren: number;
  role: string;
  statusRegister?: number;
}


export interface IMenu {
  pkMenuRole: number;
  fkNavChildren: number;
  navChildrenText: string;
  navChildrenPath: string;
  navChildrenIcon: string;
  role: string;
  isVisible: boolean;
}
