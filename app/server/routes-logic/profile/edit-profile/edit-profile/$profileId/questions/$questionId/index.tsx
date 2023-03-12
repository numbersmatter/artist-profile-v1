import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { getParams, getQuestionById } from "~/server/routes-logic/profile/profile.server";


export async function loader({params}:LoaderArgs) {
  const { profileId, questionId } = getParams(params);

  const question = await getQuestionById(profileId, questionId);
  if(!question){
    return redirect(`/edit-profile/${profileId}/questions`)
  };



  return json({question});
}


export default function QuestionIdPage() {
  const {question } = useLoaderData<typeof loader>();

  return (
    <div className="prose prose-xl">
      <h1>Welcome to Question Page</h1>
      <p>This is the  QuestionIdPage</p>

      <div>
        <QuestionPanel name={question.name} text={question.text}>
          {
            question.fieldOrder.map((fieldId)=>{
              const field = question.fieldObj[fieldId];

              return <StackedField 
                key={field.fieldId}
                field={field}
                defaultValue={""}
              />
            })
          }
          <Link
            to={"add-field"} 
          >
            Add Field
          </Link>

        </QuestionPanel>
      </div>
    </div>
  );
}