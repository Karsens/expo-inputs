import React from "react";
import { Switch } from "react-native";

export default ({ state, field, setFormState, value, onChange }) => {
  const gotState = state[field] !== null && state[field] !== undefined;

  return (
    <Switch
      value={gotState ? state[field] : value}
      onValueChange={x => {
        
        setFormState({ [field]: x });

        onChange?.(x);
    
    }}
    />
  );
};
