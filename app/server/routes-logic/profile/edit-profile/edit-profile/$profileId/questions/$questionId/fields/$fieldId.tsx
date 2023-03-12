import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getFirestoreOptions } from "firebase-admin/lib/firestore/firestore-internal";
import { z } from "zod";
import { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { getParams, makeField, makeQuestion } from "~/server/routes-logic/profile/profile.server";
import FormButtons from "~/server/routes-logic/set-profile/ui/forms/FormButtons";


export async function action({params, request}:ActionArgs) {
  const formValues = Object.fromEntries(await request.formData());
  const {profileId, questionId} = getParams(params)
;
  const FieldCreateSchema = z.object({
    label: z.string().min(2),
    type: z.enum(["select", "email", "longText", "shortText", "imageUpload"]),
  })

  const checkSchema = FieldCreateSchema.safeParse(formValues);
  if(!checkSchema.success){
    return checkSchema.error;
  }else{
    const writeResult= await makeField( profileId, questionId,  checkSchema.data)
    const redirectUrl = `/edit-profile/${profileId}/questions/${questionId}/fields/${writeResult.fieldId}`

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




export default function AddField() {
  const { question, fields} = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
    <div>
      <ul>
        {
       
        }
      </ul>
    </div>
  );
}
