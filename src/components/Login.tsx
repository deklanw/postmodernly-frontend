import React from 'react';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { withFormik, FormikProps, Field, Form } from 'formik';
import { InputField, GenericFormBox, loginValidation } from './shared/input';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
}

interface Props {
  loginUser: any;
  history: any;
}

const loginUser = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;

const Register = ({
  isSubmitting,
  isValid
}: FormikProps<FormValues> & Props) => {
  return (
    <GenericFormBox header="Login">
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
  graphql(loginUser, { name: 'loginUser' }),
  withFormik<Props, FormValues>({
    validationSchema: loginValidation,
    mapPropsToValues: () => ({ email: '', password: '' }),
    handleSubmit: async (values, { props, setErrors, setSubmitting }) => {
      const { email, password } = values;
      try {
        const response = await props.loginUser({
          variables: { email, password }
        });

        if (response.data.login) {
          // redirect to homepage
          props.history.push('/');
        } else {
          // indicate some kind of error
        }
      } catch (errors) {
        setErrors(errors);
      } finally {
        setSubmitting(false);
      }
    }
  })
)(Register);
