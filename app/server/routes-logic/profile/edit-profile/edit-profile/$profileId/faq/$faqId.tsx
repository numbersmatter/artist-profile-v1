import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {  z } from "zod";
import { getProfilePageHeaderData } from "~/server/routes-logic/profile/profile.server";
import { addFAQ, getProfileFAQbyId, setProfileData, updateFAQbyId } from "~/server/routes-logic/set-profile/set-profile.server";
import type { Field } from "~/server/routes-logic/set-profile/types";
import QuestionPanel from "~/server/routes-logic/set-profile/ui/forms/QuestionPanel";

export async function action({params, request}:ActionArgs) {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData)
  const profileId = params.profileId ?? "no-id"
  const faqId = params.faqId ?? "no-id"

  const FAQSchema = z.object({
    faqQuestion: z.string().min(1),
    faqAnswer: z.string(),
  })

  const checkValues = FAQSchema.safeParse(formValues);

  if(!checkValues.success){
    return checkValues.error
  }else{

    const writeResult = await updateFAQbyId( faqId, checkValues.data);

    return { writeResult}
  }

  // const writeResult = await setProfileData(profileId, form)

  
}

export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId";
  const faqId = params.faqId ?? "no-faqId";
  const faqDoc = await getProfileFAQbyId(faqId);

  if(!faqDoc){
    throw new Response("FAQ not found", {status:401})
  }

  


  const questionName = "Edit FAQ question";
  const questionText = "Update the question and answer";
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

  const { createdAt, ...faq} = faqDoc

  return json({ questionDisplayData, faq });  
}


export default function EditFAQ() {
  const { questionDisplayData, faq} = useLoaderData<typeof loader>();
  const actionData = useActionData();

  


  return (
      <Form method="post" >
        
        <QuestionPanel
          questionDisplayData={questionDisplayData} 
          actionData={{actionData}}
          docData={faq}
        />
      </Form>
    );
}