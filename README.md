# SpreadSheet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

## Install dependencies

Run ```npm i``` to install all dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Formula syntax

Each cell can have as input either numbers, strings or formulas.
Formulas always begins with `=` symbol.
Three kind of operations are available:

- Basic operations between two cells/values: +, -, *, /
- Function for adding two or more values, or range of values: `=SUM()`
- Function for averaging two or more values, or range of values: `=AVG()`
```
Examples:
Adding the literals: "=SUM(A1,B5,3.34)", Adding a range: "=SUM(A3:A10)"
Average of literals: "=AVG(A1,B3,C4)", Average in a range: "=AVG(A1:A10)"
```
Note: No blank spaces in formulas!
