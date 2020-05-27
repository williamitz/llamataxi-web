export class RateModel {
    pkRate: number;
    fkCategory: number;
    fkJournal: number;
    priceRate: number;
    statusRegister?: boolean;
  
    constructor() {
      this.pkRate = 0;
      this.fkCategory = 0;
      this.fkJournal = 0;
      this.priceRate = 0;
      this.statusRegister = true;
    }
  
    onReset() {
      this.pkRate = 0;
      this.fkCategory = 0;
      this.fkJournal = 0;
      this.priceRate = 0;
    }
  }
  