import { useState, useCallback } from "react";

export function useFormAndValidation() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: e.target.validationMessage });
    setIsValid(e.target.closest("form").checkValidity());
  };

  const resetForm = useCallback(
    (newinsetInputs = {}, newErrors = {}, newIsValid = false) => {
      setInputs(newinsetInputs);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setInputs, setErrors, setIsValid]
  );

  return {
    inputs,
    handleChange,
    errors,
    isValid,
    resetForm,
    setInputs,
    setIsValid,
  };
}
