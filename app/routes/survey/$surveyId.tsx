import { ActionArgs, LoaderArgs, Response} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getProfilePageHeaderData } from "~/server/routes-logic/profile/profile.server";
import ProfileHeader from "~/server/routes-logic/profile/ui/ProfileHeader";
import { getSurveyDoc } from "~/server/routes-logic/survey/survey.server";

export async function action({params, request}:ActionArgs) {
  

  return redirect('/');
}

export async function loader({params, request}:LoaderArgs) {
  const surveyDoc = await getSurveyDoc(params.surveyId);
  if(!surveyDoc){
    throw new Response("Survey by that id present", {status:404})
  }
  const profileHeader = await  getProfilePageHeaderData(surveyDoc.profileId)
  if(!profileHeader){
    throw new Response("no profile data", {status:404})
  }

  return json({profileHeader});
}



export default function SurveyLayout() {
  const {profileHeader } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-[#2a9bb5] flex flex-col ">
    <ProfileHeader data={profileHeader} />
    <div className="mx-auto rounded-lg">
      <Outlet />

    </div>
    <div className="h-16">
     
    </div>
  </div>

  );
}