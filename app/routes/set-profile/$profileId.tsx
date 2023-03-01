import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {  z } from "zod";
import { getProfileData } from "~/server/routes-logic/profile/profile.server";
import { setProfileData } from "~/server/routes-logic/set-profile/set-profile.server";
import type { Field } from "~/server/routes-logic/set-profile/types";
import QuestionPanel from "~/server/routes-logic/set-profile/ui/forms/QuestionPanel";

export async function action({params, request}:ActionArgs) {
  const formData = await request.formData();
  const profileId = params.profileId ?? "no-id"

  const ProfileSchema = z.object({
    bannerImage: z.string(),
    avatar: z.string(),
    displayName: z.string(),
    profileHeadline: z.string()
  })

  const checkValues = ProfileSchema.safeParse(formData);

  if(!checkValues.success){
    return checkValues.error
  }else{

    const writeResult = await setProfileData(profileId, checkValues.data);

    return { writeResult}
  }

  
}

export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const profileData = await getProfileData(profileId);

  if(!profileData){
    throw new Response("no profile data", {status:404})
  }


  const questionName = "Add Question to Form";
  const questionText = "Name your question and give it a description"
  const bannerImage: Field = {
    fieldId: "bannerImage",
    type: "shortText",
    label: "Banner Image",
  };
  const avatar: Field = {
    fieldId: "avatar",
    type: "shortText",
    label: "Avatar Image",
  };
  const displayName: Field = {
    fieldId: "displayName",
    type: "shortText",
    label: "Display Name",
  };
  const profileHeadline: Field = {
    fieldId: "displayName",
    type: "shortText",
    label: "Display Name",
  };
 
  const fields= [ displayName, profileHeadline, bannerImage, avatar];

  const questionDisplayData = { questionName, questionText, fields};

  return json({ questionDisplayData, profileData });  
}


export default function AddQuestion() {
  const { questionDisplayData} = useLoaderData<typeof loader>();
  return (
      <Form method="post" >
        <QuestionPanel
          questionDisplayData={questionDisplayData} 
          actionData={{}}
        />
      </Form>
    );
}