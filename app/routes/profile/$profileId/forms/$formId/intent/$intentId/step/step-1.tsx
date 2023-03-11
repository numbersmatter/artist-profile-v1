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
  // const formValues = Object.fromEntries(await request.formData());
  // I need to trim whitespace from email functions

  const formData = await request.formData();
  const emailRaw = formData.get("email") as string;

  const emailTrimmed = emailRaw.trim()

  const formValues = {
    email: emailTrimmed
  }

  const { profileId, intentId,  formId } = getParams(params);

  const stepId = "step-1"

  const QuestionCreateSchema = z.object({
    email: z.string().email("Must be a valid email format"),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if (!checkSchema.success) {
    const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "email")?.message

    const message = rawMessage ?? "There was an error for email."


    return message;
  } else {
    const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-2`

    return redirect(redirectUrl);
  }


}



export async function loader({ params }: LoaderArgs) {
  const { profileId, intentId, formId } = getParams(params);
  const stepId = "step-1"

  const intentStatus = await isIntentValid(profileId, intentId);

  if(intentStatus === 'invalid'){
    return redirect(`/profile/${profileId}`)
  }
  if(intentStatus === 'submitted'){
    return redirect(`/profile/${profileId}/forms/${formId}/intent/${intentId}/status`)
  }

  const responseDoc = await readMilaResponse(profileId, intentId, stepId)
 
  const fieldResponses = responseDoc ? responseDoc.fieldResponses :{ email:""}

  const emailSavedResponse = fieldResponses["email"]

  const questionName = "Notification Email";

  const questionText = "I will use this email to let you know whether your idea was selected or not. Everyone, regradless of whether you are selected, should get an email letting you know your requests status.";

  const question = {
    name: questionName,
    text: questionText,
  }

  const notifyEmail: Field = {
    fieldId: "email",
    type: "email",
    label: "Email me at:"
  }

  const fields: Field[] = [notifyEmail];

  const backUrl =
    `/profile/${profileId}`


  return json({ question, fields, backUrl, emailSavedResponse });
}




export default function Step1() {
  const { question, fields, backUrl, emailSavedResponse } = useLoaderData<typeof loader>();
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
                defaultValue={emailSavedResponse}
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
