import { Label, TextInput } from "flowbite-react";
import PropTypes from "prop-types";

export default function InputText({
  type,
  name,
  value,
  onChange,
  required,
  label,
  placeholder,
}) {
  return (
    <div>
      <Label className="block text-sm font-medium">
        {label}
        <span className="text-red-500">{required ? "*" : ""}</span>
      </Label>
      <TextInput
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

InputText.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
