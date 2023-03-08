import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { readMilaResponse, saveMilaResponse } from "~/server/mila.server";
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
    charArea: z.string(),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if (!checkSchema.success) {
    const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "charArea")?.message

    const message = rawMessage ?? "There was an error."


    return message;
  } else {
    const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-5`

    return redirect(redirectUrl);
  }


}



export async function loader({ params }: LoaderArgs) {
  const { profileId,formId, intentId } = getParams(params);

  const stepId = "step-5"
  const responseDoc = await readMilaResponse(profileId, intentId, stepId)
  const fieldResponses = responseDoc ? responseDoc.fieldResponses :{ charArea:""}
  const savedResponse = fieldResponses["charArea"]



  const questionName = "Character References";

  const questionText = "Here you can upload images or you can put links to your character references here. You don't need to link anything if you already uploaded a reference in another question. If so, you can put their names here. You don't need to put a reference if you want a character to be anonymous or one of my characters.";

  const question = {
    name: questionName,
    text: questionText,
  }

  const characterRef: Field = {
    fieldId: "charArea",
    type: "longText",
    label: "Character Reference Details",
    
  }

  const fields: Field[] = [characterRef];

  const backUrl =
  `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-4`


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
