import { db } from "~/server/db.server"


export const getProfileData = async (profileId: string) => {
  const profileDataRef = db.profileData().doc(profileId);
  const profileSnap = await profileDataRef.get();
  const profileData = profileSnap.data();
  if(!profileData){
    return undefined;
  };


  return profileData
}

export const getProfileFAQs =async (profileId:string) => {
  const faqQueryRef = db.faqs().where("profileId", "==", profileId)

  const faqQuerySnap = await faqQueryRef.get();

  const faqDocs = faqQuerySnap.docs.map((faqSnap)=>(
    {...faqSnap.data(), faqId: faqSnap.id})).sort((a,b) => a.createdAt.seconds -b.createdAt.seconds)

  return faqDocs;
}


export const makeCommissionIntent = ()=>{

  return "commission-intent-url"
}

