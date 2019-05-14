import React, { createContext, useState } from 'react';
import { gql } from 'apollo-boost';
import styled from '@emotion/styled';
import { useQuery } from 'react-apollo-hooks';
import dayjs from 'dayjs';
import Post from './Post';
import { Post as IPost } from '../../generated/graphql';

const StyledPostFeed = styled.div`
  background-color: white;

  border: 1px #c4c4c4 solid;
  border-radius: 5px;

  grid-column-start: 1;
  grid-column-end: span 16;

  & > :first-of-type {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  & > :last-of-type {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: none;
  }
`;

const GET_POSTS = gql`
  query {
    getPosts {
      id
      created
      creator {
        id
      }
      portman {
        id
        name
      }
      book1 {
        id
        title
        author {
          name
        }
      }
      book2 {
        id
        title
        author {
          name
        }
      }
      usedFragments {
        order
        fragment {
          id
          context
          fragmentText
          book {
            id
          }
        }
      }
      likeCount
    }
  }
`;

// figure out how to make these types better
export const ClosePopup = createContext({
  closePopup: null as any,
  setClosePopup: null as any
});

const PostFeed = () => {
  const dateFormat = 'MMM D';

  const [closePopup, setClosePopup] = useState({
    close: () => console.log('Initial')
  });

  const { data, error, loading } = useQuery(GET_POSTS);
  const posts: IPost[] = data.getPosts;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <span>`Error! ${error.message}`</span>;
  }

  return (
    <StyledPostFeed>
      <ClosePopup.Provider value={{ closePopup, setClosePopup }}>
        {posts.map(post => {
          const fragments = post.usedFragments.map(f => ({
            bookId: f.fragment.book.id,
            fragmentId: f.fragment.id,
            fragmentText: f.fragment.fragmentText,
            context: f.fragment.context,
            order: f.order
          }));
          fragments.sort((a, b) => (a.order > b.order ? 1 : 0));

          const bookInfo = { book1Info: post.book1, book2Info: post.book2 };
          const date = dayjs(post.created).format(dateFormat);

          const initial1 = post.book1.author.name.split(' ').pop()![0];
          const initial2 = post.book2.author.name.split(' ').pop()![0];

          return (
            <Post
              date={date}
              initial1={initial1}
              initial2={initial2}
              portman={post.portman.name}
              fragments={fragments}
              likeCount={post.likeCount}
              bookInfo={bookInfo}
              key={post.id}
            />
          );
        })}
      </ClosePopup.Provider>
    </StyledPostFeed>
  );
};

export default PostFeed;
