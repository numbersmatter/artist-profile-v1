import { FieldValue } from "firebase-admin/firestore";
import { db, ImageObject } from "./db.server";
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

export const readIntentDoc =async (
  profileId:string,
  intentId: string,
) => {
  const intentRef = db.intents(profileId).doc(intentId);
  const intentSnap = await intentRef.get();
  const intentData = intentSnap.data();
  
  if(!intentData){
    return undefined;
  }

  return { ...intentData, intentId}
};

export const isIntentValid =async (
  profileId:string,
  intentId: string,
) => {
  const intentDoc = await readIntentDoc(profileId, intentId);

  if(!intentDoc){
    return "invalid";
  }

  return intentDoc.status;
}


export const submitIntent = async (
  profileId:string,
  intentId: string,
) => {
  // setFrom status to submitted
  // 1 get intent ref
  const intentRef = db.intents(profileId).doc(intentId)
  const updateData ={
    status:"submitted",
    submittedAt: FieldValue.serverTimestamp(),
  }

  // @ts-ignore
  return await  intentRef.update(updateData);
}



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
export const saveMilaImageUpload = async (
  profileId: string,
  intentId: string,
  stepId: string,
  imageObj:  {
    url: string,
    description: string,
  }
) => {
  const responseDocRef = db.imgUploads(profileId, intentId).doc(stepId);

  const imageId = db.profile().doc().id

  const imageData = {
    ...imageObj,
    imageId
  }
  
  
  const writeData = {
    imgList: FieldValue.arrayUnion(imageData)
  }

  //  @ts-ignore
  const writeResult = await responseDocRef.set(writeData, {merge:true});

  return writeResult;
};

export const deleteMilaImageUpload = async (
  profileId: string,
  intentId: string,
  stepId: string,
  imageData: { imageId: string, description: string, url:string},
) => {
  const responseDocRef = db.imgUploads(profileId, intentId).doc(stepId);
  
  
  const writeData = {
    imgList: FieldValue.arrayRemove(imageData)
  }

  //  @ts-ignore
  const writeResult = await responseDocRef.update(writeData);

  return writeResult;
};




export const readMilaImageUpload =async (  
  profileId: string,
  intentId: string,
  stepId: string,
) => {
  const responseRef = db.imgUploads(profileId, intentId).doc(stepId);
  const responseSnap = await responseRef.get();
  const responseData = responseSnap.data();

  if(!responseData){
    return undefined;
  }

  return responseData;
}
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
