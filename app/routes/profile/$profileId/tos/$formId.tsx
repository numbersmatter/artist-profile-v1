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
    <article className="prose prose-xl">
      <h1>Welcome to Terms Of Service</h1>
      <p>This is the Terms of service</p>
      <ul>
        <li>
          <Link to={cancelUrl}>Cancel</Link>
        </li>
        <li>
          <Link to={agreeUrl}>Agree</Link>
        </li>
      </ul>
    </article>
  );
}
