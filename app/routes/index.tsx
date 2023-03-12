import type { LoaderArgs} from "@remix-run/node";
import {  redirect } from "@remix-run/node";
import { getUserIfSignedIn } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  const userRecord = await getUserIfSignedIn(request);

  return redirect('/profile/milachu92')
}


