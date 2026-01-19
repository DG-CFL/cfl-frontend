import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { PlusIcon } from "lucide-react";
import type { ChangeEventHandler, ChangeEvent } from "react";

interface EmailTemplateButtonProps {
  template : string
};

export default function EmailPage() {
  const selectedParticipants = 5;
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const handleSubjectChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    setSubject(e.target.value );
  }
  const handleBodyChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value );
  }
  return (
    <div className="w-full p-5">
    <div className="flex flex-col">
      <h1> Choose Email Template</h1>
      <p className="p-2"> Choose the Email Template you would like to send to the {selectedParticipants} selected participants</p>
      
      <div className="flex flex-row justify-between m-5 mb-0">
        <EmailTemplateButtons />
        <PreviewButton />
      </div>


      
      
      <div className="flex flex-col m-5 mb-40 mt-0">
        <Textarea value={subject} placeholder="Subject" onChange={handleSubjectChange}/>
        <Textarea className="h-100" value={body} placeholder="Body" onChange={handleBodyChange}/>
      </div>
        <div className="flex flex-row justify-between">
          <Button className="px-5 w-50">
              Cancel
          </Button>
          <div className="flex flex-row justify-around">
            <Button className="mx-2 w-50">
              Save
            </Button>
            <Button className="mx-2 w-50">
              Send
            </Button>
          </div>
        </div>

    </div>
    </div>

  )
}

const EmailTemplateButton : React.FC<EmailTemplateButtonProps> = ({template}) => {
  return (
    <Button className="h-15">
      <p className="text-sm">{template}</p>
    </Button>
  );
}
const EmailAddButton : React.FC = () => {
  return (
    <Button className="h-15 w-15 bg-gray-300 hover:bg-gray-500">
      <PlusIcon color="#000000"/>
    </Button>
  )
}
const EmailTemplateButtons = () => {
  const templates : string[]= ["course information", "survey request", "e-certificate"];

  return (
    <div className="self-start flex flex-row justify-start">
      {templates.map(
        (template : string) => {
          return (
            <EmailTemplateButton template={template} />
          )
        }
      )}
      <EmailAddButton />
    </div>
  )
}
const PreviewButton = () => {

  const handlePreview = () => {
    
  }
  return (
    <div className="self-end" onClick={handlePreview}>
      <Button className="w-50">
        Preview
      </Button>
    </div>
  )
}
