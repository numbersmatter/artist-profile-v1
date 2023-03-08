import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { readIntentDoc } from "~/server/mila.server";
import { getParams } from "~/server/routes-logic/profile/profile.server";

interface StatusData {
  exists: boolean,
  headline:string,
  status:string,
  createdAt: string,
  submittedAt: string
}

export async function loader({ params }: LoaderArgs) {
  const { profileId, intentId } = getParams(params)
  const intentDoc = await readIntentDoc(profileId, intentId)

  if (!intentDoc) {
    const data: StatusData
     = {
      exists: false,
      headline: `Status for confirmation #:${intentId}`,
      status: ` Status: `,
      createdAt: "",
      submittedAt: "",
    }
    return json({ data })
  }

  const data: StatusData = {
    exists: true,
    headline: `Status for confirmation #:${intentId}`,
    status: ` Status: ${intentDoc.status}`,
    createdAt: intentDoc.createdAt.toDate().toLocaleDateString(),
    submittedAt: intentDoc.submittedAt ? intentDoc.submittedAt.toDate().toLocaleDateString(): "No submitted timestamp found",
  }

  return json({data});
}



export default function IntentStatus() {
  const { data } = useLoaderData<typeof loader>();


  if (data.exists) {
    return (
      <article className="prose prose-xl">
        <h1>{data.headline} </h1>
        <p>Status: {data.status}</p>
        <p>Created At: {data.createdAt} </p>
        <p>Submitted Form At: {data.submittedAt}</p>
      </article>
    )
  }



  return (
    <article className="prose prose-xl">
      <h1>Confirmation Number Not Found </h1>
      <p>No information was found for this confirmation number</p>
    </article>
  );
}