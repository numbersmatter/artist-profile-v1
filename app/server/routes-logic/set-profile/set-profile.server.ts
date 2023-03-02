import { FieldValue } from "firebase-admin/firestore";
import { db, Profile } from "~/server/db.server";


export const setProfileData =async (profileId:string, profileData: Profile) => {
  const profileDataRef = db.profileData().doc(profileId);

  const writeResult = await profileDataRef.set(profileData)
  
  return { writeResult}
}
export const addFAQ =async (profileId:string, faqData: { faqAnswer: string, faqQuestion:string}) => {
  const faqRef = db.faqsWrite().doc();

  const writeFaq ={
    ...faqData,
    profileId,
    createdAt: FieldValue.serverTimestamp(),
  }

  const writeResult = await faqRef.set(writeFaq)
  
  return { writeResult, faqId: faqRef.id}
}