import type { ActionArgs, LoaderArgs, UploadHandler } from "@remix-run/node";
import { unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import {
  json,
  // redirect 
} from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
// import { FieldValue } from "firebase-admin/firestore";
// import { z } from "zod";
import { readMilaImageUpload, saveMilaImageUpload, } from "~/server/mila.server";
import { uploadImage } from "~/server/routes-logic/formBuilder/cloudinary.server";
// import type { Field } from "~/server/routes-logic/formBuilder/types";
// import QuestionPanel from "~/server/routes-logic/formBuilder/ui/elements/QuestionPanel";
// import StackedField from "~/server/routes-logic/formBuilder/ui/elements/StackedField";
import { getParams } from "~/server/routes-logic/profile/profile.server";
// import FormButtons from "~/server/routes-logic/set-profile/ui/forms/FormButtons";



// const stepId = "step-4"



export async function action({ params, request }: ActionArgs) {
  const { intentId, profileId } = getParams(params);
  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      if(!data){
        return undefined
      }

      const uploadedImage = await uploadImage(intentId, data);
      return uploadedImage.secure_url;
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("img") as string;
  const imgDesc = formData.get("desc");
  if (!imgSrc) {
    return json({ error: "something wrong" });
  }



  await saveMilaImageUpload(profileId, intentId, "step-4a", imgSrc)

  return json({ imgDesc, imgSrc });
};

// export async function actionOld({ params, request }: ActionArgs) {
//   const formValues = Object.fromEntries(await request.formData());
//   const { profileId, intentId, formId } = getParams(params);


//   const QuestionCreateSchema = z.object({
//     charArea: z.string(),
//   })

//   const checkSchema = QuestionCreateSchema.safeParse(formValues);
//   if (!checkSchema.success) {
//     const rawMessage = checkSchema.error.issues.find((error) => error.path[0] === "charArea")?.message

//     const message = rawMessage ?? "There was an error."


//     return message;
//   } else {
//     //  @ts-ignore
//     const writeResult = await saveMilaResponse(profileId, intentId, stepId, checkSchema.data)
//     const redirectUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-5`

//     return redirect(redirectUrl);
//   }
// }



export async function loader({ params }: LoaderArgs) {
  const { profileId, formId, intentId } = getParams(params);


  const imagesUploadDoc = await readMilaImageUpload(profileId, intentId, "step-4a")
  const imgsUploaded = imagesUploadDoc ? imagesUploadDoc.imgList : []




  const questionName = "Character References";

  const questionText = "Here you can upload images or you can put links to your character references here. You don't need to link anything if you already uploaded a reference in another question. If so, you can put their names here. You don't need to put a reference if you want a character to be anonymous or one of my characters.";

  const question = {
    name: questionName,
    text: questionText,
  }

  // const characterRef: Field = {
  //   fieldId: "charArea",
  //   type: "longText",
  //   label: "Character Reference Details",

  // }

  // const fields: Field[] = [characterRef];

  const backUrl =
    `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-3`


  return json({ question, backUrl, imgsUploaded, });
}




export default function Step4a() {
  const [filesPresent, setFilesPresent ] = useState<boolean>(false)
  const {
    // question, 
    // backUrl, 
    imgsUploaded,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  let transition = useTransition();
  let isUploading = transition.state =="submitting"

  let formRef = useRef()

  useEffect(()=>{
    if(!isUploading){
      // @ts-ignore
      formRef.current?.reset()
      setFilesPresent(false)
    }
  },[isUploading])


  const checkFilesPresent= (e:React.ChangeEvent<HTMLInputElement> )=>{
    e.preventDefault()
    const filesArray = e.currentTarget.files ?? []
    const areFiles = filesArray.length > 0

    if(areFiles){
      return setFilesPresent(true)
    }

    return setFilesPresent(false)
  }

  console.log(imgsUploaded)


  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
    <div className="px-4 py-5 sm:p-6">{/* Content goes here */}
{/* @ts-ignore */}
      <Form ref={formRef} method="post" encType="multipart/form-data">
        {actionData ? <p>{JSON.stringify(actionData)}</p> : <p>
        </p>}
        <label htmlFor="img-field">Image to upload</label>
        <input onChange={(e) => checkFilesPresent(e) } id="img-field" type="file" name="img" accept="image/*" />
        <label htmlFor="img-desc">Image description</label>
        <input id="img-desc" type="text" name="desc" />
        {
          filesPresent 
          ? <button type="submit">Upload Image</button>
          : <p>Choose a file for upload button to appear</p>
        }
      </Form>
      <ul 
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
        >
        {imgsUploaded.map((url) => (
          <li key={url} className="relative">
            <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img src={url} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details</span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">file</p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">size</p>
          </li>
        ))}
      </ul>
        </div>
    </div>
  );
}
