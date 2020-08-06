import { Pipe, PipeTransform } from "@angular/core";
import { PipeResolver } from '@angular/compiler';

@Pipe({ name: 'timer' })
export class Timer implements PipeTransform {
    transform(value: any, args?: any): any {
        const hours = Math.floor((value / 60) / 60);
        const minutes = Math.floor(value / 60) % 60;
        const seconds = value % 60;
        return `${this.padding(hours)}${hours}:${this.padding(minutes)}${minutes}:${this.padding(seconds)}${seconds}`;
    }

    private padding(time) {
        return time < 10 ? '0' : '';
    }
}