import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import QuestionContainer from "~/server/routes-logic/set-profile/ui/forms/QuestionContainer";
import SelectField from "~/server/routes-logic/set-profile/ui/forms/SelectField";


export async function action({params, request}:ActionArgs) {
  const formValues = Object.fromEntries(await request.formData())

  const discordText = formValues.discordName ?? "none"
  
  const DiscordSchema = z.string().regex(new RegExp("^.{3,32}#[0-9]{4}$"), "Must match discord")

  const checkDiscordName = DiscordSchema.safeParse(discordText)


  return { checkDiscordName, discordText};
}


export async function loader({ params }: LoaderArgs) {
  const questionName = " Whats the best way to contact you?"
  const questionText = "If I accept your commission will need to get in contact with you for further details."

  return json({
    questionName,
    questionText

  });
}


export default function ContactInfo() {
  const { questionName, questionText } = useLoaderData();
  const actionData = useActionData();
  const [ state, setState] = useState("discord");

  return (
    <form className="space-y-6" action="#" method="POST">
      {
        actionData ? <p>{JSON.stringify(actionData)}</p> : <p></p>
      }
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Method Of Contact</h3>
            <p className="mt-1 text-sm text-gray-500">If I accept your commission I will need to chat</p>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                  My Preferred Contact Method
                </label>
                <select
                  id="contact"
                  name="contact"
                  className="mt-2 block w-full rounded-md border-0 bg-white py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value={"discord"}>Use My Discord</option>
                  <option value={"twitter"}>Twitter</option>
                  <option value={"email"}>Email Me</option>
                </select>
              </div>
              <div className="col-span-6">
                <label htmlFor="discordName" className="block text-sm font-medium leading-6 text-gray-900">
                  Discord
                </label>
                <input
                  type="text"
                  name="discordName"
                  id="discordName"
                  placeholder="username#0000"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
   

      <div className="flex justify-end px-4 sm:px-0">
        <button
          type="button"
          className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}