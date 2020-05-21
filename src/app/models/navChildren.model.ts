export class NavChildrenModel {
  pkNavChildren: number;
  fkNavFather: number;
  navChildrenText: string;
  navChildrenPath: string;
  navChildrenIcon: string;
  statusRegister?: boolean;
  isVisible: boolean;

  constructor() {
    this.pkNavChildren = 0;
    this.fkNavFather = 0;
    this.navChildrenText = "";
    this.navChildrenPath = "";
    this.navChildrenIcon = "";
    this.statusRegister = true;
    this.isVisible = true;
  }

  onReset() {
    this.pkNavChildren = 0;
    this.fkNavFather = 0;
    this.navChildrenText = "";
    this.navChildrenPath = "";
    this.navChildrenIcon = "";
  }
}
