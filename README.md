# SpreadSheet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

## Previous requirements

Node.js has to be installed.

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

## Test Cases:

**Basic Operations:**
```
Set cell A1 with: 2, set cell A2 with 3.5
Do in some other cell:

=4/2 -> expect: 2           =A2*2 -> expect: 7       =3+B1 -> expect: error message!
=2.5-5 -> expect: -2.5      =A1*A2 -> expect: 7      =4/sh -> expect: error message!           
```
**SUM Operation**
```
Set cells A1,A2,A3 with: 2
Do in some other cell:

=SUM(A1,A2,A3) -> expect: 6      set B2 with: =SUM(B2,4) -> expect: error message!
=SUM(A1:A3) -> expect: 6        =SUM(A1,4,r) -> expect: error message!
```
**AVG Operation**
```
Set cells A1,A2,A3 with: 2
Do in some other cell:

=AVG(A1,,A2) -> expect: error message!      =AVG(A1:A3) -> expect: 2
=AVG(a1,A2,A3) -> expect: error message!    =AVG(A1,A2,-2) -> expect: 1
```
