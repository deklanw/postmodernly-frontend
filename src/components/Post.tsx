import React, { useState } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import HeartOpenBook from '../svg/HeartOpenBook';

const highlightColor1 = '#ffcbc8';
const highlightColor2 = '#d3ffa8';

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

const PostContainer = styled.div`
  position: relative;
  display: flex;
  height: 175px;
  padding: 10px;
  border-bottom: 1px #c4c4c4 solid;
  background-color: white;
  flex-direction: row;
  align-items: center;
`;

const AuthorHeader = styled.div`
  font-family: 'Domaine Text Light';
  font-size: 13px;
`;

const Dot = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 13px;
`;

const FragmentContainer = styled.div`
  width: 550px;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 60%;
  margin-top: -10px;
  flex-direction: column;
  justify-content: space-evenly;
`;

const FragmentText = styled.span`
  position: relative;
  font-family: 'Domaine Text Regular';
  font-size: 15px;
  color: #161616;
  overflow-wrap: normal;
  &:hover {
    background-color: ${(props: any) =>
      props.whichBook ? highlightColor1 : highlightColor2};
  }
`;

const Context = styled.div`
  display: ${(props: any) => (props.visible ? 'block' : 'none')};

  position: absolute;
  left: 80px;
  top: -100px;
  padding: 50px;
  width: 450px;
  background: white;
  filter: drop-shadow(9px 6px 20px rgba(0, 0, 0, 0.2));
  z-index: 2;

  font-family: 'Domaine Text Regular';
  font-size: 13px;
  color: #161616;
  line-height: 1.5;
  text-align: justify;

  &:before {
    font-size: 60px;
    content: '“ ';
    position: absolute;
    left: 20px;
    top: 10px;
    color: #5d5d5d;
  }
`;

const HighlightedOccurrence = styled.span`
  background-color: ${(props: any) =>
    props.whichBook ? highlightColor1 : highlightColor2};
`;

export const LikeContainer = styled.div`
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

  &:hover svg {
    fill: red;
  }
`;

const LikeCount = styled.span`
  font-size: 13px;
  font-family: 'Domaine Text Light';
`;

const Circle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px solid #b5b5b5;
  flex-shrink: 0;
  margin-left: 10px;
  margin-right: 35px;
  position: relative;
`;

const Letter1 = styled.span`
  font-size: 43px;
  font-family: 'Domaine Text Regular';
  color: #676767;
  position: absolute;
  top: 15%;
  left: 25%;
`;

const Letter2 = styled.span`
  font-size: 39px;
  font-family: 'Domaine Text Regular';
  color: #676767;
  position: absolute;
  top: 35%;
  left: 47%;
`;

const QuoteBlock = styled.div``;
const ByAuthorBook = styled.div`
  font-size: 15px;
  text-align: right;
  line-height: 1.3;
  margin-top: 20px;
`;
const Author = styled.span`
  position: relative;
  &:before {
    content: '‒';
    font-size: 60px;
    color: #5d5d5d;
    position: absolute;
    left: -50px;
    top: -38px;
  }
  font-family: 'Domaine Text Light';
`;
const Book = styled.span`
  font-family: 'Domaine Text Light Italic';
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
  fragment,
  info,
  context,
  whichBook
}: {
  fragment: string;
  context: string;
  info: any;
  whichBook: boolean;
}) => {
  const { pre, middle, post } = splitStringIntoThree(context, fragment);
  const [visible, setVisible] = useState(false);
  return (
    <FragmentText whichBook={whichBook}>
      <Frag onClick={() => setVisible(true)}>{fragment} </Frag>
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
          <br /> <Book>{info.title}</Book>
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
}

const Post = ({
  bookInfo,
  fragments,
  initial1,
  initial2,
  likeCount,
  portman,
  date
}: Props) => {
  const dot = '·';

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
                fragment={el.fragment}
                key={el.fragmentId}
                context={el.context}
              />
            );
          })}
        </FragmentContainer>
      </ContentContainer>
      <LikeContainer>
        <HeartOpenBook size="25px" />
        <LikeCount>{likeCount}</LikeCount>
      </LikeContainer>
    </PostContainer>
  );
};

export default Post;
