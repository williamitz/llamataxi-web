export class AwardModel {

    pkAward: number;
    nameAward: string;
    description: string;
    points: number;
    stock: number;
    statusRegister: boolean;

    constructor() {
        this.pkAward = 0;
        this.nameAward = '';
        this.description = '';
        this.points = 0;
        this.stock = 0;
        this.statusRegister = true;
    }

    onReset() {
        this.pkAward = 0;
        this.nameAward = '';
        this.description = '';
        this.points = 0;
        this.stock = 0;
        this.statusRegister = true;
    }
}
