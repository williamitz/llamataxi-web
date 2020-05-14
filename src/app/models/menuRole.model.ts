export class MenuRoleModel {
  pkMenuRole: number;
  fkNavChildren: number;
  role: string;
  statusRegister?: boolean;

  constructor() {
    this.pkMenuRole = 0;
    this.fkNavChildren = 0;
    this.role = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkMenuRole = 0;
    this.fkNavChildren = 0;
    this.role = "";
  }
}
