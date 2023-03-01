import { db, Profile } from "~/server/db.server";


export const setProfileData =async (profileId:string, profileData: Profile) => {
  const profileDataRef = db.profileData().doc(profileId);

  const writeResult = await profileDataRef.set(profileData)
  
  return { writeResult}
}