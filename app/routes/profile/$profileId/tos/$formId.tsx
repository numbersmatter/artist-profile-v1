import { CheckIcon } from "@heroicons/react/20/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { createNewDBIntent, getOpenDoc } from "~/server/newDb";
import { getParams } from "~/server/routes-logic/profile/profile.server";


export async function action({ params, request }: ActionArgs) {
  // Remember this is actually the openId instead of formID
  const { profileId, formId } = getParams(params)

  // remember this is actually the openId instead of formId
  const openDoc = await getOpenDoc(profileId, formId);

  if (!openDoc) {
    return redirect(`/profile/${profileId}/`)
  }

  // const opportunityDoc = 

  // const newIntent = await createMilaIntent(profileId, formId);

  try {
    const newIntent = await createNewDBIntent({
      profileId: openDoc.profileId,
      formId: openDoc.formId,
      openId: openDoc.openId,
      sectionOrder: openDoc.sectionOrder

    })
    const newUrl = `/profile/${profileId}/intents/${newIntent.intentId}/`

    return newIntent;

  } catch (error) {
    return error
  }
}


export async function loader({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-id";
  const formId = params.formId ?? "no-id";

  const cancelUrl = `/profile/${profileId}`;
  const agreeUrl = `/profile/${profileId}/forms/${formId}/create-new`;

  return json({
    cancelUrl,
    agreeUrl,
  });
}

export default function TermsOfService() {
  const { cancelUrl, agreeUrl } = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <div
      className="pb-10"
    >
      {
        actionData
          ? <p>{JSON.stringify(actionData)}</p>
          : <p>
            data display
          </p>
      }
      <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <DocumentTextIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Please Read and Agree to
              Terms of Service
            </h3>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
            </h3>
            <div className="mt-2">
              <a href="https://docs.google.com/document/d/1-ZprLtbp-HIDqLfJ4Vj6RlDPatVzXB2rPLStKQS5Bd0/edit" className="text-sm text-gray-500">
                Terms of Service Google Doc
              </a>
            </div>
          </div>
        </div>
        <Form method="post">
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button

              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"

            >
              Agree
            </button>
            <Link
              to={cancelUrl}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            >
              Cancel
            </Link>
          </div>

        </Form>
      </div>
      <ul>

      </ul>
    </div>
  );
}
