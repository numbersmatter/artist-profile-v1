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


export const makeCommissionIntent = ()=>{

  return "commission-intent-url"
}

