import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { readIntentDoc } from "~/server/mila.server";
import { getParams } from "~/server/routes-logic/profile/profile.server";

interface StatusData {
  exists: boolean,
  headline:string,
  status:string,
  createdAt: string,
  submittedAt: string,
  confirmSubmitImage: string,
  humanReadableId: string,
  backToArtistProfile: string,
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
      confirmSubmitImage: "",
      humanReadableId: "",
      backToArtistProfile: ""
    }
    return json({ data })
  }

  const data: StatusData = {
    exists: true,
    headline: `Status for confirmation #:${intentId}`,
    status: ` Status: ${intentDoc.status}`,
    createdAt: intentDoc.createdAt.toDate().toLocaleDateString(),
    submittedAt: intentDoc.submittedAt ? intentDoc.submittedAt.toDate().toLocaleDateString(): "No submitted timestamp found",
    humanReadableId:intentDoc.humanReadableId,
    confirmSubmitImage: "https://firebasestorage.googleapis.com/v0/b/component-sites.appspot.com/o/user%2Fpq1caOfoOYMMljX8AXEmPQZEDij2%2FpublicImages%2FClawfeehouse%20Bell%20Ding.png?alt=media&token=d6c64863-0ccb-4f3c-a27c-404508e537fe",
    backToArtistProfile:  "/profile/milachu92"
  }


  return json({data});
}



export default function IntentStatus() {
  const { data} = useLoaderData<typeof loader>();


  return (
    <main className="relative lg:min-h-full border-2 bg-slate-50 rounded-lg pt-0">
    <div className="h-80  overflow-hidden mt-0 lg:absolute lg:w-1/2 lg:h-full lg:pr-4 xl:pr-12">
      <img
        src={data.confirmSubmitImage}
        alt="confirmation"
        className="h-full border-2 w-full object-center object-cover mt-0 "
      />
    </div>

    <div>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:py-32 lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-24">
        <div className="lg:col-start-2">
          <h1 className="text-sm font-medium text-indigo-600">
            {data.headline}
          </h1>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {data.status}
          </p>
          <p className="mt-2 text-base text-gray-500">
           Submitted At: {data.submittedAt}
          </p>

          <dl className="mt-16 text-sm font-medium">
            <dt className="text-gray-900">Confirmation Phrase</dt>
            <dd className="mt-2 text-indigo-600">{data.humanReadableId}</dd>
          </dl>

          <ul
            className="mt-6 text-sm font-medium text-gray-500 border-t border-gray-200 divide-y divide-gray-200"
          >
            {/* {products.map((product) => (
                <li key={product.id} className="flex py-6 space-x-6">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="flex-none w-24 h-24 bg-gray-100 rounded-md object-center object-cover"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-gray-900">
                      <a href={product.href}>{product.name}</a>
                    </h3>
                    <p>{product.color}</p>
                    <p>{product.size}</p>
                  </div>
                  <p className="flex-none font-medium text-gray-900">
                    {product.price}
                  </p>
                </li>
              ))} */}
          </ul>

          <dl className="text-sm font-medium text-gray-500 space-y-6 border-t border-gray-200 pt-6"></dl>

          <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600"></dl>

          <div className="mt-16 border-t border-gray-200 py-6 text-right">
            <Link
              to={data.backToArtistProfile}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back Artist Homepage<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </main>

  );
}