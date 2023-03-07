import { json, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAllQuestions, getParams } from "~/server/routes-logic/profile/profile.server";


export async function loader({params}:LoaderArgs) {
  const {profileId} = getParams(params)
  
  const questions = await getAllQuestions(profileId)


  return json({questions});
}



export default function QuestionsList() {
  const { questions} = useLoaderData<typeof loader>()
  return (
    <article className="prose prose-xl">
      <h1>Welcome to QuestionsList</h1>
      <p>This is the  QuestionsList</p>
      <ul>

      {
        questions.map(question =>
          <li key={question.questionId}>
            <Link
              to={question.questionId}
            >
              {question.name}
            </Link>
          </li>
          
          )
      }
      </ul>
    </article>
  );
}
