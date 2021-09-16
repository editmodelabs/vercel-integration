import Select from "./select";
import { useState } from "react";

export default function EditmodeSelect({
  options,
  project,
  fieldId,
  fields,
  setFields,
  field,
  count,
  isConfiguration,
}) {
  return (
    <>
      <Select
        options={options}
        isEditmode={true}
        project={project}
        fieldId={fieldId}
        fields={fields}
        setFields={setFields}
        field={field}
        count={count}
        isConfiguration={isConfiguration}
      />
    </>
  );
}
