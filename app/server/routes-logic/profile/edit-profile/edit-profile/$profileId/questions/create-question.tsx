import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { makeQuestion } from "~/server/routes-logic/profile/profile.server";
import FormButtons from "~/server/routes-logic/set-profile/ui/forms/FormButtons";


export async function action({params, request}:ActionArgs) {
  const formValues = Object.fromEntries(await request.formData());
  const profileId = params.profileId ?? "no-id"; 

  const QuestionCreateSchema = z.object({
    name: z.string().min(2),
    text: z.string(),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if(!checkSchema.success){
    return checkSchema.error;
  }else{
    const writeResult= makeQuestion( profileId,  checkSchema.data)
    const redirectUrl = `/edit-profile/${profileId}/questions/${(await writeResult).questionId}`

    return redirect(redirectUrl);
  }


}



export async function loader({params}:LoaderArgs) {
  
  const question={
    name: "Make Question",
    text: "Give your question a name and text"
  }

  const nameField:Field ={
    fieldId:"name",
    type:"shortText",
    label:"Name"
  }
  const textField:Field ={
    fieldId:"text",
    type:"longText",
    label:"Text"
  }

  const fields: Field[] = [nameField, textField];

  return json({question, fields});
}




export default function CreateQuestion() {
  const { question, fields} = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
    <Form method="post">
      <QuestionPanel name={question.name} text={question.text}>
        {
          fields.map((field) => {
            const errorText = undefined
            // const fieldValue = field.fieldId in fieldValues ? fieldValues[field.fieldId] : ""

            return <StackedField
              key={field.fieldId}
              field={field}
              errorText={errorText}
              defaultValue={""}
            />
          }
          )
        }
        {
          actionData ? <p> {JSON.stringify(actionData)} </p> : <p>&nbsp;</p>
        }
        <FormButtons cancelUrl="../" />
      </QuestionPanel>
    </Form>
  );
}
