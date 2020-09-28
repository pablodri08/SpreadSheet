import { BinaryOperatorExpr } from '@angular/compiler';
import { Component, OnInit, ValueSansProvider } from '@angular/core';
import Handsontable from 'handsontable';
import { stringify } from 'querystring';

const CELLPATTERN = '([A-Z]([1-9]|([1-4][0-9])|50))';
const NUMPATTERN = '((-)?[0-9]+(\\.[0-9]*)?)';
const ARGUMENT = '(' + NUMPATTERN + '|' + CELLPATTERN + ')';
const SUM = 'SUM\\(' + '((' + ARGUMENT + '(,' + ARGUMENT + ')+)|(' + CELLPATTERN + ':' + CELLPATTERN + '))\\)';
const AVG = 'AVG\\(' + '((' + ARGUMENT + '(,' + ARGUMENT + ')+)|(' + CELLPATTERN + ':' + CELLPATTERN + '))\\)';
const BASICOP = ARGUMENT + '(\\+|\\-|\\*|/)' + ARGUMENT;
let rowOnChange: number;
let colOnChange: number;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'SpreadSheet';
  hot: Handsontable;
  header = [];
  hooks: any;
  data: any[] = []
  ;
  constructor(
  ){}

  ngOnInit(): void{
    this.getStructure();
    this.initialize();
  }

  // Genera la planilla
  getStructure(): void {
    const cols = [];
    // Genera columnas
    for (let i = 1; i < 27; i++) {
      cols.push('');
    }
    this.data.push(cols);
    // Genera filas
    for (let i = 1; i < 50; i++) {
      const row = [];
      row.push('');
      this.data.push(row);
    }
  }

  initialize(): void{
    this.hot = new Handsontable(document.getElementById('hot'), {
      data: this.data,
      colHeaders: true,
      rowHeaders: true,
      licenseKey: 'non-commercial-and-evaluation',
      afterChange: (value) => {
        this.getChanges(value);
      }
    });
  }

  getChanges(value): void{
    try {
      if (value){
        const input = value[0][3];
        const row = value[0][0];
        const col = value[0][1];
        colOnChange = col;
        rowOnChange = row;
        // Controlo si el cambio es una fórmula
        if ((input) && (input.length > 3)) {
          const first = input.charAt(0).toString();
          let rest = input.slice(1, input.length);
          console.log(rest);
          switch (first) {
            case '=':
              console.log('Quiere operar');
              rest = rest.replace(/ /g, '');
              const result = this.operate(rest);
              this.hot.setDataAtCell(row, col, result, '');
              break;

            default:
              break;
          }
        }
      }
    } catch (e) {
        window.alert(e.message);
    }
  }

  // Identifica la operación y retorna el resultado
  operate(value: string): number {
    try {
      const regExpSum = new RegExp(SUM);
      const regExpAvg = new RegExp(AVG);
      const regExpBasicOp = new RegExp(BASICOP);
      let result: number;
      if (regExpSum.test(value)) {
        console.log('SUM detected\n');
        result = this.sumOperation(value.slice(4, value.length - 1));
      } else if (regExpAvg.test(value)) {
        console.log('AVG detected\n');
        result = this.avgOperation(value.slice(4, value.length - 1));
      } else if (regExpBasicOp.test(value)) {
        console.log('BASICOP detected\n');
        result = this.basicOperation(value);
      } else {
        throw new Error('Error en fórmula!');
      }
      return result;
    } catch (exception) {
      throw exception;
    }
  }

  // Resuelve el tipo de operación SUM
  sumOperation(value: string): number {
    try {
      let values: number[];
      let result = 0;
      values = this.getCells(value);
      const length = values.length;
      for (let i = 0; i < length; i++) {
        result = result + values[i];
      }
      return result;
    } catch (exception){
      throw exception;
    }
  }

  // Resuelve el tipo de operación AVG
  avgOperation(value: string): number {
    try {
      let result = 0;
      let values: number[];
      values = this.getCells(value);
      for (let i = 0; i < values.length; i++) {
        result = result + values[i];
      }
      result = result / values.length;
      return result;
    } catch (exception) {
      throw exception;
    }
  }

  // Resuelve operación básica entre dos celdas/valores
  basicOperation(value: string): number {
    let args: string[];
    let values: number[];
    let result: number;
    if (/.*\+.*/.test(value)) {
      args = value.split('+');
      values = this.getValues(args);
      result = values[0] + values[1];
      console.log('value[0]: ' + values[0]);
      console.log('value[1]: ' + values[1]);
      console.log('result: ' + result);
    } else if (/.*\-.*/.test(value)) {
      args = value.split('-');
      values = this.getValues(args);
      result = values[0] - values[1];
    } else if (/.*\*.*/.test(value)) {
      args = value.split('*');
      values = this.getValues(args);
      result = values[0] * values[1];
    } else if (/.*\/.*/.test(value)) {
      args = value.split('/');
      values = this.getValues(args);
      if (values[1] !== 0) {
        result = values[0] / values[1];
      } else {
        throw new Error('No es posible dividir entre 0!');
      }
    }
    return result;
  }

  // Construye el rango y retorna el valor numérico de sus componentes
  getCells(value: string): number[] {
    let range: string[];
    let values: number[];
    let args = new Array();
    try {
      if (/.*\:.*/.test(value)) {
        // Obtengo rango completo de celdas
        range = value.split(':');
        const first = Number(range[0].slice(1, range[0].length));
        const last = Number(range[1].slice(1, range[1].length));
        const cell = range[0].charAt(0).toString();
        for (let i = first; i < last + 1; i++) {
          args.push(String(cell + i));
        }
        values = this.getValues(args);
      } else {
        args = value.split(',');
        values = this.getValues(args);
      }
    } catch (exception){
      throw exception;
    }
    return values;
  }

  // Devuelve los valores numéricos de cada componente
  getValues(values: string[]): number[] {
    const numRegExp = new RegExp(NUMPATTERN);
    const cellRegExp = new RegExp(CELLPATTERN);
    const results = new Array();
    let col: number;
    let row: number;
    for (let i = 0; i < values.length; i++) {
      // Extraigo valor de celda si es necesario
      if (cellRegExp.test(values[i])) {
        col = values[i].charCodeAt(0);
        col = col % 'A'.charCodeAt(0);
        row = (parseInt((values[i].slice(1, values[i].length)), 10)) - 1;
        if ((row === rowOnChange) && (col === colOnChange)) {
          throw new Error('Celda actual aún no tiene un valor!');
        } else {
          const cellContent = this.hot.getDataAtCell(row, col);
          const stringContent = String(cellContent);
          if (!numRegExp.test(stringContent)) {
            throw new Error('El contenido de alguna celda ingresada es inválido!');
          }
          else {
            results.push(Number(cellContent));
          }
        }
      } else {
        results.push(Number(values[i]));
      }
    }
    return results;
  }

}
