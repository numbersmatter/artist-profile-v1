import { json, LoaderArgs } from "@remix-run/node";

export async function loader({params}:LoaderArgs) {
  const formId = params.formId ?? "no-id"
  // const formDoc= getFormByID("milachu92", )

  return json({});
}



export default function FormInfo() {
  
  return (
    <article className="prose prose-xl">
      <h1>Welcome to FormInfo</h1>
      <p>This is the  FormInfo</p>
    </article>
  );
}