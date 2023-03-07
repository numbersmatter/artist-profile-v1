import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import FormButtons from "~/server/routes-logic/formBuilder/ui/forms/FormButtons";
import TextField from "~/server/routes-logic/formBuilder/ui/StackedFields/TextField";
import { createZodFromField, getQuestionById, getResponseById, writeUserResponse } from "~/server/routes-logic/profile/profile.server";


export async function action({ params, request }: ActionArgs) {
  const questionId = params.questionId ?? "no-questionId";
  const profileId = params.profileId ?? "no-profileId";
  const formId = params.formId ?? "no-form";
  const intentId = params.intentId ?? "no-intent";

  const formValues = Object.fromEntries(await request.formData())

  const question = await getQuestionById(profileId, questionId);

  if (!question) {
    return { error: "Error no question" }
  };



  const zodObj = question.fieldOrder.reduce((acc, current) => ({ ...acc, [current]: createZodFromField(question.fieldObj[current]) }), {})

  const ZodSchema = z.object(zodObj)

  const checkValues = ZodSchema.safeParse(formValues)

  if(!checkValues.success){
    return checkValues.error
  }

  const writeResult = await writeUserResponse(profileId, intentId, questionId, checkValues.data)

  return json({ writeResult });
}




export async function loader({ params }: LoaderArgs) {
  const questionId = params.questionId ?? "no-questionId";
  const profileId = params.profileId ?? "no-profileId";
  const formId = params.formId ?? "no-form";
  const intentId = params.intentId ?? "no-intent";
  const question = await getQuestionById(profileId, questionId);
  const response = await getResponseById(profileId, intentId, questionId);

  const intentUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}`
  if (!question) {
    return redirect(intentUrl)
  }


  const fieldValues: { [key: string]: string } = response ?? {};

  const fieldObj = question.fieldObj

  const fields = question.fieldOrder.map((fieldId) => {
    const field = fieldObj[fieldId];

    return field;
  });


  // const fields: Field[] = [ 

  //   {
  //     fieldId: "contact-info",
  //     label: "username/email",
  //     type: "shortText",
  //   }
  // ]

  return json({ fields, fieldValues, question });
}


export default function QuestionId() {
  const { fields, fieldValues, question } = useLoaderData<typeof loader>();
  const actionData = useActionData();


  console.log(fields)


  return (
    <Form method="post">

      <QuestionPanel name={question.name} text={question.text}>
        {
          fields.map((field) => {
            const errorText = undefined
            const fieldValue = field.fieldId in fieldValues ? fieldValues[field.fieldId] : ""

            return <StackedField
              key={field.fieldId}
              field={field}
              errorText={errorText}
              defaultValue={fieldValue}
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

