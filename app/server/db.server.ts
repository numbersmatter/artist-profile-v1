import type { FieldValue, Firestore, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

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

const versionUrl = "testCollection/version6"


export const db = {
  userNotes: (uid: string) => dataPoint<Note>(`users/${uid}/notes`),
  profile : ()=> dataPoint<Profile>(`${versionUrl}/profile`),
  faqs: (profileId:string) =>dataPoint<FAQ>(`${versionUrl}/profile/${profileId}/faqs`),
  faqsWrite: (profileId:string) =>dataPoint<FAQwrite>(`${versionUrl}/profile/${profileId}/faqs`),
  opportunites: (profileId:string) =>dataPoint<Opportunity>(`${versionUrl}/profile/${profileId}/opportunites`),
  
};
