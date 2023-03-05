import { json, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";


export async function loader({params}:LoaderArgs) {
  const questionId = params.questionId ?? "no-questionId"

  const fieldValues: {[key:string]: string} = {}
  const fields: Field[] = []

  return json({fields , fieldValues});
}


export default function QuestionId() {
  const {fields , fieldValues} = useLoaderData<typeof loader>();
  const actionData = useActionData();

  const errors = actionData?.error ?? {}
  
  
  return (
    <QuestionPanel name={"quesiton name"} text={"enter fields here"}>
      {
        fields.map((field)=>{
          const errorText = errors[field.fieldId] ?? undefined
          const fieldValue = field.fieldId in fieldValues ? fieldValues[field.fieldId] : "" 
         
          return  <StackedField 
          key={field.fieldId}
          field={field}
          errorText={errorText}
          defaultValue={fieldValue} 
          />
        }
        )
      }
    </QuestionPanel>
  );
}

