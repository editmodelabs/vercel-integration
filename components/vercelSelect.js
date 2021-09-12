import { useState } from "react";
import Select from "./select";

export default function VercelSelect({
  options,
  project,
  fieldId,
  fields,
  setFields,
  field,
}) {
  return (
    <>
      <Select
        options={options}
        project={project}
        fieldId={fieldId}
        fields={fields}
        setFields={setFields}
        field={field}
      />
    </>
  );
}
