import { db } from "~/server/db.server"


// Singleton
export const getProfilePageHeaderData = async (profileId: string) => {
  const profileDataRef = db.profile().doc(profileId);
  const profileSnap = await profileDataRef.get();
  const profileData = profileSnap.data();
  if(!profileData){
    return undefined;
  };


  return profileData
}


// Anderson Pattern
export const getProfileFAQs =async (profileId:string) => {
  const faqQueryRef = db.faqs(profileId)

  const faqQuerySnap = await faqQueryRef.get();

  // Order by a property on the document
  const faqDocs = faqQuerySnap.docs.map((faqSnap)=>(
    {...faqSnap.data(), faqId: faqSnap.id})).sort((a,b) => a.createdAt.seconds -b.createdAt.seconds)

  return faqDocs;
}

// Anderson Pattern for Opportunities
export const getOpenOpportunities =async (profileId: string) =>{

  
}


export const makeCommissionIntent = ()=>{

  return "commission-intent-url"
}

