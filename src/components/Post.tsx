import React, { useState, useContext } from 'react';
import { styled } from 'linaria/react';
import { useApolloClient } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import HeartOpenBook from '../assets/svg/HeartOpenBook';
import { ClosePopup } from './PostFeed';
import { useLikePostMutation, useMeQuery } from '../generated/graphql';
import {
  POSTS_FEED_LIMIT,
  HIGHLIGHT_COLOR_1,
  HIGHLIGHT_COLOR_2
} from '../util/constants';

// ought to do this once. check efficiency
const splitStringIntoThree = (text: string, search: string) => {
  const i = text.indexOf(search);

  if (i === -1) {
    console.log(text, search);
    throw Error('Fragment not contained in context');
  }

  const pre = text.slice(0, i);
  const middle = text.slice(i, i + search.length);
  const post = text.slice(i + search.length, text.length);

  return { pre, middle, post };
};

const whichBookToColor = (whichBook: boolean) =>
  whichBook ? HIGHLIGHT_COLOR_1 : HIGHLIGHT_COLOR_2;

const PostContainer = styled.div`
  position: relative;
  display: flex;
  min-height: 175px;
  border-bottom: 1px #c4c4c4 solid;
  background-color: white;
  flex-direction: row;
  align-items: center;
`;

const AuthorHeader = styled.div`
  font-family: 'Spectral';
  font-weight: light;
  font-size: 13px;
`;

const Dot = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 13px;
`;

const FragmentContainer = styled.div`
  padding-top: 5px;
  width: 550px;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 60%;
  padding: 40px 0px;
  flex-direction: column;
  justify-content: space-evenly;
`;

const FragmentText = styled.span<{ whichBook: boolean }>`
  position: relative;
  font-family: 'Spectral';
  font-weight: normal;
  font-size: 16px;
  color: #161616;
  overflow-wrap: normal;
  &:hover {
    background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
  }
`;

const Context = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};

  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 55px;
  left: 80px;
  top: -100px;
  width: 500px;
  background: white;
  filter: drop-shadow(9px 6px 20px rgba(0, 0, 0, 0.2));
  z-index: 2;

  font-family: 'Spectral';
  font-size: 14px;
  color: #161616;
  line-height: 1.5;
  text-align: justify;

  &:before {
    font-size: 65px;
    content: '“';
    position: absolute;
    left: 20px;
    top: 20px;
    color: #5d5d5d;
  }
`;

const HighlightedOccurrence = styled.span<{ whichBook: boolean }>`
  background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
`;

