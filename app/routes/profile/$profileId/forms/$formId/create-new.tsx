import { LoaderArgs, redirect } from "@remix-run/node";
import { createMilaIntent } from "~/server/mila.server";
import { getParams } from "~/server/routes-logic/profile/profile.server";

export async function loader({params}:LoaderArgs) {
  const {profileId, formId } = getParams(params)

  // const opportunityDoc = 

  const newIntent = await createMilaIntent(profileId, formId);

  const newUrl = `/profile/${profileId}/forms/${formId}/intent/${newIntent.intentId}/step/step-1`

  return redirect(newUrl);
}
