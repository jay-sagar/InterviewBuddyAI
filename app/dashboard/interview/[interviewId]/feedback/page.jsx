"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { UserAnswer } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../../../components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [totalRating, setTotalRating] = useState();
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);

    // calculate total rating
    let sumRating = 0;
  result.forEach(item => {
    const rating = parseInt(item.rating); 

    // Check if rating is a valid number before adding
    if (!isNaN(rating)) {
      sumRating += rating;
    }
  })
  setTotalRating(sumRating)
  };

  return (
    <div className="p-10">
      

        {feedbackList?.length == 0 ? <div className="grid place-content-center bg-white px-4">
  <div className="text-center">
    <h1 className="text-9xl font-black text-gray-200">404</h1>

    <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

    <p className="mt-4 text-gray-500">No Interview Feedback Record Found.</p>
  </div>
</div> : <>
            <h2 className="text-3xl font-bold text-green-500">Congratulation!</h2>
            <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
            <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>{totalRating} / {feedbackList.length * 10} </strong>
      </h2>
      <h2 className="text-sm text-gray-500">
        Find below interview question with correct answer, Your answer and
        feedback for improvement{" "}
      </h2>
      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={index} className="mt-7">
            <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
              {item.question} <ChevronsUpDown className="h-5 w-5"/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg "><strong>Rating : </strong>{item.rating}</h2>
                <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900"><strong>Your Answer : </strong>{item.userAns}</h2>
                <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900"><strong>Correct Answer : </strong>{item.correctAns}</h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900"><strong>Feedback : </strong>{item.feedback}</h2>

              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        </>}

        <Button onClick={()=> router.replace('/dashboard')} className="">Go Home</Button>
    </div>
  );
}

export default Feedback;
