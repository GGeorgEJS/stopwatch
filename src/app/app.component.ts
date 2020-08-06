import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, interval, NEVER, fromEvent } from 'rxjs';
import { startWith, scan, tap, filter, mergeMap, switchMap, debounce, debounceTime, buffer, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit {

  timer: number;
  timerStarted = false;
  timerObject$: Subject<{ pause?: boolean, timerValue?: number }> = new Subject();

  @ViewChild('wait', { static: false }) waitBtn: ElementRef;

  ngOnInit(): void {
    this.initializeCounter();
  }

  ngAfterViewInit(): void {
    this.waitTimer();
  }

  startTimer(): void {
    this.timerStarted = true;
    this.timerObject$.next({ pause: false });
  }

  stopTimer(): void {
    this.timerStarted = false;
    this.timerObject$.next({ pause: true, timerValue: 0 })
  }

  resetTimer(): void {
    this.timerObject$.next({ timerValue: 0 });
  }

  waitTimer(): void {
    let mouse$ = fromEvent(this.waitBtn.nativeElement, 'click');
    let buff$ = mouse$.pipe(debounceTime(300));
    mouse$
      .pipe(
        buffer(buff$),
        map(clicks => clicks.length),
        filter(clickLength => clickLength === 2),
      ).subscribe(() => {
        this.timerStarted = false;
        this.timerObject$.next({ pause: true });
      });
  }

  private initializeCounter(): void {
    this.timerObject$
      .pipe(
        startWith({ pause: true, timerValue: 0 }),
        scan((acc, curr) => ({ ...acc, ...curr })),
        tap(state => this.timer = state.timerValue),
        switchMap(state => state.pause ? NEVER : interval(1000).pipe(tap(val => {
          state.timerValue += 1;
          this.timer = state.timerValue;
        }))),
      ).subscribe();
  }


}
