Task A.

- I wanted to create a RegEx to validate the form input
- The commonExpressionsRegExp only validates the common expression, i created one for the advanced expression (sin, cos and tan) but for now doesn t work properly

Task B.

- i used spilt() method with a regex to separate the expression and put the elements in an array to use the slice() to extract the them.
- i verified that the each element and make the calculation where it finds correct operators
- for now this works for common operators

// TODO, extend funtionality for advandes operators (sin,cos and tan)


Task C.

 - after some reseach, i discovered that is a better way to evaluate an expression, Shunting Yard Algorithm, so i used it.
 - still some issues with the sin, cos and tan operators.

 Task D.

- i created a new component where i implement a calculator for common calculations
- i didn't had more time to create the request for random data
- i think that for that it should be created a service and using HttpClient service from Angular for GET method 
- for responsive layout i would used media queries to define calculator's style for each screen orentation