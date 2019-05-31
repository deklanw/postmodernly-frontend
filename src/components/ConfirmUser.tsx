import React, { useEffect, useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { RouteComponentProps } from 'react-router-dom';
import { styled } from 'linaria/react';

import { useConfirmUserMutation } from '../generated/graphql';
import { ExpandAndContractSpinner } from './shared/Spinner';

type Params = {
  token: string;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  font-family: 'Spectral';
  font-size: 24px;
  padding: 30px;
`;

const ConfirmUser: React.FC<RouteComponentProps<Params>> = ({
  history,
  match
}) => {
  const client = useApolloClient();
  const confirm = useConfirmUserMutation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean>(false);

  const confirmUser = async () => {
    const result = await confirm({ variables: { token: match.params.token } });
    const good = result.data!.confirmUser;
    setLoading(false);
    setSuccess(good);
    if (good) {
      setTimeout(() => history.push('/login'), 2000);
    } else {
      setTimeout(() => history.push('/'), 5000);
    }
  };

  useEffect(() => {
    confirmUser();
  }, []);

  let content;

  if (loading) {
    content = <ExpandAndContractSpinner dimension={100} margin={30} />;
  } else if (success === true) {
    content = (
      <span>
        <span role="img" aria-label="Checkmark">
          ✅
        </span>
        User confirmed. Redirecting to login...
      </span>
    );
  } else {
    content = (
      <span>
        <span role="img" aria-label="Red X">
          ❌
        </span>
        Invalid token. Redirecting to homepage...
      </span>
    );
  }

  return <Container>{content}</Container>;
};

export default ConfirmUser;
