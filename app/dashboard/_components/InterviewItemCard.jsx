import React from 'react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'
import { db } from '../../../utils/db';
import { MockInterview, UserAnswer } from '../../../utils/schema';
import { eq } from 'drizzle-orm';

function InterviewItemCard({interview, onDelete}) {

    const router = useRouter();

    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId)
    }

    const onFeedbackPress = () => {
        router.push('/dashboard/interview/' + interview?.mockId + '/feedback')
    }

    const onDeleteQuery = async () => {
      try {
        await db.delete(MockInterview).where(eq(MockInterview?.mockId, interview?.mockId));
        await db.delete(UserAnswer).where(eq(UserAnswer?.mockIdRef, interview?.mockId));
        onDelete(interview.mockId)
      } catch (error) {
        console.error('Error deleting interview:', error);
      }
    }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years Of Experience</h2>
      <h2 className='text-xs text-gray-400'>Created At : {interview.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <Button size="sm" variant="outline"className="w-full" onClick={onFeedbackPress}>Feedback</Button>
        <Button size="sm" className="w-full" onClick={onStart}>Start</Button>
        <Button size="sm" className="w-full bg-red-500" onClick={() => onDeleteQuery()}>Delete</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
