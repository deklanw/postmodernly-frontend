import React from 'react';
import { withFormik, FormikProps, Field, Form } from 'formik';
import { compose, graphql, MutationFn } from 'react-apollo';

import { InputField, GenericFormBox, registerValidation } from './shared/input';
import { REGISTER_USER } from '../graphql/graphql';
import {
  RegisterMutationVariables,
  RegisterMutation
} from '../generated/graphql';
import { SERVER_DOWN, SOMETHING_WENT_WRONG } from '../util/constants';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface Props {
  registerUser: MutationFn<RegisterMutation, RegisterMutationVariables>;
  history: any;
}

const Register = ({
  isSubmitting,
  isValid,
  status
}: FormikProps<FormValues> & Props) => {
  return (
    <GenericFormBox header="Sign-up" status={status}>
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
  graphql(REGISTER_USER, { name: 'registerUser' }),
  withFormik<Props, FormValues>({
    validationSchema: registerValidation,
    mapPropsToValues: () => ({ email: '', password: '', passwordConfirm: '' }),
    handleSubmit: async (
      values,
      { props, setErrors, setStatus, setSubmitting }
    ) => {
      const { email, password, passwordConfirm } = values;

      try {
        const response = await props.registerUser({
          variables: { data: { email, password } }
        });

        if (response && response.data) {
          props.history.push('/');
        } else {
          setStatus({ error: SOMETHING_WENT_WRONG });
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
)(Register);
