import { LoaderArgs, redirect } from "@remix-run/node";


export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "milachu92";
  const formId =params.formId ?? "abc";
  const intentId = params.intentId ?? "no-intentId";

  const segment= "question/HZZsLwWCKHJq7pFxrZci"


  const nextUrl =`/profile/${profileId}/forms/${formId}/intent/${intentId}/${segment}`
  return redirect( nextUrl);
}
