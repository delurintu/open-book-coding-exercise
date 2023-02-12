import {
  Component, ElementRef, OnInit, ViewChild
} from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  @ViewChild('container')
  containerRef!: ElementRef;
  calculator!: HTMLElement;
  container!: HTMLElement;

  state: State = INITIAL_STATE;

  constructor(private calculatorRef: ElementRef) {}

  ngOnInit() {
    this.calculator = this.calculatorRef.nativeElement;
    this.container = this.containerRef?.nativeElement;
  }


  clickNumber(num: number) {
    if (this.state.newlyClickedOperator) {
      this.state.value = 0;
      this.state.newlyClickedOperator = false;
    }

    const newValue = this.state.value * 10 + num;
    if (newValue <= 100000) {
      this.state.value = newValue;
      this.state.newlyClickedNumber = true;
    }
  }

  clickOperator(operator: any) {
    switch (operator) {
      case Operator.add:
        this.updateStateOperations(this.state);
        this.displayLastPossibleValue();
        this.state.operator = operator;
        break;
      case Operator.minus:
        this.updateStateOperations(this.state);
        this.displayLastPossibleValue();
        this.state.operator = operator;
        break;
      case Operator.multiply:
        this.updateStateOperations(this.state);
        this.displayLastPossibleValue(true);
        this.state.operator = operator;
        break;
      case Operator.divide:
        this.updateStateOperations(this.state);
        this.displayLastPossibleValue(true);
        this.state.operator = operator;
        break;
      case Operator.equal:
        this.updateStateOperations(this.state, operator);
        this.state.operator = operator;
        this.state.value = this.evaluateOperations(this.state.operations);
        this.state.displayValue = 0;
        this.state.operations = [];
        break;
      case Operator.allClear:
        this.resetState();
        break;
    }
  }

  updateStateOperations(state: State, operator?: Operator) {
    if (this.onlyChangingOperator(state) && operator !== Operator.equal) {
      return;
    }

    this.state.newlyClickedNumber = false;
    this.state.newlyClickedOperator = true;

    let newOperation: Operation;
    if (
      state.operator === Operator.none ||
      state.operator === Operator.equal ||
      state.operator === Operator.allClear
    ) {
      newOperation = {
        value: state.value,
        func: add,
        operations: [],
      };
      state.operations.push(newOperation);
    }

    if (state.operator === Operator.add ) {
      newOperation = {
        value: state.value,
        func: add,
        operations: [],
      };
      state.operations.push(newOperation);
    }

    if (state.operator === Operator.minus) {
      newOperation = {
        value: state.value,
        func: minus,
        operations: [],
      };
      state.operations.push(newOperation);
    }

    if (
      state.operator === Operator.multiply
    ) {
      newOperation = {
        value: state.value,
        func: multiply,
        operations: [],
      };
      const lastOperation = state.operations[state.operations.length - 1];
      lastOperation.operations.push(newOperation);
    }

    if (
      state.operator === Operator.divide
    ) {
      newOperation = {
        value: state.value,
        func: divide,
        operations: [],
      };
      const lastOperation = state.operations[state.operations.length - 1];
      lastOperation.operations.push(newOperation);
    }
  }

  isMathematicOperator(operator: Operator) {
    return (
      operator === Operator.add ||
      operator === Operator.minus ||
      operator === Operator.multiply ||
      operator === Operator.divide
    );
  }

  onlyChangingOperator(state: State) {
    if (
      this.isMathematicOperator(state.operator) &&
      state.newlyClickedNumber === false
    ) {
      return true;
    }
    return false;
  }

  resetState() {
    this.state.operations = [];
    this.state.newlyClickedOperator = false;
    this.state.newlyClickedNumber = true;
    this.state.value = 0;
    this.state.displayValue = 0;
    this.state.operator = Operator.none;
  }

  evaluateOperations(operations: Operation[], onlyChildren = false) {
    const arr:any[] = [];
    let result = 0;
    operations.forEach((oper) => {
      const operFuncs = oper.operations.map((x) => x.func(x.value));
      if ((operFuncs && operFuncs.length > 0) || onlyChildren) {
        arr.push(oper.func(chain(...operFuncs)(oper.value)));
      } else {
        arr.push(oper.func(oper.value));
      }
    });
    if (arr && arr.length > 0) {
      const items = (onlyChildren && [arr[arr.length - 1]]) || arr;
      result = chain(...items)(0);
    }
    return result;
  }

  isActiveOperator(operator: any) {
    return this.state.operator === operator && this.state.newlyClickedOperator;
  }

  getDisplayValue() {
    let result = 0;
    if (this.state.newlyClickedNumber) {
      result = this.state.value;
    } else {
      result = this.state.displayValue || this.state.value;
    }
    result = <any>this.insertComma(result);
    return result;
  }

  displayLastPossibleValue(onlyChildren = false) {
    if (this.state.operations) {
      const latestValue = this.evaluateOperations(
        this.state.operations,
        onlyChildren
      );
      this.state.value = latestValue;
    }
  }

  insertComma(num: number) {
    num = this.roundUpTo(num, 4);
    let result = num + '';

    if (num >= 1000 && num <= 1000000) {
      const tmp = num.toString();

      const dotIndex = tmp.indexOf('.');
      let beforeDot = (dotIndex >= 0 && tmp.substr(0, dotIndex)) || tmp;
      const afterDot = (dotIndex >= 0 && tmp.substr(dotIndex)) || '';

      beforeDot = this.insertCommaFromRight(beforeDot);

      result = `${beforeDot}${afterDot}`;
    }
    return result;
  }

  insertCommaFromRight(str: string) {
    const left = str.substr(0, str.length - 3);
    const right = str.substr(str.length - 3);
    return `${left},${right}`;
  }

  roundUpTo(num: number, upTo: number) {
    const floored = Math.floor(num);
    const pow = Math.pow(10, upTo);
    let afterDot = num - floored;
    afterDot = afterDot * pow;
    afterDot = Math.round(afterDot);
    afterDot = afterDot / pow;
    return floored + afterDot;
  }

 private add(a: number): (b: number) => number {
  return (b) => a + b;
}

private minus(a: number): (b: number) => number {
  return (b) => b - a;
}

private multiply(a: number): (b: number) => number {
  return (b) => a * b;
}

private divide(a: number): (b: number) => number {
  return (b) => b / a;
}

private chain(...fns: ((a: number) => number)[]): (b: number) => number {
  return (b: number): number => fns.reduce((cur, fn) => fn(cur), b);
}
}




function add(a: number): (b: number) => number {
  return (b) => a + b;
}

function minus(a: number): (b: number) => number {
  return (b) => b - a;
}

function multiply(a: number): (b: number) => number {
  return (b) => a * b;
}

function divide(a: number): (b: number) => number {
  return (b) => b / a;
}

function chain(...fns: ((a: number) => number)[]): (b: number) => number {
  return (b: number): number => fns.reduce((cur, fn) => fn(cur), b);
}

export enum Operator {
  none = 'none',
  divide = 'divide',
  multiply = 'multiply',
  minus = 'minus',
  add = 'add',
  equal = 'equal',
  allClear = 'allClear',
}

const INITIAL_STATE: State = {
  value: 0,
  displayValue: 0,
  operator: Operator.none,
  newlyClickedOperator: false,
  newlyClickedNumber: false,
  operations: [],
};

export interface State {
  value: number;
  displayValue: number;
  operator: Operator;
  newlyClickedOperator: boolean;
  newlyClickedNumber: boolean;
  operations: Operation[];
}

interface Operation {
  value: number;
  func: (a: number) => (b: number) => number;
  operations: Operation[];
}


