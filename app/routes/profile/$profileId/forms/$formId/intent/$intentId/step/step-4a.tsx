import { ArrowUpTrayIcon,  } from "@heroicons/react/20/solid";
import { XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderArgs, UploadHandler } from "@remix-run/node";
import { unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import {
  json,
  // redirect 
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { deleteMilaImageUpload, readMilaImageUpload, saveMilaImageUpload, } from "~/server/mila.server";
import { uploadImage } from "~/server/routes-logic/formBuilder/cloudinary.server";
import FormButtons from "~/server/routes-logic/formBuilder/ui/elements/FormButtons";

import { getParams } from "~/server/routes-logic/profile/profile.server";






export async function action({ params, request }: ActionArgs) {
  const { intentId, profileId } = getParams(params);
  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      if (!data) {
        return undefined
      }

      const uploadedImage = await uploadImage(intentId, data);
      return uploadedImage.secure_url;
    },
    unstable_createMemoryUploadHandler()
  );

    const formData = await unstable_parseMultipartFormData(request, uploadHandler);

    const imgSrc = formData.get("img") as string;
    const imgDesc = formData.get("desc") as string;
    if (!imgSrc) {
      return json({ error: "something wrong" });
    }

    await saveMilaImageUpload(profileId, intentId, "step-4a", { url: imgSrc, description: imgDesc })
    const imageUploadedText = `${imgDesc} uploaded`
    return json({ imageUploadedText });


};



export async function loader({ params }: LoaderArgs) {
  const { profileId, formId, intentId } = getParams(params);


  const stepId = "step-4a"
  const imagesUploadDoc = await readMilaImageUpload(profileId, intentId, "step-4a")
  const imgsUploaded = imagesUploadDoc ? imagesUploadDoc.imgList : []


  const deleteImageUrl = `/profile/${profileId}/forms/${formId}/intent/${intentId}/${stepId}/deleteImage`


  const questionName = "Character References";

  const questionText = "Here you can upload reference images. If you cannot upload images, you can provide links to images on the next page.";

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
  const nextUrl =
    `/profile/${profileId}/forms/${formId}/intent/${intentId}/step/step-4`

  const maxImagesReached = imgsUploaded.length < 8 


  return json({ question, backUrl, imgsUploaded, deleteImageUrl, nextUrl, maxImagesReached });
}


const regularClass = " inline-flex items-center border-2 gap-x-4 rounded-md bg-orange-500 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 hover:border-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

const disabledClass = " inline-flex items-center border-2 gap-x-4 rounded-md bg-slate-500 py-2.5 px-3.5 text-sm font-semibold text-white"


