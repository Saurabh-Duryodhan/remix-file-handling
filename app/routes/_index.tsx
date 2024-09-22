import { ActionFunction, ActionFunctionArgs, unstable_parseMultipartFormData } from "@remix-run/node";
import { createFileUploadHandler } from "@remix-run/node/dist/upload/fileUploadHandler";
import { Form, useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  let response
  if (request.method === "POST") {
    const uploadDir = process.cwd() + "/uploads"
    const uploadHandler = createFileUploadHandler({ directory: uploadDir, maxPartSize: 5_000_000, file: ({ filename }) => uploadDir + "/" + filename })
    try {
      const file = await unstable_parseMultipartFormData(request, uploadHandler)
      response = !file ? "Failed to upload file" : "File uploaded successfully!"
    } catch (error) {
      console.log("ERROR: ", error)
      response = error
    }
  }
  return response
}

export default function Index() {
  const actionData: string | undefined = useActionData()

  return <Form method="POST" encType="multipart/form-data">
    <label htmlFor="image"></label>
    <input name="img" type="file" />
    <button type="submit">Upload</button>
    <h3>{actionData && actionData}</h3>
  </Form>
}