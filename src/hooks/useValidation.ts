import {useState} from 'react';

interface ValidationErrors {
  [field: string]: string;
}

interface Validations {
  [field: string]: RegExp;
}

const ERROR_MESSAGES: {
  empty: ValidationErrors;
  regex: ValidationErrors;
} = {
  empty: {
    amount: 'Amount is required',
    phoneNumber: 'Phone number is required',
    referrerNo: 'Referrer Number number is required',
    operator: 'Operator is required',
    bank: 'Bank is required',
    accountNumber: 'Account number is required',
    referenceNumber: 'Reference No is required',
    accountName: 'Account name is required',
    tenor: 'Tenor is required',
    purpose: 'Purpose is required',
    description: 'Description is required',
    target: 'Select a target',
    startDate: 'Select a start date',
    endDate: 'Select a start date',
    fundingOption: 'Select a funding option',
    plan: 'Select a plan',
    tAndCConsent: 'Accept terms and conditions to continue',
    card: 'Select wallet',
    savingsType: 'Select a savings type',
    biller: 'Select Biller',
    product: 'Choose product',
    bundle: 'Select a bundle',
    smartCardNumber: 'Enter smartcard number',
    email: 'Email address is required',
    first_name: 'First Name is required',
    last_name: 'Last Name is required',
    user_name: 'User Name is required',
    emailOrPhone: 'Enter an email address or a phone number',
    fullName: 'Full name is required',
    fplId: 'Enter a valid FPL Manager ID',
    password: 'Password is required',
  },
  regex: {
    amount: 'Check amount.',
    email: 'Incorrect email format',
    referrerNo: 'Incorrect referrer number format',
    bvn: 'BVN must be 11 digits',
    phoneNumber: 'Check phone number.',
    accountNumber: 'Account number should be 10 digits.',
    emailOrPhone: 'Enter a valid email or phone number',
    fullName: 'Enter a valid full name',
    fplId: 'Enter a valid FPL manager Id',
    first_name:
      'First name must:\n' +
      '- Only contain letters (no spaces or special characters)',
    last_name:
      'First name must:\n' +
      '- Only contain letters (no spaces or special characters)',
    password:
      'Password must:\n' +
      '- Be at least 8 characters long\n' +
      '- Contain at least one uppercase letter\n' +
      '- Contain at least one lowercase letter\n' +
      '- Contain at least one special character (non-alphanumeric)',
  },
};

const VALIDATIONS: Validations = {
  amount: /^\d+(\.\d{2})?$/,
  phoneNumber: /^0(7|8|9)(0|1)\d{8}/,
  referrerNo: /^0(7|8|9)(0|1)\d{8}/,
  accountNumber: /^\d{10}$/,
  bvn: /^\d{11}$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  emailOrPhone:
    /(^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$)|^0(7|8|9)(0|1)\d{8}/,
  fullName: /^[A-Za-z\s]*$/,
  fplId: /^\d{3,10}$/,
  first_name: /^[A-Za-z]+$/,
  last_name: /^[A-Za-z]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
};

export function useValidation() {
  const [inputs, setInputs] = useState<{[field: string]: string}>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: string) => {
    if (!inputs[field]) {
      setErrors({
        ...errors,
        [field]: ERROR_MESSAGES.empty[field],
      });
      return false;
    }

    if (VALIDATIONS[field] && !VALIDATIONS[field].test(inputs[field])) {
      setErrors({
        ...errors,
        [field]: ERROR_MESSAGES.regex[field],
      });
      return false;
    }

    return true;
  };

  const validateAll = () => {
    if (!inputs) {
      return false;
    }

    let isValid = true;
    Object.keys(inputs).forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const resetFieldError = (field: string) => {
    setErrors({
      ...errors,
      [field]: '',
    });
  };

  const updateField = (text: string, field: string) => {
    resetFieldError(field);
    setInputs({
      ...inputs,
      [field]: text,
    });
  };

  const register = (fields: string[]) => {
    const initialInputs: {[field: string]: string} = {};
    const initialErrors: ValidationErrors = {};

    fields.forEach(field => {
      initialInputs[field] = '';
      initialErrors[field] = '';
    });

    setInputs(initialInputs);
    setErrors(initialErrors);
  };

  return [
    inputs,
    errors,
    validateField,
    updateField,
    validateAll,
    register,
  ] as const;
}
