import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getProfileFAQs } from "~/server/routes-logic/profile/profile.server";

export async function loader({params}:LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId";
  const faqsRaw= await getProfileFAQs(profileId);  

  const faqs = faqsRaw.sort((a,b)=> a.createdAt.seconds - b.createdAt.seconds)

  return json({faqs});
}



export default function FAQList() {
  const { faqs} = useLoaderData<typeof loader>()
  return (
    <article className="prose prose-xl">
      <div id="open-forms" className="relative">

        <div className="mx-auto max-w-7xl py-5  grid grid-cols-1 gap-y-4 ">

          <h1>Welcome to FAQList</h1>
          <p>This is the  FAQList</p>
          <ul>
            {
              faqs.map((faq)=> <li key={faq.faqId}>
                <Link to={faq.faqId}>
                  {faq.faqQuestion}
                </Link>
              </li>)
            }
          </ul>
        </div>
      </div>
    </article>
  );
}

