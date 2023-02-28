import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
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

const versionUrl = "testCollection/version5"


export const db = {
  userNotes: (uid: string) => dataPoint<Note>(`users/${uid}/notes`),
  profileData : ()=> dataPoint<Profile>(`${versionUrl}/profileData`)
};
