import { FieldValue } from "firebase-admin/firestore";
import { db } from "./db.server";
// @ts-ignore
import * as hri from "human-readable-ids";



export const createMilaIntent = async (
  profileId: string,
  opportunityId: string,

) => {
  const intentRef = db.intents(profileId).doc();

  const defaultData = {
    opportunityId: opportunityId,
    createdAt: FieldValue.serverTimestamp(),
    humanReadableId: hri.hri.random(),
    status: "in-progress",
    questionOrder: [],
    questionStatus: {},
  };

  //  @ts-expect-error
  const writeResult = await intentRef.create(defaultData);

  return { ...writeResult, intentId: intentRef.id };
};



export const saveMilaResponse = async (
  profileId: string,
  intentId: string,
  stepId: string,
  data: { [key: string]: string }
) => {
  const responseDocRef = db.responses(profileId, intentId).doc(stepId);
  const writeData = {
    fieldResponses: data
  }
  const writeResult = await responseDocRef.set(writeData);

  return writeResult;
};

export const readMilaResponse =async (  
  profileId: string,
  intentId: string,
  stepId: string,
) => {
  const responseRef = db.responses(profileId, intentId).doc(stepId);
  const responseSnap = await responseRef.get();
  const responseData = responseSnap.data();

  if(!responseData){
    return undefined;
  }

  return responseData;
}
