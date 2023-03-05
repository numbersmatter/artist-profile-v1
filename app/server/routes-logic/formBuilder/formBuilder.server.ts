import { db } from "~/server/db.server"


export const getForms =async () => {
  const formSnap = await db.forms().get();
  const forms = formSnap.docs.map((docSnap)=>({...docSnap.data(), formId: docSnap.id}))

  return forms;
  
}

