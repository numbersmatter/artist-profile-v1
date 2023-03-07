import { FieldValue } from "firebase-admin/firestore";
import { db } from "~/server/db.server";
import * as hri from "human-readable-ids";
import { Field } from "../formBuilder/types";
import { z } from "zod";

// Singleton
export const getProfilePageHeaderData = async (profileId: string) => {
  const profileDataRef = db.profile().doc(profileId);
  const profileSnap = await profileDataRef.get();
  const profileData = profileSnap.data();
  if (!profileData) {
    return undefined;
  }

  return profileData;
};

// Anderson Pattern
export const getProfileFAQs = async (profileId: string) => {
  const faqQueryRef = db.faqs(profileId);

  const faqQuerySnap = await faqQueryRef.get();

  // Order by a property on the document
  const faqDocs = faqQuerySnap.docs
    .map((faqSnap) => ({ ...faqSnap.data(), faqId: faqSnap.id }))
    .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

  return faqDocs;
};

// Anderson Pattern for Opportunities
export const getOpenOpportunities = async (profileId: string) => {
  const OppRef = db.opportunites(profileId).where("status", "==", "open");
  const oppSnap = await OppRef.get();

  const oppList = oppSnap.docs.map((snap) => ({
    ...snap.data(),
    opportunityId: snap.id,
  }));

  return oppList;
};

export const createNewIntent = async (
  profileId: string,
  opportunityId: string
) => {
  const intentRef = db.intents(profileId).doc();
  
  const defaultData = {
    opportunityId: opportunityId,
    createdAt: FieldValue.serverTimestamp(),
    humanReadableId: hri.hri.random(),
  };
  
  const writeResult = await intentRef.create(defaultData);
  
  return { ...writeResult, intentId: intentRef.id };
};

export const getIntentById = async ( profileId:string, intentId:string ) =>{
  const intentRef = db.intents(profileId).doc(intentId);
  const intentSnap = await intentRef.get();
  const intentData = intentSnap.data();

  if(!intentData){
    return undefined;
  }

  return {...intentData, intentId}
}

export const getQuestionById = async (
  profileId: string,
  questionId: string
) => {
  const questionRef = db.questions(profileId).doc(questionId);
  const questionSnap = await questionRef.get();
  const questionData = questionSnap.data();

  if(!questionData){
    return undefined;
  }

  return { ...questionData, questionId}
};

export const getResponseById =async ( profileId: string, intentId: string, questionId: string ) => {
  const responseDocRef = db.responses(profileId, intentId).doc(questionId);
  const responseDocSnap = await responseDocRef.get();
  const responseData = responseDocSnap.data();

  if(!responseData){
    return undefined;
  };

  return { ...responseData, questionId}
}

export const createZodFromField = ( field:Field)=>{

  if(field.type in ["shortText", "longText"]){
    return z.string();
  };

  if( field.type === "select"){
    const options = field.options ?? []
    const validOptions = options.map((option)=> option.value);
    const validLabels = options.map((option)=>option.label);
    return z.string();
  }




  return z.string();

}


export const writeUserResponse = async ( profileId: string, intentId: string, questionId: string, data:{[key:string]: string} ) => {
  const responseDocRef = db.responses(profileId, intentId).doc(questionId);

  const writeResult = await responseDocRef.set(data);

  return writeResult;
}


export const getRequestIdRedirectUrl =async (profileId:string, formId:string, intentId:string) => {

  const intentDoc = await getIntentById(profileId, intentId);

  if(!intentDoc){
    return undefined;
  };

  if(intentDoc.status === "submitted"){
    const submittedUrl = `submitted`;
    return submittedUrl;
  };

  const nextNonCompletedQuestion = requestDoc.questionOrder.find(
    (questionId)=> requestDoc.questionStatus[questionId] === false
  );

  if(!nextNonCompletedQuestion){
    const reviewBeforeSubmitUrl = `/requests/${requestId}/review`;
    return reviewBeforeSubmitUrl;
  };
  
  const nextQuestionUrl = `/requests/${requestId}/questions/${nextNonCompletedQuestion}`;

  return nextQuestionUrl;
};
