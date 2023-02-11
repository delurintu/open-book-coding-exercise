import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  expression: FormControl;

  commonExpressionsRegExp='^[-+]?[0-9]*\.?[0-9]+([-+*/]?([0-9]*\.?[0-9]+))*$'
  advancedExpressionsRegExp='^((sin|cos|tan+([0-9]+)))$'

   constructor(){
    this.expression = new FormControl('',[Validators.required, Validators.pattern(this.commonExpressionsRegExp)]);

   }

   validateExp() {
    console.log("Valid? :"+this.expression.valid)
    console.log("Evaluate expresion", this.solveExpression(this.expression.value))
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