export const LikeContainer = styled.div<{ liked: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 45px;
  height: 40px;
  margin: 10px;
  position: absolute;
  bottom: 0;
  right: 5px;
  cursor: pointer;
  fill: ${({ liked }) => (liked ? 'red' : 'black')};

  &:hover svg {
    fill: red;
  }
`;

const LikeCount = styled.span`
  font-size: 13px;
  font-family: 'Spectral';
  font-weight: light;
`;

const Circle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px solid #b5b5b5;
  flex-shrink: 0;
  margin: 0 30px;
  position: relative;
`;

const Letter1 = styled.span`
  font-size: 43px;
  font-family: 'Spectral';
  color: #676767;
  position: absolute;
  top: 13%;
  left: 28%;
`;

const Letter2 = styled.span`
  font-size: 39px;
  font-family: 'Spectral';
  color: #676767;
  position: absolute;
  top: 35%;
  left: 47%;
`;

const QuoteBlock = styled.div``;
const ByAuthorBook = styled.div`
  position: absolute;
  bottom: 25px;
  right: 50px;
  font-size: 15px;
  text-align: right;
  line-height: 1.3;
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 400px;
`;
const Author = styled.span`
  position: relative;
  &:before {
    content: '‒';
    font-size: 60px;
    color: #5d5d5d;
    position: absolute;
    top: -30px;
    left: -40px;
  }
  font-family: 'Spectral';
  font-weight: light;
`;
const Book = styled.div`
  font-family: 'Spectral';
  font-weight: light;
  font-style: italic;
  word-wrap: break-word;
`;

const InitialCircle = ({ initial1, initial2 }: any) => {
  return (
    <Circle>
      <Letter1>{initial1}</Letter1>
      <Letter2>{initial2}</Letter2>
    </Circle>
  );
};

const ExitBox = styled.div`
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
  font-size: 40px;
  color: #5d5d5d;
  line-height: 0.5;
`;

const Frag = styled.span`
  cursor: pointer;
`;

const Fragment = ({
  fragmentText,
  info,
  context,
  whichBook
}: {
  fragmentText: string;
  context: string;
  info: any;
  whichBook: boolean;
}) => {
  const { pre, middle, post } = splitStringIntoThree(context, fragmentText);
  const { closePopup, setClosePopup } = useContext(ClosePopup);
  const [visible, setVisible] = useState(false);

  const displayPopup = () => {
    closePopup.close();
    setClosePopup({ close: () => setVisible(false) });
    setVisible(true);
  };

  return (
    <FragmentText whichBook={whichBook}>
      <Frag onClick={displayPopup}>{fragmentText} </Frag>
      <Context visible={visible}>
        <ExitBox onClick={() => setVisible(false)}>&#xd7;</ExitBox>
        <QuoteBlock>
          {pre}
          <HighlightedOccurrence whichBook={whichBook}>
            {middle}
          </HighlightedOccurrence>
          {post}
        </QuoteBlock>
        <ByAuthorBook>
          <Author>{info.author.name}</Author>
          <Book>{info.title}</Book>
        </ByAuthorBook>
      </Context>
    </FragmentText>
  );
};

interface Props {
  bookInfo: any;
  fragments: any[];
  initial1: string;
  initial2: string;
  likeCount: number;
  portman: string;
  date: string;
  currentUserLiked: boolean;
  currentUserOwns: boolean;
  postId: string;
}

const Post: React.FC<Props> = ({
  bookInfo,
  fragments,
  initial1,
  initial2,
  likeCount,
  portman,
  currentUserLiked,
  currentUserOwns,
  date,
  postId
}) => {
  const dot = '·';
  const cacheId = `Post:${postId}`; // default naming

  const { data, error, loading } = useMeQuery();
  const client = useApolloClient();

  const loggedOut = !(data && data.me);
  const likePost = useLikePostMutation();

  const clickLike = async () => {
    if (!loggedOut && !currentUserOwns) {
      await likePost({
        variables: {
          data: {
            postId: parseInt(postId),
            like: !currentUserLiked
          }
        }
      });
      client.writeFragment({
        id: cacheId,
        fragment: gql`
          fragment LikeUpdateFragment on GetPostsWithCursor {
            currentUserLiked
            likeCount
          }
        `,
        data: {
          currentUserLiked: !currentUserLiked,
          likeCount: likeCount + (currentUserLiked ? -1 : 1),
          __typename: 'GetPostsWithCursor'
        }
        // variables: {
        //   cursor: null,
        //   limit: POSTS_FEED_LIMIT
        // }
      });
    } else {
      console.log('Cannot like post', loggedOut, currentUserOwns);
    }
  };
  return (
    <PostContainer>
      <InitialCircle initial1={initial1} initial2={initial2} />
      <ContentContainer>
        <AuthorHeader>
          <span>{portman} </span>
          <Dot>{dot} </Dot>
          <span>{date} </span>
        </AuthorHeader>
        <FragmentContainer>
          {fragments.map(el => {
            const whichBook = el.bookId === bookInfo.book1Info.id;
            return (
              <Fragment
                info={whichBook ? bookInfo.book1Info : bookInfo.book2Info}
                whichBook={whichBook}
                fragmentText={el.fragmentText}
                key={el.fragmentId}
                context={el.context}
              />
            );
          })}
        </FragmentContainer>
      </ContentContainer>
      <LikeContainer onClick={clickLike} liked={currentUserLiked}>
        <HeartOpenBook size="25px" />
        <LikeCount>{likeCount}</LikeCount>
      </LikeContainer>
    </PostContainer>
  );
};

export default Post;
