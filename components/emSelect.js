import Select from "./select";
import { useState } from "react";

export default function EditmodeSelect({
  options,
  fieldIndex,
  setConnections,
  connections,
}) {
  const [selected, setSelected] = useState(options[0]);

  return (
    <>
      <Select
        selected={selected}
        setSelected={setSelected}
        fieldIndex={fieldIndex}
        options={options}
        isEditmode={true}
        setConnections={setConnections}
        connections={connections}
      />
    </>
  );
}
