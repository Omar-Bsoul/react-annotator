import * as React from 'react';

export interface ConditionalProps {
  condition: boolean;
  children: () => React.ReactElement;
}

export const Conditional = (props: ConditionalProps) => {
  if (props.condition) {
    return props.children();
  } else {
    return <React.Fragment />;
  }
};
