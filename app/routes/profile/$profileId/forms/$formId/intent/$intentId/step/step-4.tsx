import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { isIntentValid, readMilaImageUpload, readMilaResponse, saveMilaResponse } from "~/server/mila.server";
import type { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { getParams } from "~/server/routes-logic/profile/profile.server";
import FormButtons from "~/server/routes-logic/set-profile/ui/forms/FormButtons";



const stepId = "step-4"


export async function action({ params, request }: ActionArgs) {
  const formValues = Object.fromEntries(await request.formData());
  const { profileId, intentId, formId } = getParams(params);

 
  const QuestionCreateSchema = z.object({
    charArea: z.string(),
  })

  const checkSchema = QuestionCreateSchema.safeParse(formValues);
  if (!checkSchema.success) {
    const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "charArea")?.message

    const message = rawMessage ?? "There was an error."


    return message;
  } else {
    //  @ts-ignore
    const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
    const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-5`

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


 
  const responseDoc = await readMilaResponse(profileId, intentId, stepId)
  const fieldResponses = responseDoc ? responseDoc.fieldResponses :{ charArea:""}
  const savedResponse = fieldResponses["charArea"]

  const imagesUploadDoc = await readMilaImageUpload(profileId, intentId, "step-4a")
  const imgsUploaded = imagesUploadDoc ? imagesUploadDoc.imgList : []



  const questionName = "Character References";

  const questionText = "Here you can place links to your character references you were not able to uploade. You don't need to link anything if you already uploaded a reference in previous question. You don't need to put a reference if you want a character to be anonymous or one of my characters. ";

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
  `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-4a`


  return json({ question, fields, backUrl, savedResponse, imgsUploaded });
}




export default function Step3() {
  const { question, fields, backUrl, savedResponse, imgsUploaded } = useLoaderData<typeof loader>();
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
        <div className="bg-white  px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="space-y-8 divide-y divide-gray-200">
        <div className="py-4">

                  <h4 className="text-xl text-slate-700">Uploaded Images:</h4>
                  <p>Images you uploaded in the previous question</p>
                  <ul
                    className=" pt-2 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                  >
                    {
                    
                    imgsUploaded.length > 0 ?
                    imgsUploaded.map((imageData
                    ) => (
                      <li key={imageData.url} className="relative">
                        <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                          <img src={imageData.url} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                        </div>
                        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{imageData.description}</p>
                      </li>
                    ))
                    : <div className="mx-auto ">
                      
                      <p className="text-xl text-slate-500"> No images uploaded</p>
                      </div>
                  
                  }
                  </ul>
                </div>

      </div>
      </div>
      </div>
    </Form>
  );
}
