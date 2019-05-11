import React from 'react';
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

  /* overflow: hidden; */
`;

const GET_POSTS = gql`
  query {
    getPosts {
      created
      creator {
        id
      }
      portman {
        id
        portman
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
          context
          fragment
          book {
            id
          }
        }
      }
      likeCount
    }
  }
`;

const PostFeed = () => {
  const dateFormat = 'MMM D';

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
      {posts.map(el => {
        const fragments = el.usedFragments.map(f => ({
          bookId: f.fragment.book.id,
          fragmentId: f.fragment.id,
          fragment: f.fragment.fragment,
          context: f.fragment.context,
          order: f.order
        }));
        fragments.sort((a, b) => (a.order > b.order ? 1 : 0));

        const bookInfo = { book1Info: el.book1, book2Info: el.book2 };
        const date = dayjs(el.created).format(dateFormat);

        const initial1 = el.book1.author.name.split(' ').pop()![0];
        const initial2 = el.book2.author.name.split(' ').pop()![0];

        return (
          <Post
            date={date}
            initial1={initial1}
            initial2={initial2}
            portman={el.portman.portman}
            fragments={fragments}
            likeCount={el.likeCount}
            bookInfo={bookInfo}
            key={el.id}
          />
        );
      })}
    </StyledPostFeed>
  );
};

export default PostFeed;
