import { useEffect } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { RouteComponentProps } from 'react-router-dom';

import { useLogoutMutation } from '../generated/graphql';

const Logout: React.FC<RouteComponentProps> = ({ history }) => {
  const logout = useLogoutMutation();
  const client = useApolloClient();

  const logoutSequence = async () => {
    await logout();
    await client.resetStore();
    history.push('/');
  };

  useEffect(() => {
    logoutSequence();
  });

  return null;
};

export default Logout;
