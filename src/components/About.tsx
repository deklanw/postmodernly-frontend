import React from 'react';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import { atMediaQ } from '../util/style';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const TextContainer = styled.div`
  ${atMediaQ.small} {
    width: 85%;
  }
  ${atMediaQ.medium} {
    width: 70%;
  }
  ${atMediaQ.large} {
    width: 800px;
  }
`;

const CenteredH = styled.h1`
  text-align: center;
  margin: 15px 0;

  ${atMediaQ.small} {
    font-size: 18px;
  }
  ${atMediaQ.medium} {
    font-size: 24px;
  }
  ${atMediaQ.large} {
    font-size: 24px;
  }
`;

const SpacedSection = styled.section`
  ${atMediaQ.small} {
    font-size: 14px;
    margin-bottom: 30px;
  }
  ${atMediaQ.medium} {
    font-size: 18px;
    margin-bottom: 50px;
  }
  ${atMediaQ.large} {
    font-size: 18px;
    margin-bottom: 50px;
  }
`;

const StyledBlockquote = styled.blockquote`
  border-left: 10px solid #ccc;
  padding: 7px;
  background: white;
`;

const About = () => {
  return (
    <Container>
      <TextContainer>
        <SpacedSection>
          <CenteredH>How to use</CenteredH>
          <p>
            Postmodernly lets you make posts using the words of the greats.
            Click on some of the Fragments to the right of the Post feed to
            start making your post. Click Submit to post! No account is needed.
          </p>
          <p>
            If you don't like the options for your post, just click Refresh.
            Don't spam it, though! You only get 5 refreshes every 5 minutes. If
            you make an account, you'll get 10 refreshes every 5 minutes and the
            ability to like (others') posts.
          </p>
          <p>
            In the Post feed, click on the words of the post to see their
            original context.
          </p>
        </SpacedSection>
        <SpacedSection>
          <CenteredH>What's a cut-up?</CenteredH>
          <p>
            Cut-ups are an experimental art technique where you put phrases
            together from random places to make something somewhat coherent.
            Kinda like fancy Mad Libs. Postmodernly is a digital version. All
            Fragments come from the most popular or 'best' works on Project
            Gutenberg.
          </p>
          <p>The Wiki article on cut-ups gives a good brief summary:</p>
          <StyledBlockquote cite="https://en.wikipedia.org/wiki/Cut-up_technique">
            The cut-up technique (or découpé in French) is an aleatory literary
            technique in which a written text is cut up and rearranged to create
            a new text. The concept can be traced to at least the Dadaists of
            the 1920s, but was popularized in the late 1950s and early 1960s by
            writer William S. Burroughs, and has since been used in a wide
            variety of contexts.
          </StyledBlockquote>
          <p>From a BBC article on cut-ups,</p>
          <StyledBlockquote cite="https://www.bbc.com/news/magazine-33254672">
            In 1920, Tristan Tzara, one of the Dadaist movement's founders,
            published a short poem that advised the reader to cut out the words
            from a newspaper article and pull them at random from a bag - the
            result would make you "a writer of infinite originality and charming
            sensibility".
          </StyledBlockquote>
        </SpacedSection>
        <SpacedSection>
          <CenteredH>Credits</CenteredH>
          <p>
            Book Lover illustration by Katerina Limpitsouni of{' '}
            <a href="https://undraw.co/">Undraw.co</a>. back by Jardson Almeida
            from the Noun Project. Heart by Alfa Design from the Noun Project
          </p>
        </SpacedSection>
      </TextContainer>
    </Container>
  );
};

export default hot(About);
