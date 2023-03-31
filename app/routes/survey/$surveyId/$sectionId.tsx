import { ActionArgs, LoaderArgs, writeAsyncIterableToWritable} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import type { Field } from "~/server/routes-logic/formBuilder/types";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import FormButtons from "~/server/routes-logic/formBuilder/ui/forms/FormButtons";
import { getSectionData, writeSection } from "~/server/routes-logic/survey/survey.server";

export async function action({params, request}:ActionArgs) {
  

  return redirect('/');
}

export async function loader({params, request}:LoaderArgs) {


  const sectionData = getSectionData(params.surveyId, params.sectionId)

  const questionName = "Interest In Open Source Tools";

  const questionText = "Is there a need for open source tools in the commission management space? (Imagine Blender or GIMP for commission management)";


  const question = {
    name: questionName,
    text: questionText,
  }


  const field: Field = {
    fieldId: "tooling",
    type: "select",
    label: "Is there a need for open source tools?",
    options: [
      {label: "Yes, definitely!", value:"Yes"},
      {label: "Not sure", value:"notSure"},
      {label: "No, enough tooling exists", value:"No"},
    ]
  }
  


  const fields: Field[] = [field];

  // await writeSection(
  //   "furscience",
  //   "kaUYnXPkOKGcvs1Ievd6", 
  //   {
  //     name: questionName,
  //     text: questionText,
  //     fields
  //   } )

  const defaultValues: {[key:string]:string} = {}
  const backUrl = "/"

  return json({question, fields, defaultValues, backUrl});
}



export default function FormSections() {
  const { question, fields, defaultValues, backUrl} = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
    <Form method="post">
      <div className="max-w-2xl pb-5">
        <QuestionPanel name={question.name} text={question.text}>
          {
            fields.map((field) => {
              const errorText = actionData ?? undefined
              // const fieldValue = field.fieldId in fieldValues ? fieldValues[field.fieldId] : ""

              return <StackedField
                key={field.fieldId}
                field={field}
                errorText={errorText}
                defaultValue={defaultValues[field.fieldId] ?? ""}
              />
            }
            )
          }
        </QuestionPanel>
        <div className="py-3 flex justify-end">
      <Link
        to={backUrl}
        type="button"
        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cancel
      </Link>
      <button
        type="submit"
        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save
      </button>
    </div>

      </div>
    </Form>
  );
}