import { LoaderArgs, redirect } from "@remix-run/node";
import { createMilaIntent } from "~/server/mila.server";
import { createNewDBIntent, getFormRecentStatus, getOpenDoc } from "~/server/newDb";
import { getParams } from "~/server/routes-logic/profile/profile.server";

export async function loader({params}:LoaderArgs) {
  // Remember this is actually the openId instead of formID
  const {profileId, formId } = getParams(params)

  // remember this is actually the openId instead of formId
  const openDoc = await getOpenDoc(profileId, formId);

  if(!openDoc){
   return redirect(`/profile/${profileId}/`)
  }

  // const opportunityDoc = 

  // const newIntent = await createMilaIntent(profileId, formId);
  
  const newIntent = await createNewDBIntent({
    profileId: openDoc.formId,
    formId: openDoc.formId,
    openId: openDoc.openId,
    sectionOrder: openDoc.sectionOrder

  })
  const newUrl = `/profile/${profileId}/intents/${newIntent.intentId}/`

  return redirect(newUrl);
}
