import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  expression: FormControl;
  resultArray: any = []


  commonExpressionsRegExp='^[-+]?[0-9]*\.?[0-9]+([-+*/]?([0-9]*\.?[0-9]+))*$'
  advancedExpressionsRegExp='^((sin|cos|tan+([0-9]+)))$'

   constructor(){
    this.expression = new FormControl('',[Validators.required, (Validators.pattern(this.commonExpressionsRegExp)||Validators.pattern(this.advancedExpressionsRegExp))]);

   }

   evaluateExp() {
    console.log("Valid? :"+this.expression.valid)
    console.log("Evaluate expresion", this.solveExpression(this.expression.value))
    console.log("evaluate using Shunting Yard Algorithm = ",this.validateAndEvaluate(this.expression.value))

      this.resultArray.push(this.expression.value + " = " +this.validateAndEvaluate(this.expression.value))
      console.log("result array = ", this.resultArray)
   }


   validateAndEvaluate(expression: string): number {
    const cosRegex = /cos\((-?\d+(\.\d+)?)\)/;
    const tokens = expression.match(/\d+|\+|\-|\*|\/|\(|\)|\^/g) || []; // extract individual tokens from expression
    const precedence: any = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
      "^": 3,
      "cos": 4
    }; // define operator precedence
    const outputQueue: any[] = [];
    const operatorStack: any[] = [];
  
    // Shunting Yard Algorithm
    tokens.forEach((token) => {
      if (/\d+/.test(token)) {
        outputQueue.push(Number(token)); // push operands to output queue
      }else if(cosRegex.test(token)){
        console.log("token = ",token)

      } 
      else if (/\+|\-|\*|\/|\^/.test(token)) {

        
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== "(" &&
          ((precedence[token] < precedence[operatorStack[operatorStack.length - 1]]) ||
          (precedence[token] === precedence[operatorStack[operatorStack.length - 1]] && token !== "^"))
        ) {
          outputQueue.push(operatorStack.pop()!); // pop operators with higher or equal precedence from operator stack and push to output queue
        }
        operatorStack.push(token); // push current operator to operator stack
      } else if (token === "(") {
        operatorStack.push(token); // push left parenthesis to operator stack
      } else if (token === ")") {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
          outputQueue.push(operatorStack.pop()!); // pop operators from operator stack and push to output queue until left parenthesis is encountered
        }
        if (operatorStack[operatorStack.length - 1] === "(") {
          operatorStack.pop(); // pop and discard left parenthesis
        }
      }
    });
  
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop()!); // pop any remaining operators from operator stack and push to output queue
    }
  
    // Evaluation of postfix expression
    const operandStack: any[] = [];

    outputQueue.forEach((token) => {
      if (typeof token === "number") {
        operandStack.push(token); // push operands to operand stack
      } else {
        const operand2 = operandStack.pop()!;
        const operand1 = operandStack.pop()!;
        let result;
        switch (token) { // apply operator to top two operands and push result to operand stack
          case "+":
            result = operand1 + operand2;
            break;
          case "-":
            result = operand1 - operand2;
            break;
          case "*":
            result = operand1 * operand2;
            break;
          case "/":
            result = operand1 / operand2;
            break;
          case "^":
            result = Math.pow(operand1, operand2);
            break;
          case "cos":
              result = Math.cos(operand1);
              break;
          default:
            throw new Error(`Invalid operator: ${token}`);
        }
        operandStack.push(result);
      }
    });
  
    if (operandStack.length !== 1) {
      throw new Error("Invalid expression"); // if there is more than one operand left on the operand stack, the expression is invalid
    }

    return operandStack.pop()!; 
  }

   splitExpressionValue(value:any){
    value = value.slice();

    while(value.length-1){
      if(value[1] === '*') value[0] = value[0] * value[2]
      if(value[1] === '-') value[0] = value[0] - value[2]
      if(value[1] === '+') value[0] = +value[0] + (+value[2])
      if(value[1] === '/') value[0] = value[0] / value[2]
      value.splice(1,1);
      value.splice(1,1);
    }
    return value[0];
  }
  
  solveExpression(eq:any) {
    let res = eq.split(/(\+|-)/g).map((x: string) => x.trim().split(/(\*|\/)/g).map(a => a.trim()));
    res = res.map((x: any) => this.splitExpressionValue(x)); 
     
    return this.splitExpressionValue(res)

  }
}
