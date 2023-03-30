import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSurveyDoc } from "~/server/routes-logic/survey/survey.server";

export async function action({params, request}:ActionArgs) {
  

  return redirect('/');
}

export async function loader({params, request}:LoaderArgs) {
  const surveyDoc = await getSurveyDoc(params.surveyId);
  if(!surveyDoc){
    throw new Response("Survey by that id present", {status:404})
  }
  

  return json({});
}



export default function FormSections() {
  const { } = useLoaderData<typeof loader>();
  return (
    <div className="">
      
    </div>
  );
}