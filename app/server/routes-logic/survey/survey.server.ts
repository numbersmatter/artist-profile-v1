import type { FieldValue, Firestore, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { versionUrl } from "~/server/db.server";

// helper function to convert firestore data to typescript
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

// helper to apply converter to multiple collections
const dataPoint = <T extends FirebaseFirestore.DocumentData>(
  collectionPath: string
) => getFirestore().collection(collectionPath).withConverter(converter<T>());

interface SurveyDoc {
  profileId: string,
}

export const surveyDb = {
  survey: () => dataPoint<SurveyDoc>(`${versionUrl}/survey`),
}

export const getSurveyDoc = async(surveyId: string | undefined)=>{
  if(!surveyId){
    return undefined
  }

  const surveyRef = surveyDb.survey().doc(surveyId);
  const surveySnap = await surveyRef.get();
  const surveyData = surveySnap.data();
  if(!surveyData){
    return undefined;
  }

  return { ...surveyData, surveyId}

}

export const getNextUrl =  (
  questionOrder: string[],
  questionStatus: { [key: string]: boolean }
) => {

  const nextNonCompletedQuestion = questionOrder.find(
    (questionId) => questionStatus[questionId] === false
  );

  if (!nextNonCompletedQuestion) {
    const reviewBeforeSubmitUrl = `review`;
    return reviewBeforeSubmitUrl;
  }

  

  return nextNonCompletedQuestion;
};





