"use client"
import React, { act, useEffect, useState } from 'react'
import { db } from '../../../../../utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '../../../../../utils/schema';
import QuestionsSection from '../start/_components/QuestionsSection'
import RecordAnswerSection from '../start/_components/RecordAnswerSection'
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestions, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        GetInterviewDetails();
    },[]);

    // Used to get interview details by mockId/InterviewId from postgresql
    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        // console.log(jsonMockResp)
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    };
  return (
    <div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      {/* Questions */}
        <QuestionsSection mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex}/>

      {/* Video/ Audio Recording */}
      <RecordAnswerSection mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
    </div>
    <div className='flex justify-end gap-6'>
      {activeQuestionIndex > 0 && 
      <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)} >Previous Button</Button>}
      {activeQuestionIndex != mockInterviewQuestions?.length - 1 && 
      <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)} >Next Question</Button>}
      {activeQuestionIndex == mockInterviewQuestions?.length - 1 && 
      <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'}>
      <Button >End Interview</Button>
      </Link>}
    </div>
    </div>
  )
}

export default StartInterview
