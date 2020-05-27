export class JournalModel {
    pkJournal?: number;
    nameJournal: string;
    codeJournal: string;
    hourStart: string;
    hourEnd: string;
    statusRegister?: boolean;
  
    constructor() {
      this.pkJournal = 0;
      this.nameJournal = "";
      this.codeJournal = "";
      this.hourStart = "";
      this.hourEnd = "";
      this.statusRegister = true;
    }  
    onReset() {
      this.pkJournal = 0;
      this.nameJournal = "";
      this.codeJournal = "";
      this.hourStart = "";
      this.hourEnd = "";
    }
  }
  