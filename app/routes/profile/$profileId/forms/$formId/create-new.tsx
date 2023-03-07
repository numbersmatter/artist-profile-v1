import { LoaderArgs, redirect } from "@remix-run/node";
import { createNewIntent } from "~/server/routes-logic/profile/profile.server";

export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId";
  const formId = params.formId ?? "no-formId";

  // const opportunityDoc = 

  const newIntent = await createNewIntent(profileId, formId);

  const newUrl = `/profile/${profileId}/forms/${formId}/intent/${newIntent.intentId}`

  return redirect(newUrl);
}
