import { FieldValue } from "firebase-admin/firestore";
import { db, IntentDoc } from "~/server/db.server";
import type { Field } from "../formBuilder/types";
import { z } from "zod";
//@ts-expect-error
import * as hri from "human-readable-ids";
import { Params } from "@remix-run/react";

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
  opportunityId: string,
  questionStatus: {[key:string]: boolean},
  questionOrder: string[],
) => {
  const intentRef = db.intents(profileId).doc();
  
  const defaultData = {
    opportunityId: opportunityId,
    createdAt: FieldValue.serverTimestamp(),
    humanReadableId: hri.hri.random(),
    status: "in-progress",
    questionOrder: questionOrder,
    questionStatus: questionStatus
  };
  
  //  @ts-expect-error
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

export const makeQuestion = async(
  profileId:string,
  data: {name:string, text:string}
)=>{
  const newQuestRef = db.questions(profileId).doc();

  const writeData = {
    ...data,
    fieldOrder: [],
    fieldObj: {},
  }

  const writequestion = await newQuestRef.create(writeData)

  return { ...writequestion, questionId:newQuestRef.id }
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

export const getAllQuestions =async (profileId:string) => {
  const allQuestionsRef = db.questions(profileId);
  const allQuestionsSnap = await allQuestionsRef.get(); 
  const allQuestions = allQuestionsSnap.docs.map((snap)=>({...snap.data(), questionId: snap.id}))
  
  return allQuestions;
}

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

  const nextNonCompletedQuestion = intentDoc.questionOrder.find(
    (questionId)=> intentDoc.questionStatus[questionId] === false
  );

  if(!nextNonCompletedQuestion){
    const reviewBeforeSubmitUrl = `review`;
    return reviewBeforeSubmitUrl;
  };
  
  // const nextQuestionUrl = `/requests/${requestId}/questions/${nextNonCompletedQuestion}`;

  return nextNonCompletedQuestion;
};


export const getParams = (params: Params<string>)=>{
  const profileId = params.profileId ?? "no-profileId";
  const questionId = params.questionId ?? "no-questionId";
  const formId = params.formId ?? "no-formId";



  return {
    profileId,
    questionId,
    formId,

  }
}
