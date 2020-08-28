import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'occupied'})
export class OccupiedPipe implements PipeTransform {
    transform(value: boolean): string {
        return value ? 'Ocupado' : 'Libre';
    }
}