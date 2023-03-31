import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { versionUrl } from "~/server/db.server";
import type { Field } from "../formBuilder/types";

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
  profileId: string;
}

export const surveyDb = {
  survey: () => dataPoint<SurveyDoc>(`${versionUrl}/survey`),
};

export const getSurveyDoc = async (surveyId: string | undefined) => {
  if (!surveyId) {
    return undefined;
  }

  const surveyRef = surveyDb.survey().doc(surveyId);
  const surveySnap = await surveyRef.get();
  const surveyData = surveySnap.data();
  if (!surveyData) {
    return undefined;
  }

  return { ...surveyData, surveyId };
};

export const getSectionData = async (
  surveyId: string | undefined,
  sectionId: string | undefined
) => {
  const surveyData = getSurveyDoc(surveyId);
};

export const getNextUrl = (
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

export interface OpeningDoc {
  formId: string;
  profileId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "open" | "closed";
  sectionOrder: string[];
  sections: {
    sectionId: string;
    fieldOrder: string[];
    fieldObj: {
      [key: string]: Field;
    };
    name: string;
    text: string;
  }[];
}
export interface OpeningDocWId extends OpeningDoc {
  openId: string;
}

export interface SubmittedIntentDoc {
  humanReadableId: string;
  status: "in-progress" | "submitted";
  createdAt: Timestamp;
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  profileId: string;
  openingId: string;
  formId: string;
  sectionOrder: string[];
  sectionStatus: { [key: string]: boolean };
}

export interface FormDoc {
  name: string;
  text: string;
  sectionOrder: string[];
}

export const getOpenForms = async (profileId: string) => {
  const openQuery = await dbNew
    .openings(profileId)
    .where("status", "==", "open")
    .get();

  const openForms = openQuery.docs.map((snap) => ({
    ...snap.data(),
    openId: snap.id,
  }));

  return openForms;
};

export const getOpenDoc = async (profileId: string, openId: string) => {
  const docRef = dbNew.openings(profileId).doc(openId);
  const docSnap = await docRef.get();
  const docData = docSnap.data();

  if (!docData) {
    return undefined;
  }

  return { ...docData, openId };
};

export const createNewDBIntent = async ({
  profileId,
  openId,
  formId,
  sectionOrder,
}: {
  profileId: string;
  openId: string;
  formId: string;
  sectionOrder: string[];
}) => {
  const sectionStatus = sectionOrder.reduce(
    (acc, cur) => ({ ...acc, [cur]: false }),
    {}
  );

  const intentDocData: IntentDoc = {
    // @ts-ignore
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    openId,
    profileId,
    formId,
    sectionOrder,
    intentStatus: "in-progress",
    sectionStatus,
  };

  const newIntentRef = dbNew.intents(profileId).doc();

  const writeResult = await newIntentRef.create(intentDocData);

  return { ...writeResult, intentId: newIntentRef.id };
};

export const getFormRecentStatus = async (
  profileId: string,
  formId: string
) => {
  const formIdQuery = await dbNew
    .openings(profileId)
    .where("formId", "==", formId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  const noDoc = formIdQuery.empty;

  if (noDoc) {
    return {
      openId: "none",
      formId,
      profileId,
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now(),
      status: "closed",
      sectionOrder: [],
      neverOpened: true,
    };
  }

  const openDoc = formIdQuery.docs.map((snap) => ({
    ...snap.data(),
    openId: snap.id,
    neverOpened: false,
  }))[0];
};

export interface IntentDoc {
  createAt: Timestamp;
  updateAt: Timestamp;
  openId: string;
  profileId: string;
  formId: string;
  sectionOrder: string[];
  intentStatus: "in-progress" | "submitted";
  sectionStatus: { [key: string]: boolean };
  submittedAt?: Timestamp;
}

const dbBase = "database/version2";

export const writeSection = async (
  profileId: string,
  formId: string,
  sectionData: any
) => {
  const sectionRef = dbNew.sections(profileId).doc();
  const formDocRef = dbNew.newFormDoc(profileId).doc(formId);

  const writeSection = await sectionRef.create(sectionData);

  const updateFormDoc = formDocRef.update({
    sectionOrder: FieldValue.arrayUnion(sectionRef.id),
  });
};

export const dbNew = {
  intents: (profileId: string) =>
    dataPoint<IntentDoc>(`${dbBase}/profiles/${profileId}/intents`),
  intentsSubmitted: (profileId: string) =>
    dataPoint<SubmittedIntentDoc>(
      `${dbBase}/profiles/${profileId}/intents`
    ).where("status", "==", "submitted"),
  // sections: (profileId: string) =>
  //   dataPoint<FormSectionDoc>(`${dbBase}/profiles/${profileId}/sections`),
  forms: (profileId: string) =>
    dataPoint<FormDoc>(`${dbBase}/profiles/${profileId}/forms`),
  openings: (profileId: string) =>
    dataPoint<OpeningDoc>(`${dbBase}/profiles/${profileId}/openings`),
  newFormDoc: (profileId: string) =>
    dataPoint(`database/version2/profiles/${profileId}/forms`),
  sections: (profileId: string) =>
    dataPoint(`database/version2/profiles/${profileId}/sections`),
};
