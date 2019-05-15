import React from 'react';
import { withFormik, FormikProps, Field, Form } from 'formik';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

import { InputField, GenericFormBox, registerValidation } from './shared/input';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface Props {
  registerUser: any;
  history: any;
}

const registerUser = gql`
  mutation($data: RegisterInput!) {
    register(data: $data) {
      id
      email
      created
    }
  }
`;

const Register = ({
  isSubmitting,
  isValid
}: FormikProps<FormValues> & Props) => {
  return (
    <GenericFormBox header="Sign-up">
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
        <label>
          Confirm password
          <Field
            type="password"
            name="passwordConfirm"
            component={InputField}
            placeholder="Your password again"
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
  graphql(registerUser, { name: 'registerUser' }),
  withFormik<Props, FormValues>({
    validationSchema: registerValidation,
    mapPropsToValues: () => ({ email: '', password: '', passwordConfirm: '' }),
    handleSubmit: async (values, { props, setErrors, setSubmitting }) => {
      const { email, password, passwordConfirm } = values;

      try {
        const response = await props.registerUser({
          variables: { data: { email, password } }
        });

        if (response.data.register) {
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