export default function Step4a() {
  const [filesPresent, setFilesPresent] = useState<boolean>(false);
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const cancelButtonRef = useRef(null)
  const {
    question,
    backUrl,
    imgsUploaded,
    deleteImageUrl,
    nextUrl,
    maxImagesReached,
  } = useLoaderData<typeof loader>();

  const actionData = useActionData();
  let transition = useTransition();
  let submit = useSubmit();
  let isUploading = 
    transition.state === "submitting" && 
    transition.submission?.formData.get("_action") === "uploadImage"

  let formRef = useRef();
  let fileInputRef = useRef(null);

  useEffect(() => {
    if (filesPresent && formRef.current) {
      submit(formRef.current, {})
    }
  }, [filesPresent, submit])

  useEffect(() => {
    if (!isUploading) {
      // @ts-ignore
      formRef.current?.reset()
      setFileName("")
      setFilesPresent(false)
      setOpen(false)
    }
  }, [isUploading])


  const checkFilesPresent = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const filesArray = e.currentTarget.files ?? []
    const areFiles = filesArray.length > 0

    if (areFiles) {
      setFileName(filesArray[0].name)

      return setFilesPresent(true)
    }

    return setFilesPresent(false)
  }

  const openFileInput = () => {
    // @ts-ignore
    fileInputRef.current.click()
  }


  return (
    <div className="max-w-2xl pb-5">
        <div className="bg-white  px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                  {question.name}
                </h3>
                <p className="mt-1 text-base text-gray-500">
                  {question.text}
                </p>
              </div>
              <div className="">

                {/* <div className=" inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={openModel}
                    className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    Open dialog
                  </button>
                </div>
                <Modal
                  open={open}
                  onClose={setOpen}
                  cancelButtonRef={cancelButtonRef}
                > */}

                {
                  maxImagesReached ?
                  <div className=" py-4 inset-0 flex items-center justify-center" >
                  <button
                    className={isUploading ? disabledClass : regularClass}
                    onClick={openFileInput}
                    disabled={isUploading}
                    >
                    <ArrowUpTrayIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </button>

                </div>
                : <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You have reached the maximum number of images uploaded. Please delete some images in order to upload new images. 
                    </p>
                  </div>
                </div>
              </div>

}


                {/* @ts-ignore */}
                <Form ref={formRef} method="post" encType="multipart/form-data" >
                  {actionData ? <p>{JSON.stringify(actionData)}</p> : <p>
                  </p>}
                  <fieldset className="grid grid-cols-1 py-3">
                    <div className="mx-auto">

                      {/* <label className=" max-w-xs inline-flex items-center border-2 gap-x-4 rounded-md bg-slate-500 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:border-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" htmlFor="img-field"> */}
                      <input
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => checkFilesPresent(e)}
                        id="img-field"
                        type="file"
                        name="img"
                        accept="image/*"
                      />
                      <input
                        className="hidden"
                        name="_action"
                        value="uploadImage"
                        readOnly
                      />

                      {/* </label> */}
                    </div>


                    <div className="">
                      <div className="mt-2">
                        <input
                          id="desc"
                          name="desc"
                          className="hidden"
                          value={fileName}
                          readOnly
                        />
                      </div>
                    </div>

                  </fieldset>
                  {/* <div className="py-3 flex justify-end">
                    {
                      filesPresent
                        ? <button type="submit"
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

                        >Upload Image</button>
                        : <p>Choose a file for upload button to appear</p>
                    }

                  </div> */}
                </Form>
                {/* </Modal> */}


                <div className="py-4">
                  <h4 className="text-xl text-slate-700">Uploaded Images:</h4>
                  <p>Uploaded images will appear here. If you do not see your image it did not upload correctly.</p>
                  <ul
                    className=" pt-2 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                  >
                    {
                    
                    imgsUploaded.length > 0 ?
                    imgsUploaded.map((imageData
                    ) => (
                      <li key={imageData.url} className="relative">
                        <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                          <img src={imageData.url} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                        </div>
                        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{imageData.description}</p>
                        <Form method="post" action={deleteImageUrl}>
                          <button name="_action" value="delete" className="inline-flex items-center gap-x-1.5 rounded-md bg-slate-100 py-1.5 px-2.5 text-sm font-semibold text-slate-500 shadow-sm hover:bg-red-500  hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> <XCircleIcon className="h-6 w-6 " /> Delete </button>
                          <input
                            className="hidden"
                            name="imageId"
                            value={imageData.imageId} 
                            readOnly
                            />
                          <input
                            className="hidden"
                            name="url"
                            value={imageData.url} 
                            readOnly
                            />
                          <input
                            className="hidden"
                            name="description"
                            value={imageData.description} 
                            readOnly
                          />
                        </Form>
                      </li>
                    ))
                    : <div className="mx-auto ">
                      
                      <p className="text-xl text-slate-500"> No images uploaded</p>
                      </div>
                  
                  }
                  </ul>
                </div>









              </div>
            </div>
          </div>
        </div>


        <div className="py-3 flex justify-end">
      <Link
        to={backUrl}
        type="button"
        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Previous
      </Link>
      <Link
        to={nextUrl}
        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save/Next
      </Link>
    </div>

      </div>




  );
}
