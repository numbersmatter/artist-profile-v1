import { FieldValue } from "firebase-admin/firestore";
import { db } from "~/server/db.server";
import * as hri from "human-readable-ids";

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
