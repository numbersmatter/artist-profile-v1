import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { isIntentValid, readMilaResponse, saveMilaResponse } from "~/server/mila.server";
import type { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { getParams } from "~/server/routes-logic/profile/profile.server";
import FormButtons from "~/server/routes-logic/set-profile/ui/forms/FormButtons";


export async function action({ params, request }: ActionArgs) {
  const formValues = Object.fromEntries(await request.formData());
  const { profileId, intentId, formId } = getParams(params);

  const stepId = "step-3"
  const QuestionCreateSchema = z.object({
    numchar: z.enum(["one_char", "one_half_char", "two_char", "three_char", "two_half_char" ]),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if (!checkSchema.success) {
    const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "numchar")?.message

    const message = rawMessage ?? "There was an error."


    return message;
  } else {
    const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-4a`

    return redirect(redirectUrl);
  }


}



export async function loader({ params }: LoaderArgs) {
  const { profileId,formId, intentId } = getParams(params);

  const intentStatus = await isIntentValid(profileId, intentId);

  if(intentStatus === 'invalid'){
    return redirect(`/profile/${profileId}`)
  }
  if(intentStatus === 'submitted'){
    return redirect(`/profile/${profileId}/forms/${formId}/intent/${intentId}/status`)
  }


  const stepId = "step-3"
  const responseDoc = await readMilaResponse(profileId, intentId, stepId)
  const fieldResponses = responseDoc ? responseDoc.fieldResponses :{ numchar:""}
  const savedResponse = fieldResponses["numchar"]



  const questionName = "Number of characters?";

  const questionText = "How many characters would you like? The number of characters changes the price. Half-characters are mostly off-screen where only part of them is showing. More complex characters will cost more, so small characters like Mila are $100 each, but more complex designs like anthros are closer to $150.";

  const question = {
    name: questionName,
    text: questionText,
  }

  const titleRequest: Field = {
    fieldId: "numchar",
    type: "select",
    label: "Number of Characters",
    options: [
      {label: "1 Character", value:"one_char"},
      {label: "1.5 Characters", value:"one_half_char"},
      {label: "2 Characters", value:"two_char"},
      {label: "2.5 Characters", value:"two_half_char"},
      {label: "3 Characters", value:"three_char"},
    ]
  }

  const fields: Field[] = [titleRequest];

  const backUrl =
  `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-2`


  return json({ question, fields, backUrl, savedResponse });
}




export default function Step3() {
  const { question, fields, backUrl, savedResponse } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
    <Form method="post">
      <div className="max-w-2xl pb-5">
        <QuestionPanel name={question.name} text={question.text}>
          {
            fields.map((field) => {
              const errorText = actionData ?? undefined
              // const fieldValue = field.fieldId in fieldValues ? fieldValues[field.fieldId] : ""

              return <StackedField
                key={field.fieldId}
                field={field}
                errorText={errorText}
                defaultValue={savedResponse}
              />
            }
            )
          }
        </QuestionPanel>
        <FormButtons cancelUrl={backUrl} next="Save/Next"/>
      </div>
    </Form>
  );
}
