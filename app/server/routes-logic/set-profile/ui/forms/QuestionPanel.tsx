import type { Field } from "../../types";
import FormButtons from "./FormButtons";
import QuestionContainer from "./QuestionContainer";
import QuestionFields from "./QuestionFields";




export default function QuestionPanel({ 
  questionDisplayData,
  actionData,
  docData,
}:{
  questionDisplayData: {
    questionName: string,
    questionText: string,
    fields: Field[],
  } ,
  docData: {[index:string]:string},
  actionData:any
}) {
  const { questionName, questionText, fields }= questionDisplayData;
  return (
    <>
        <div className="space-y-6 py-4 px-4 rounded-lg bg-slate-200">
          {
            actionData
              ? <p>{JSON.stringify(actionData)}</p>
              : <p> &nbsp; </p>
          }
  
          <QuestionContainer
            questionName={questionName}
            questionText={questionText}
          >
            <QuestionFields responseValues={docData} fields={fields} />
          </QuestionContainer>
        </div>
        <FormButtons cancelUrl="../"/>
    </>
  );
}