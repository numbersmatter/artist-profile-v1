import { LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import FormButtons from "~/server/routes-logic/formBuilder/ui/forms/FormButtons";
import TextField from "~/server/routes-logic/formBuilder/ui/StackedFields/TextField";
import { getQuestionById } from "~/server/routes-logic/profile/profile.server";


export async function loader({params}:LoaderArgs) {
  const questionId = params.questionId ?? "no-questionId";
  const profileId = params.profileId ?? "no-profileId";
  const formId = params.formId ?? "no-form";
  const intentId = params.intentId ?? "no-intent";
  const question = await getQuestionById(profileId, questionId);

  const intentUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}`
  if(!question){
    return redirect(intentUrl)
  }

  const fieldValues: {[key:string]: string} = {
    "contact-info": "markmutt"
  }
  const fields: Field[] = [ 
    {
      fieldId: "contact-info",
      label: "username/email",
      type: "shortText",
    }
  ]

  return json({fields , fieldValues, question});
}


export default function QuestionId() {
  const {fields , fieldValues, question} = useLoaderData<typeof loader>();
  const actionData = useActionData();


  console.log(question)
  
  
  return (
    <QuestionPanel name={question.name} text={question.text}>
      {
        fields.map((field)=>{
          const errorText =  undefined
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
      <TextField fieldId="test" label="label" defaultValue="here"  />
      <FormButtons  cancelUrl="../" />
    </QuestionPanel>
  );
}

