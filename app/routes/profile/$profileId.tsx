import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getProfilePageHeaderData } from "~/server/routes-logic/profile/profile.server";
import ProfileHeader from "~/server/routes-logic/profile/ui/ProfileHeader";





export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const pageHeaderData = await getProfilePageHeaderData(profileId);

  if(!pageHeaderData){
    throw new Response("no profile data", {status:404})
  }

  const modifiedpageHeaderData = {...pageHeaderData, displayName: "Milachu92"}

  return json( { modifiedpageHeaderData})
  
}

export default function ProfileLayout(){
  const { modifiedpageHeaderData } = useLoaderData<typeof loader>();


  return (
    <div className="min-h-screen bg-[#2a9bb5] flex flex-col ">
      <ProfileHeader data={modifiedpageHeaderData} />
      <div className="mx-auto rounded-lg">
        <Outlet />

      </div>
      <div className="h-16">
       
      </div>
    </div>
  )

}