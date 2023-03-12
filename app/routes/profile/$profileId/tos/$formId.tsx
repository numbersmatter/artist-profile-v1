import { CheckIcon } from "@heroicons/react/20/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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

  return (
    <div
      className="pb-10"
    >

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
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <Link
                  to={agreeUrl}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  
                  >
                    Agree
                  </Link>
                  <Link
                  to={cancelUrl}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
      <ul>
        
      </ul>
     </div>
  );
}
