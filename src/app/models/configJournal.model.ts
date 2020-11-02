export class CJournalModel {

    pkConfigJournal: number;
    name: string;
    rate: number;
    mode: string;
    statusRegister: boolean;

    constructor() {
        this.pkConfigJournal = 0;
        this.name = '';
        this.rate = 0;
        this.mode = '';
        this.statusRegister = true;
    }

    onReset() {
        this.pkConfigJournal = 0;
        this.name = '';
        this.rate = 0;
        this.mode = '';
        this.statusRegister = true;
    }
}
