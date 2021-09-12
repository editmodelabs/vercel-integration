import { useState } from "react";
import Select from "./select";

export default function VercelSelect({ options, fieldIndex }) {
  const [selected, setSelected] = useState(options[fieldIndex]);

  return (
    <>
      <Select
        selected={selected}
        setSelected={setSelected}
        fieldIndex={fieldIndex}
        options={options}
      />
    </>
  );
}
