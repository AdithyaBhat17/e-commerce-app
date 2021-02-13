import { useEffect, useState } from "react";

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  useEffect(() => {
    setInputs({ ...initial });
  }, [Object.values(initial).join(",")]);

  function handleInputChange(event) {
    let { name, type, value } = event.target;
    if (type === "number") value = parseInt(value, 10);
    if (type === "file") value = event.target.files[0];

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.entries(inputs).map(([key]) => [key, ""]);
    setInputs(Object.fromEntries(blankState));
  }

  return {
    inputs,
    handleInputChange,
    resetForm,
    clearForm,
  };
}
