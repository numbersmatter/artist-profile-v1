import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getProfilePageHeaderData } from "~/server/routes-logic/profile/profile.server";
import ProfileHeader from "~/server/routes-logic/profile/ui/ProfileHeader";





export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const profileData = await getProfilePageHeaderData(profileId);

  if(!profileData){
    throw new Response("no profile data", {status:404})
  }

  return json( {profileData})
  
}

export default function ProfileLayout(){
  const { profileData } = useLoaderData<typeof loader>();


  return (
    <div className="min-h-screen bg-[#2a9bb5] flex flex-col ">
      <ProfileHeader data={profileData} />
      <div className="mx-auto rounded-lg">
        <Outlet />

      </div>
    </div>
  )

}