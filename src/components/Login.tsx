import React from 'react';
import { graphql, compose, MutationFn } from 'react-apollo';
import { withFormik, FormikProps, Field, Form } from 'formik';
import { InputField, GenericFormBox, loginValidation } from './shared/input';
import { LOGIN, ME_QUERY } from '../graphql/graphql';
import {
  LoginUserMutation,
  LoginUserMutationVariables
} from '../generated/graphql';
import { SERVER_DOWN } from '../util/constants';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
}

interface Props {
  loginUser: MutationFn<LoginUserMutation, LoginUserMutationVariables>;
  history: any;
}

const Login = ({
  isSubmitting,
  isValid,
  status
}: FormikProps<FormValues> & Props) => {
  return (
    <GenericFormBox header="Login" status={status}>
      <Form>
        <label>
          Email
          <Field
            type="text"
            name="email"
            component={InputField}
            placeholder="Your email"
          />
        </label>
        <label>
          Password
          <Field
            type="password"
            name="password"
            component={InputField}
            placeholder="Your password"
          />
        </label>
        <button type="submit" disabled={isSubmitting || !isValid}>
          Submit
        </button>
      </Form>
    </GenericFormBox>
  );
};

export default compose(
  graphql(LOGIN, { name: 'loginUser' }),
  withFormik<Props, FormValues>({
    validationSchema: loginValidation,
    mapPropsToValues: () => ({ email: '', password: '' }),
    handleSubmit: async (
      values,
      { props, setErrors, setSubmitting, setStatus }
    ) => {
      const { email, password } = values;
      try {
        const response = await props.loginUser({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data || !data.login) {
              return;
            }

            // update Me query, triggering rerender in Header .
            store.writeQuery({
              query: ME_QUERY,
              data: {
                me: {
                  __typename: data.login.__typename,
                  id: data.login.id,
                  email: data.login.email
                }
              }
            });
          }
        });

        if (response && response.data && response.data.login) {
          props.history.push('/');
        }
        if (response && response.data && !response.data.login) {
          setStatus({
            error: 'Credentials incorrect. Check your email and password.'
          });
        }
      } catch (errors) {
        setStatus({
          error: SERVER_DOWN
        });
      } finally {
        setSubmitting(false);
      }
    }
  })
)(Login);
