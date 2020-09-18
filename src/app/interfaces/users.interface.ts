export interface IUser {
    pkPerson: number;
    pkDriver: number;
    pkUser: number;
    name: string;
    surname: string;
    nameComplete: string;
    document: string;
    email: string;
    phone: string;
    img: string;

    role: string;
    userName: string;
    verified: boolean;
    dateVerified: string;
    verifyReniec: boolean;
    fkUserVerified: string;
    statusSocket: boolean;
    dateRegister: string;

    nameCountry: string;
    prefixPhone: string;

    nameDocument: string;
    prefix: string;
    osId: string;
    isDriver: boolean;

}
