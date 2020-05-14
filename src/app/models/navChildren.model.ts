export class NavChildrenModel {
  pkNavChildren: number;
  fkNavFather: number;
  navChildrenText: string;
  navChildrenPath: string;
  navChildrenIcon: string;
  statusRegister?: boolean;

  constructor() {
    this.pkNavChildren = 0;
    this.fkNavFather = 0;
    this.navChildrenText = "";
    this.navChildrenPath = "";
    this.navChildrenIcon = "";
    this.statusRegister = true;
  }

  onReset() {
    this.pkNavChildren = 0;
    this.fkNavFather = 0;
    this.navChildrenText = "";
    this.navChildrenPath = "";
    this.navChildrenIcon = "";
  }
}
