import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {  z } from "zod";
import { addFAQ, } from "~/server/routes-logic/set-profile/set-profile.server";
import type { Field } from "~/server/routes-logic/set-profile/types";
import QuestionPanel from "~/server/routes-logic/set-profile/ui/forms/QuestionPanel";

export async function action({params, request}:ActionArgs) {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData)
  const profileId = params.profileId ?? "no-id"

  const FAQSchema = z.object({
    faqQuestion: z.string().min(1),
    faqAnswer: z.string(),
  })

  const checkValues = FAQSchema.safeParse(formValues);

  if(!checkValues.success){
    return checkValues.error
  }else{

    const writeResult = await addFAQ(profileId, checkValues.data);

    return { writeResult}
  }

  // const writeResult = await setProfileData(profileId, form)

  
}

export async function loader({params}:LoaderArgs) {


  const questionName = "Create A FAQ question";
  const questionText = "Enter the question and answer";
  const faqQuestion: Field = {
    fieldId: "faqQuestion",
    type: "shortText",
    label: "Question",
  };
  const faqAnswer: Field = {
    fieldId: "faqAnswer",
    type: "longText",
    label: "Answer",
  };
  
 
  const fields= [ faqQuestion, faqAnswer];

  const questionDisplayData = { questionName, questionText, fields};


  return json({ questionDisplayData, });  
}


export default function AddFAQ() {
  const { questionDisplayData,} = useLoaderData<typeof loader>();
  const actionData = useActionData();


  return (
      <Form method="post" >
        
        <QuestionPanel
          questionDisplayData={questionDisplayData} 
          actionData={{actionData}}
          docData={{}}
        />
      </Form>
    );
}