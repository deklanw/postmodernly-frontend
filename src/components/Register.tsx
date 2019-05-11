import React from 'react';
import { withFormik, FormikErrors, FormikProps, Field, Form } from 'formik';
import { graphql, compose } from 'react-apollo';
import { InputField, GenericFormBox, registerValidation } from './shared/input';

interface FormValues {
  [key: string]: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface Props {}

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
  withFormik<Props, FormValues>({
    validationSchema: registerValidation,
    mapPropsToValues: () => ({ email: '', password: '', passwordConfirm: '' }),
    handleSubmit: (values, { props, setErrors, setSubmitting }) => {
      console.log(values);
      console.log('Hit submit');
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 1000);
    }
  })
)(Register);
