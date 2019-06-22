import React, { HTMLProps, useContext } from 'react';
import isEmail from 'is-email';
import { superstruct } from 'superstruct';
import { FieldProps, useField } from 'formik';
import { styled } from 'linaria/react';
import { ExpandAndContractSpinner } from './Spinner';
import { ERROR_RED, SUCCESS_GREEN, atMediaQ } from '../../util/style';
import { MediaQueryContext } from '../../App';

const PASSWORD_NOT_LONG_ENOUGH = 'Password must be at least 5 characters.';
const PASSWORD_TOO_LONG = 'Password must be less than 256 characters.';
const PASSWORDS_MUST_MATCH = 'Passwords must match';
const INVALID_EMAIL = 'Email must be a valid email.';

const struct = superstruct({
  types: {
    email: value => {
      if (!isEmail(value)) return INVALID_EMAIL;
      return true;
    },
    password: value => {
      if (value.length < 5) return PASSWORD_NOT_LONG_ENOUGH;
      if (value.length >= 256) return PASSWORD_TOO_LONG;
      return true;
    }
  }
});

export const loginValidation = struct({
  email: 'email',
  password: 'password'
});

export const registerValidation = struct({
  email: 'email',
  password: 'password',
  passwordConfirm: (value: any, data: any) =>
    value === data.password ? true : PASSWORDS_MUST_MATCH
});

export const changePasswordValidation = struct({
  password: 'password',
  passwordConfirm: (value: any, data: any) =>
    value === data.password ? true : PASSWORDS_MUST_MATCH
});

export const justEmailValidation = struct({
  email: 'email'
});

export const StyledInput = styled.input<{ error: any }>`
  width: 100%;
  border-radius: 2px;
  background-color: #f2f2f2;
  outline: ${({ error }) => (error ? `1px solid ${ERROR_RED}` : 'unset')};
  border: none;
  font-family: inherit;
  font-weight: 300;
  color: #333333;

  ${atMediaQ.small} {
    padding: 8px 12px;
    margin: 8px 0;
    font-size: 14px;
  }
  ${atMediaQ.medium} {
    padding: 12px 20px;
    margin: 8px 0;
    font-size: 16px;
  }
  ${atMediaQ.large} {
    padding: 12px 20px;
    margin: 8px 0;
    font-size: 16px;
  }
`;

export const InputField: React.SFC<FieldProps<any>> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const errored = touched[field.name] && errors[field.name];

  return <StyledInput {...field} {...props} error={errored} />;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const FormBox = styled.div`
  text-align: center;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  background: white;

  ${atMediaQ.small} {
    margin-top: 20px;
    padding: 30px;
    width: 300px;
  }
  ${atMediaQ.medium} {
    margin-top: 35px;
    padding: 50px;
    width: 550px;
  }
  ${atMediaQ.large} {
    margin-top: 35px;
    padding: 50px;
    width: 550px;
  }

  & form {
    text-align: left;
  }

  & button {
    font-family: inherit;
    border-radius: 2px;
    background-color: #535353;
    border: none;
    color: white;
    display: block;
    cursor: pointer;

    ${atMediaQ.small} {
      font-size: 14px;
      width: 110px;
      height: 30px;
      margin: 30px auto;
    }
    ${atMediaQ.medium} {
      font-size: 15px;
      width: 150px;
      height: 45px;
      margin: 30px auto;
    }
    ${atMediaQ.large} {
      font-size: 15px;
      width: 150px;
      height: 45px;
      margin: 30px auto;
    }
  }

  & button:disabled {
    opacity: 0.5;
  }

  & label {
    display: block;

    ${atMediaQ.small} {
      margin: 20px 0px;
      font-size: 16px;
    }
    ${atMediaQ.medium} {
      margin: 40px 0px;
      font-size: 18px;
    }
    ${atMediaQ.large} {
      margin: 40px 0px;
      font-size: 18px;
    }
  }
`;

const Header = styled.span`
  font-weight: 500;

  ${atMediaQ.small} {
    font-size: 22px;
  }
  ${atMediaQ.medium} {
    font-size: 25px;
  }
  ${atMediaQ.large} {
    font-size: 25px;
  }
`;

const ErrorStatus = styled.div`
  font-weight: 500;
  color: ${ERROR_RED};

  ${atMediaQ.small} {
    font-size: 14px;
  }
  ${atMediaQ.medium} {
    font-size: 16px;
  }
  ${atMediaQ.large} {
    font-size: 16px;
  }
`;

const SuccessStatus = styled.div`
  font-weight: 500;
  color: ${SUCCESS_GREEN};

  ${atMediaQ.small} {
    font-size: 14px;
  }
  ${atMediaQ.medium} {
    font-size: 16px;
  }
  ${atMediaQ.large} {
    font-size: 16px;
  }
`;

export const MyTextField: React.FC<HTMLProps<HTMLInputElement>> = ({
  label,
  name,
  ...props
}) => {
  const [field, meta] = useField(name!);
  return (
    <label>
      {label}
      <StyledInput {...field} {...props} error={meta.error && meta.touched} />
    </label>
  );
};

const LoadingOrStatusBox = styled.div`
  ${atMediaQ.small} {
    height: 30px;
  }
  ${atMediaQ.medium} {
    height: 50px;
  }
  ${atMediaQ.large} {
    height: 50px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GenericFormBox: React.FC<{
  header: string;
  status: any;
  children: any;
  loading: boolean;
}> = ({ header, status, children, loading }) => {
  const { isSmall } = useContext(MediaQueryContext);
  return (
    <Container>
      <FormBox>
        <Header>{header}</Header>
        {children}
        <LoadingOrStatusBox>
          {status && status.error && <ErrorStatus>{status.error}</ErrorStatus>}
          {status && status.success && (
            <SuccessStatus>{status.success}</SuccessStatus>
          )}
          {loading && (
            <ExpandAndContractSpinner
              dimension={isSmall ? 25 : 50}
              margin={isSmall ? 5 : 10}
            />
          )}
        </LoadingOrStatusBox>
      </FormBox>
    </Container>
  );
};
