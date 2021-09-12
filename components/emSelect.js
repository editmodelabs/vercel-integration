import Select from "./select";
import { useState } from "react";

export default function EditmodeSelect({
  options,
  fieldIndex,
  setConnections,
  connections,
  setPointer,
  project,
  fieldId,
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
        project={project}
        fieldId={fieldId}
      />
    </>
  );
}
