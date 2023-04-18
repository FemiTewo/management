import {useState} from 'react';

export const _ERRORMESSAGES_ = {
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
    emailOrPhone: 'Enter an email address or a phone number',
    fullName: 'Full name is required',
    fplId: 'Enter a valid FPL Manager ID',
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
  },
};

export const _VALIDATIONS_ = {
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
};

export function useValidation() {
  const [inputs, setInputs] = useState();
  const [errors, setErrors] = useState();
  const validationFn = (field: string) => {
    if (inputs === undefined || errors === undefined) {
      return;
    }
    if ((!inputs[field] || inputs[field] === null) && inputs?.[field] !== 0) {
      setErrors({...errors, [field]: _ERRORMESSAGES_.empty[field]});
      return false;
    }
    if (
      _ERRORMESSAGES_.regex[field] &&
      !_VALIDATIONS_[field]?.test(inputs[field])
    ) {
      setErrors({...errors, [field]: _ERRORMESSAGES_.regex[field]});
      return false;
    }
    return true;
  };
  const validateAll = () => {
    if (!inputs) {
      return false;
    }
    let boolVal = false;
    Object.keys(inputs).map(k => {
      boolVal = !!validationFn(k);
    });
    return boolVal;
  };

  const resetFieldError = (field: any) => {
    setErrors({...errors, [field]: ''});
  };

  const updateField = (text: any, field: any) => {
    resetFieldError(field);
    setInputs({...inputs, [field]: text});
  };
  return [
    inputs,
    errors,
    (field: any) => validationFn(field),
    (text: any, field: any) => updateField(text, field),
    validateAll,
  ];
}
