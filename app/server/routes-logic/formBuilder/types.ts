

export type FieldTypes =
| "select"
| "date"
| "currency"
| "longText"
| "email"
| "shortText"
| "imageUpload";

export type Field = {
type: FieldTypes;
label: string;
fieldId: string;
options?: { value: string; label: string }[];
schema? : {
  optional: boolean,
  minLength:number,
  maxLenght: number,
 }
};
export interface Question {
fields: Field[];
name: string;
text: string;

}
export interface Questionform {
fieldOrder: string[];
fieldObj: { [key:string]:Field};
name: string;
text: string;

}
