"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

type Props = {
  changeOption: (value?: string) => void;
  createAccountOption?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const Select = ({
  changeOption,
  createAccountOption,
  options = [],
  value,
  disabled,
  placeholder,
}: Props) => {
  const selectOption = (
    option: SingleValue<{ label: string; value: string }>,
  ) => {
    changeOption(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreateableSelect
      className="h-10 text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": { borderColor: "#e2e8f0" },
        }),
      }}
      value={formattedValue}
      isDisabled={disabled}
      options={options}
      placeholder={placeholder}
      onCreateOption={createAccountOption}
      onChange={selectOption}
    />
  );
};
