import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getProfilePageHeaderData } from "~/server/routes-logic/profile/profile.server";
import ProfileHeader from "~/server/routes-logic/profile/ui/ProfileHeader";





export async function loader({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const profileData = await getProfilePageHeaderData(profileId);

  if (!profileData) {
    throw new Response("no profile data", { status: 404 })
  }

  return json({ profileData })

}

export default function ProfileLayout() {
  const { profileData } = useLoaderData<typeof loader>();


  return (
    <div id='nav' className="bg-white rounded-lg">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 lg:px-8">
        <ul>
          <li>
            <Link to="hero" > 
            edit hero section
            </Link>
          </li>
          <li>
            <Link to="hero" > 
              add faq
            </Link>
          </li>
          <li>
            <Link to="hero" > 
              open opportunity
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )

}