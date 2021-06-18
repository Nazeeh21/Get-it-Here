import { useRouter } from "next/router";
import React from "react";
import { useVoteMutation } from "../generated/graphql";
import { Tag } from "./Tags";

interface QuestionProps {
  question: any;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  const router = useRouter();
  const [, vote] = useVoteMutation();

  const upVoteClicked = async () => {
    await vote({
      questionId: question.id,
      value: 1,
    });
  };

  const downVoteClicked = async () => {
    await vote({
      questionId: question.id,
      value: -1,
    });
  };

  return (
    <div className="flex">
      <img
        className="w-10 h-10 rounded-full mr-2 cursor-pointer"
        onClick={() =>
          router.push(`https://github.com/${question.creator.name}`)
        }
        src={question.creator.avatarUrl}
        alt={question.creator.name}
      />
      <div className="w-full rounded-md bg-activityBlue relative text-white rounded-tl-none p-2 mb-4 pl-3">
        <div className="flex justify-space items-center mb-4">
          {router.pathname === "/" ? (
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/questions/${question.id}`)}
            >
              {question.description.slice(0, 100)}{" "}
              {question.description.length > 100 && <span>. . .</span>}
            </div>
          ) : (
            <div>{question.description}</div>
          )}
          <div className="absolute right-0 bottom-0 flex justify-center items-center p-2">
            <img
              className="mr-2 cursor-pointer"
              onClick={upVoteClicked}
              src={
                question.voteStatus && question.voteStatus === 1
                  ? "/upvote.svg"
                  : "/upvoteEmpty.svg"
              }
              alt="upvote"
            />
            <div className="text-white text-lg mr-2">{question.points}</div>
            <img
              className="mr-2 cursor-pointer"
              onClick={downVoteClicked}
              src={
                question.voteStatus && question.voteStatus === -1
                  ? "/downvote.svg"
                  : "/downvoteEmpty.svg"
              }
              alt="downvote"
            />
            {/* <img className="ml-2" src="downvoteEmpty.svg" alt="downvote" /> */}
          </div>
          <div className="absolute right-0 top-0 p-3">
            {/* <Icon icon={bookmarkIcon} height={25} /> */}
            <img className="h-6 cursor-pointer" src={question.bookmarkStatus ? '/bookmarkSelected.svg' :"/bookmark.svg"} alt="bookmark" />
          </div>
        </div>
        {question?.tags &&
          question?.tags.map((tag, index) => <Tag key={index} tag={tag} />)}
        <div className="mt-2">
          Posted by:{" "}
          <a
            href={`https://github.com/${question.creator.name}`}
            className="inline-block font-medium"
          >
            {question.creator.name}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Question;
