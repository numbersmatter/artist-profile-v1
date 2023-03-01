import type { Field } from "../../types";
import QuestionField from "./QuestionField";

export interface IQuestionFields {
  fields: Field[],
  responseValues: { [index:string]: string},

}

export default function QuestionFields(props: IQuestionFields) {
  const { fields, responseValues } = props;

  const errors: { [index: string]: undefined } = {};


  return (
    <>
      {
        fields.map((fieldData) => {
          const defaultValue = responseValues[fieldData.fieldId] ?? "";
          const fieldError = errors[fieldData.fieldId] ?? undefined;
          return (
            <div key={fieldData.fieldId} className="col-span-3 sm:col-span-2">
              <QuestionField data={fieldData} error={fieldError} defaultValue={defaultValue} />
            </div>
          )
        })
      }

    </>
  );
}