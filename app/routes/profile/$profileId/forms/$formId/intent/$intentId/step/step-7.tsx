import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { readMilaResponse, saveMilaResponse, submitIntent } from "~/server/mila.server";
import type { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { getParams } from "~/server/routes-logic/profile/profile.server";
import FormButtons from "~/server/routes-logic/set-profile/ui/forms/FormButtons";


export async function action({ params, request }: ActionArgs) {
  const formValues = Object.fromEntries(await request.formData());
  const { profileId, intentId, formId } = getParams(params);

  const stepId = "step-7"
  const QuestionCreateSchema = z.object({
    additionalInfo: z.string(),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if (!checkSchema.success) {
    const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "charActions")?.message

    const message = rawMessage ?? "There was an error."


    return message;
  } else {
    await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    await submitIntent(profileId, intentId)

    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/status`

    return redirect(redirectUrl);
  }


}



export async function loader({ params }: LoaderArgs) {
  const { profileId,formId, intentId } = getParams(params);

  const stepId = "step-7"
  const responseDoc = await readMilaResponse(profileId, intentId, stepId)
  const fieldResponses = responseDoc ? responseDoc.fieldResponses :{ charActions:""}
  const savedResponse = fieldResponses["additionalInfo"]



  const questionName = "Additional Information";

  const questionText = " Any extra info you want to add can go here. If you have none, you can put none.";

  const question = {
    name: questionName,
    text: questionText,
  }

  const charActions: Field = {
    fieldId: "additionalInfo",
    type: "longText",
    label: "Additional Info",
    
  }

  const fields: Field[] = [charActions];

  const backUrl =
  `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-6`


  return json({ question, fields, backUrl, savedResponse });
}




export default function Step5() {
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
        <FormButtons  cancelUrl={backUrl} next="Save/Next"/>
      </div>
    </Form>
  );
}
