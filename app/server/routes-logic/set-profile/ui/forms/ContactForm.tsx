import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import QuestionContainer from "./QuestionContainer"

export async function loader({params}:LoaderArgs) {
  const questionName = " Whats the best way to contact you?"
  const questionText = "If I accept your commission will need to get in contact with you for further details."

  return json({
    questionName,
    questionText

  });
}




export default function ContactForm() {
  const { questionName, questionText } = useLoaderData();
  
  return (
    <QuestionContainer questionName={questionName} questionText={questionText} >


    </QuestionContainer>
  );
}