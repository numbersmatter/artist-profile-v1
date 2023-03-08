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
  const stepId = "step-2"


  const QuestionCreateSchema = z.object({
    title: z.string(),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if (!checkSchema.success) {
    const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "title")?.message

    const message = rawMessage ?? "There was an error."


    return message;
  } else {
    const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-3`

    return redirect(redirectUrl);
  }


}



export async function loader({ params }: LoaderArgs) {
  const { profileId,formId, intentId } = getParams(params);
  const stepId = "step-2"

  const responseDoc = await readMilaResponse(profileId, intentId, stepId)


  const fieldResponses = responseDoc ? responseDoc.fieldResponses :{ title:""}

  const titleResp = fieldResponses["title"]

  const questionName = "Do you have a title in mind?";

  const questionText = "It is not necessary to have a title. If you do know what you would like your work to be called add it here. If not we can come up with a title later.";

  const question = {
    name: questionName,
    text: questionText,
  }

  const titleRequest: Field = {
    fieldId: "title",
    type: "shortText",
    label: "Title:"
  }

  const fields: Field[] = [titleRequest];

  const backUrl =
  `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-1`


  return json({ question, fields, backUrl, titleResp });
}




export default function Step2() {
  const { question, fields, backUrl, titleResp } = useLoaderData<typeof loader>();
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
                defaultValue={titleResp}
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
