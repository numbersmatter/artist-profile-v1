import { ActionArgs, redirect } from "@remix-run/node";
import { deleteMilaImageUpload } from "~/server/mila.server";
import { getParams } from "~/server/routes-logic/profile/profile.server";

export async function action({ params, request }: ActionArgs) {
  const { intentId, profileId,stepId,formId } = getParams(params);
  const intialFormData = Object.fromEntries(await request.formData());

  let { _action, ...values } = intialFormData;

  const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/${stepId}`

  if(_action === "delete"){

    const imgListItem ={ ...values} as { imageId: string; description: string; url: string; }
    await deleteMilaImageUpload(profileId, intentId, "step-4a", imgListItem)



    return redirect(redirectUrl)

  }

};
