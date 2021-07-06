import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import TagsInput from 'react-tagsinput';
import { useCreateQuestionMutation } from '../generated/graphql';
import { DEFAULT_AVATARS_BUCKET } from '../lib/constants';
import { createUrqlClient } from '../utils/createUrqlClient';
import { supabase } from '../utils/supabaseClient';
import { useIsAuth } from '../utils/useIsAuth';
import UploadComponent from './UploadComponent';
import MarkDown from './MDEditor';

const CreateQuestion = () => {
  useIsAuth();
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const suggestions = [{ name: 'react' }, { name: 'react-native' }];
  const [title, setTitle] = useState<string>('');
  const [question, setQuestion] = useState<{ text: string; html: string }>({
    text: '',
    html: '',
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, createQuestion] = useCreateQuestionMutation();

  const onSubmitClick = async () => {
    setSubmitting(true);

    const uploadedImagePaths = await uploadImages();
    const { error } = await createQuestion({
      ...question,
      title,
      imageUrls: uploadedImagePaths,
      tags,
    });

    if (!error) {
      setSubmitting(false);
      router.push('/');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    console.log('files from createQuestion: ', files);
  }, [files]);

  const uploadImages = async () => {
    if (files.length === 0) {
      return [];
    }
    const UploadedImageData = await Promise.all(
      files.map(async (file) => {
        const { data, error } = await supabase.storage
          .from(DEFAULT_AVATARS_BUCKET)
          .upload(file.name, file);
        if (error) {
          console.log('error in uploading image: ', error);
          throw error;
        }
        if (data) {
          console.log('image uploaded successfully: ', data);
          console.log('Logging image_path: ', data.Key.substring(8));
          return data.Key.substring(8);
        }
      })
    );

    console.log('UploadedImageData: ', UploadedImageData);
    return UploadedImageData;
  };

  const onChange = (tag) => {
    setTags(tag);
  };

  function autosuggestRenderInput({ addTag, ...props }) {
    const handleOnChange = (e, { newValue, method }) => {
      if (method === 'enter') {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    const inputValue = (props.value && props.value.trim().toLowerCase()) || '';
    const inputLength = inputValue.length;

    let suggestion = suggestions.filter((state) => {
      return state.name.toLowerCase().slice(0, inputLength) === inputValue;
    });

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestion}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
        inputProps={{ ...props, onChange: handleOnChange }}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion.name);
        }}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    );
  }

  useEffect(() => {
    console.log('question from createQuestion: ', question);
  }, [question]);

  return (
    <div>
      <div className='h-screen'>
        <div className='w-full'>
          <input
            className='w-full bg-gray-400 rounded-md outline-none text-black p-2'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder='Add title'
          />
        </div>

        <div className='w-full mt-4 mb-4 m-auto '>
          <div className='w-full h-64 overflow-y-auto'>
            <MarkDown value={question} setValue={setQuestion} />
          </div>
        </div>
        <TagsInput
          className='mt-10 rounded-md w-full bg-iconGrey'
          renderInput={autosuggestRenderInput}
          value={tags}
          onChange={(e) => onChange(e)}
          maxTags={3}
          tagProps={{
            className:
              'bg-activityBlue pl-2 text-black placeholder-black react-tagsinput-tag text-lg font-medium rounded-md ml-2',
            classNameRemove: 'react-tagsinput-remove',
          }}
        />

        <button
          onClick={onSubmitClick}
          className={`mt-6 bg-submitButton border-none outline-none py-2 px-3 ${
            submitting ? 'cursor-not-allowed' : 'cursor-pointer'
          } rounded-md outline-none text-lg font-bold text-white`}
        >
          {submitting ? (
            <div>
              <i className='fa fa-spinner fa-spin -ml-3 mr-2'></i>Creating ...
            </div>
          ) : (
            <div>Create Question</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default withUrqlClient(createUrqlClient)(CreateQuestion);
