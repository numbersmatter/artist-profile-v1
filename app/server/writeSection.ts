import { FieldValue } from "firebase-admin/firestore";
import { db } from "./db.server"


export const writeSection = async (profileId:string, formId:string, sectionData:any) => {
  const sectionRef = db.sections(profileId).doc();
  const formDocRef = db.newFormDoc(profileId).doc(formId)
  
  const writeSection = await sectionRef.create(sectionData);

  const updateFormDoc = formDocRef.update({
    sectionOrder: FieldValue.arrayUnion(sectionRef.id)
  })

  
}