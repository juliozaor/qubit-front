import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css', providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true
    }
  ]
})
export class InputSearchComponent implements ControlValueAccessor{
  text: string = ""
  estaDeshabilitado: boolean = false

 
  controler(text: string){
    this.text = text
    this.onChange(text)
  }

  

  //Control value accesor interface
  onChange = (text: string)=>{}

  onTouched = ()=>{}

  writeValue(text: string): void {
    this.text = text
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.estaDeshabilitado = isDisabled
  }
}
