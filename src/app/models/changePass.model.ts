export class ChangePassModel {

    pkUser: number;
    nameComplete: string;
    password: string;
    img: string;

    constructor() {

        this.pkUser = 0;
        this.nameComplete = '';
        this.password = '';
        this.img = '';

    }

    onReset() {

        this.pkUser = 0;
        this.nameComplete = '';
        this.password = '';
        this.img = '';

    }
}
