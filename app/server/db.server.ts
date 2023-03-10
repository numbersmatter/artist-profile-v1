import type { FieldValue, Firestore, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { Question, Questionform } from "./routes-logic/formBuilder/types";

// helper function to convert firestore data to typescript
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

// helper to apply converter to multiple collections
const dataPoint = <T extends FirebaseFirestore.DocumentData>(
  collectionPath: string
) => getFirestore().collection(collectionPath).withConverter(converter<T>());


export type Note = {
  title: string;
  body: string;
}

export interface Profile {
  bannerImage: string,
  avatar: string,
  displayName: string,
  profileHeadline: string,
}

export interface FAQ {
  createdAt: Timestamp,
  faqAnswer: string,
  faqQuestion: string,
}
export interface FAQwrite {
  createdAt: FieldValue;
  faqAnswer: string;
  faqQuestion: string;
}

export interface Opportunity {
  createdAt:Timestamp,
  name: string,
  text:string,
  status: "open" | "closed";
}
export interface IntentDoc {
  createdAt:Timestamp,
  humanReadableId: string,
  opportunityId:string,
  status: "in-progress" | "submitted";
  submittedAt?: Timestamp,
  questionOrder: string[];
  questionStatus: {[key:string]: boolean}
}

export interface ResponseDoc {
  fieldResponses: {[key:string]:string}
}

export interface ImageObject {
  url: string,
  description: string,
  imageId: string,
}
export interface ImgUploadDoc {
  imgList: ImageObject[]
}

const versionUrl = "testCollection/version6"


export const db = {
  userNotes: (uid: string) => dataPoint<Note>(`users/${uid}/notes`),
  profile : ()=> dataPoint<Profile>(`${versionUrl}/profile`),
  faqs: (profileId:string) =>dataPoint<FAQ>(`${versionUrl}/profile/${profileId}/faqs`),
  faqsWrite: (profileId:string) =>dataPoint<FAQwrite>(`${versionUrl}/profile/${profileId}/faqs`),
  opportunites: (profileId:string) =>dataPoint<Opportunity>(`${versionUrl}/profile/${profileId}/opportunities`),
  intents: (profileId:string) => dataPoint<IntentDoc>(`${versionUrl}/profile/${profileId}/intents`),
  questions: (profileId:string) => dataPoint<Questionform>(`${versionUrl}/profile/${profileId}/questions`),
  responses: (profileId: string, intentId:string)=> dataPoint<ResponseDoc>(`${versionUrl}/profile/${profileId}/intents/${intentId}/responses`), 
  imgUploads: (profileId: string, intentId:string)=> dataPoint<ImgUploadDoc>(`${versionUrl}/profile/${profileId}/intents/${intentId}/imgUploads`), 

};
