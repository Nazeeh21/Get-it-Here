import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

interface CommentCompProps {
  comment: any;
}

export const CommentComp: React.FC<CommentCompProps> = ({ comment }) => {
  const acceptedAnswer = useSelector(
    (state: any) => state.question.acceptedAnswer
  );
  console.log('comment: ', comment);
  const router = useRouter();

  return (
    <div
      className={`flex ${
        acceptedAnswer.githubId === comment.githubId
          ? 'float-left'
          : 'float-right'
      } w-6/12 max-w-full`}
    >
      <img
        className='w-10 h-10 rounded-full mr-2 cursor-pointer'
        onClick={() =>
          router.push(`https://github.com/${comment.creator.name}`)
        }
        src={comment.creator.avatarUrl}
        alt={comment.creator.name}
      />
      <div
        className={`w-full rounded-md ${
          acceptedAnswer.githubId === comment.githubId
            ? 'bg-acceptedAnswer text-black'
            : 'text-white bg-iconBlue'
        } rounded-tl-none p-2 mb-4 pl-3`}
      >
        <div>{comment.text}</div>
        <div className='mt-4'>
          Posted by:{' '}
          <a
            href={`https://github.com/${comment.creator.name}`}
            className='inline-block font-medium'
          >
            {comment.creator.name}
          </a>
        </div>
      </div>
    </div>
  );
};
