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

  const typeIsOther = formValues.backgroundType === "other"

  const stepId = "step-6"
  const DetailsNotRequired = z.object({
    detailLevel: z.enum(["simple", "detailed"] ),
    backgroundType: z.enum(["bedroom", "forest", "clawfee", "bathroom", "nightclub", "beach", "other"]),
    backgroundDetails: z.string(),
  })
  const DetailsRequired = z.object({
    detailLevel: z.enum(["simple", "detailed"]),
    backgroundType: z.enum(["bedroom", "forest", "clawfee", "bathroom", "nightclub", "beach", "other"]),
    backgroundDetails: z.string().min(10, "This field is required to be at least 10 characters if background Type is 'other' "),
  })

  if(typeIsOther){
    const checkSchema = DetailsRequired.safeParse(formValues)

    if (!checkSchema.success) {
      const detailLevelError = checkSchema.error.issues.find((error) => error.path[0] === "detailLevel")?.message ?? ""
      const backgroundTypeError = checkSchema.error.issues.find((error) => error.path[0] === "backgroundType")?.message ?? ""
      const backgroundDetailsError = checkSchema.error.issues.find((error) => error.path[0] === "backgroundDetails")?.message ?? ""
  
      const errorMessages = {
        detailLevel: detailLevelError,
        backgroundType: backgroundTypeError,
        backgroundDetails: backgroundDetailsError
      }
  
  
      return errorMessages;
    } else {
      const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
      const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-7`
  
      return redirect(redirectUrl);
    }
  

  }






  // details not required
  const checkSchema = DetailsNotRequired.safeParse(formValues);
  if (!checkSchema.success) {
    const detailLevelError = checkSchema.error.issues.find((error) => error.path[0] === "detailLevel")?.message ?? ""
    const backgroundTypeError = checkSchema.error.issues.find((error) => error.path[0] === "backgroundType")?.message ?? ""
    const backgroundDetailsError = checkSchema.error.issues.find((error) => error.path[0] === "backgroundDetails")?.message ?? ""

    const errorMessages = {
      detailLevel: detailLevelError,
      backgroundType: backgroundTypeError,
      backgroundDetails: backgroundDetailsError
    }


    return errorMessages;
  } else {
    const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-7`

    return redirect(redirectUrl);
  }


}



export async function loader({ params }: LoaderArgs) {
  const { profileId, formId, intentId } = getParams(params);

  const intentStatus = await isIntentValid(profileId, intentId);

  if(intentStatus === 'invalid'){
    return redirect(`/profile/${profileId}`)
  }
  if(intentStatus === 'submitted'){
    return redirect(`/profile/${profileId}/forms/${formId}/intent/${intentId}/status`)
  }


  const stepId = "step-6"
  const responseDoc = await readMilaResponse(profileId, intentId, stepId)

  const defaultValues = {
    detailLevel: "simple",
    backgroundType: "bedroom",
    backgroundDetails: ""
  }

  const fieldResponses = responseDoc 
  ? responseDoc.fieldResponses 
  : defaultValues





  const questionName = "Background Information";

  const questionText = "Do you want something simple like a bedroom or a flat color, or something detailed like a coffee shop or night club? I am already good at drawing a few backgrounds already, like those in backgorund type, but unfamiliar backgrounds may take me more time to make and may cost more. Add any other additional details you would like in the more details.";

  const question = {
    name: questionName,
    text: questionText,
  }

  const detailLevel: Field = {
    fieldId: "detailLevel",
    type: "select",
    label: "Level of Detail",
    options: [
      { label: "Simple Background", value: "simple" },
      { label: "Detailed Background", value: "detailed" },
    ]
  };
  const backgroundType: Field = {
    fieldId: "backgroundType",
    type: "select",
    label: "Background Type",
    options: [
      { label: "Mila's Bedroom", value: "bedroom" },
      { label: "Forest or Park", value: "forest" },
      { label: "Clawfee House", value: "clawfee" },
      { label: "Night Club", value: "nightclub" },
      { label: "Bathroom", value: "bathroom" },
      { label: "Daytime Beach", value: "beach" },
      { label: "Other Background", value: "other" },
    ]
  };

  const backgroundDetails: Field = {
    fieldId: "backgroundDetails",
    type: "longText",
    label: "Add any additional details",
  }



  const fields: Field[] = [
    detailLevel,
    backgroundType,
    backgroundDetails
  ];

  const backUrl =
    `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-5`


  return json({ question, fields, backUrl, fieldResponses });
}




export default function Step3() {
  const { question, fields, backUrl, fieldResponses } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const errorData = actionData ?? {}

  return (
    <Form method="post">
      <div className="max-w-2xl pb-5">
        <QuestionPanel name={question.name} text={question.text}>
          {
            fields.map((field) => {
              const errorText = field.fieldId in errorData ? errorData[field.fieldId] : undefined
              const fieldValue = field.fieldId in fieldResponses ? fieldResponses[field.fieldId] : ""

              return <StackedField
                key={field.fieldId}
                field={field}
                errorText={errorText}
                defaultValue={fieldValue}
              />
            }
            )
          }
        </QuestionPanel>
        <FormButtons cancelUrl={backUrl} next="Save/Next" />
      </div>
    </Form>
  );
}
