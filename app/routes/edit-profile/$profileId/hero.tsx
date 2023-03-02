import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {  z } from "zod";
import { getProfileData } from "~/server/routes-logic/profile/profile.server";
import { setProfileData } from "~/server/routes-logic/set-profile/set-profile.server";
import type { Field } from "~/server/routes-logic/set-profile/types";
import QuestionPanel from "~/server/routes-logic/set-profile/ui/forms/QuestionPanel";

export async function action({params, request}:ActionArgs) {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData)
  const profileId = params.profileId ?? "no-id"

  const ProfileSchema = z.object({
    bannerImage: z.string(),
    avatar: z.string(),
    displayName: z.string(),
    profileHeadline: z.string()
  })

  const checkValues = ProfileSchema.safeParse(formValues);

  if(!checkValues.success){
    return checkValues.error
  }else{

    const writeResult = await setProfileData(profileId, checkValues.data);

    return { writeResult}
  }

  // const writeResult = await setProfileData(profileId, form)

  
}

export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const profileDoc = await getProfileData(profileId);

  


  const questionName = "Set Profile Data";
  const questionText = "For testing";
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
    fieldId: "profileHeadline",
    type: "shortText",
    label: "Profile Headline",
  };
 
  const fields= [ displayName, profileHeadline, bannerImage, avatar];

  const questionDisplayData = { questionName, questionText, fields};

  const profileData = profileDoc ?? {}

  return json({ questionDisplayData, profileData });  
}


export default function EditHero() {
  const { questionDisplayData, profileData} = useLoaderData<typeof loader>();
  const actionData = useActionData();


  return (
      <Form method="post" >
        <p>{ JSON.stringify(profileData)}  </p>
        <QuestionPanel
          questionDisplayData={questionDisplayData} 
          actionData={{actionData}}
          docData={profileData}
        />
      </Form>
    );
}