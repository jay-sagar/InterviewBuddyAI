"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { chatSession } from "../../../utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { MockInterview} from "../../../utils/schema";
import { db } from "../../../utils/db";
import { v4 as uuidv4 } from 'uuid'; // to create unique Ids
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [JsonResponse, setJsonResponse] = useState([]);
    const {user} = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        // console.log(jobPosition, jobDesc, jobExperience);

        const InputPrompt = "Job Position: "+ jobPosition +", Job Description: "+ jobDesc + ", Years of Experience: " + jobExperience +", Depends on this information please give me "+ process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +" interview question with answers in JSON format only with no backticks. Doesn't need extra info, only questions and answers.";

        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResp = (result.response.text()).replace('```json','').replace('```','')
        // console.log(MockJsonResp); // In string format
        // console.log(JSON.parse(MockJsonResp)); // In Json format
        setJsonResponse(MockJsonResp);

        if (MockJsonResp) {
            const resp = await db.insert(MockInterview).values({
                mockId : uuidv4(),
                jsonMockResp : MockJsonResp,
                jobPosition : jobPosition,
                jobDesc : jobDesc,
                jobExperience: jobExperience,
                createdBy : user?.primaryEmailAddress?.emailAddress,
                createdAt : moment().format('DD-MM-yyyy')
    
            }).returning({mockId:MockInterview.mockId});
    
            // console.log("Inserted Id : ", resp);
            if (resp) {
              setOpenDialog(false);
              router.push('/dashboard/interview/' + resp[0]?.mockId)
            }


        } else {
            console.log("ERR");
        }
        

        setLoading(false);
    }
  return ( 
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all" onClick={() => setOpenDialog(true)}>
        <h2 className=" text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
              <div>
                <h2>Add details about your job positions/role, Job description and years of experience.</h2>
                <div className="mt-7 my-2">
                    <label htmlFor="">Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required onChange={(event) => setJobPosition(event.target.value)}/>
                </div>
                <div className="mt-7 my-2">
                    <label htmlFor="">Job Description/ Tech Stack (In Short)</label>
                    <Textarea placeholder="Ex. React, Node.js, Next.js and PostgreSQL etc." onChange={(event) => setJobDesc(event.target.value)} required/>
                </div>
                <div className="mt-7 my-2">
                    <label htmlFor="">Years of experience.</label>
                    <Input placeholder="Ex. 5" type="number" max="50" onChange={(event) => setJobExperience(event.target.value)} required/>
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={()=> setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ?
                    <>
                    <LoaderCircle className="animate-spin"/>Generating from AI
                    </> : 'Start Interview'
                    }
                </Button>
              </div>    
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
