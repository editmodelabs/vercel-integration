import { useState } from "react";
import Select from "./select";

export default function VercelSelect({
  options,
  fieldIndex,
  connections,
  setConnections,
}) {
  const [selected, setSelected] = useState(options[fieldIndex]);

  return (
    <>
      <Select
        selected={selected}
        setSelected={setSelected}
        fieldIndex={fieldIndex}
        options={options}
        setConnections={setConnections}
        connections={connections}
      />
    </>
  );
}
