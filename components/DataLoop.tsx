import * as React from 'react';

export interface DataLoopProps<T> {
  data: T[];
  children: (item: T, i: number) => React.ReactElement;
}

export const DataLoop = function <T>(props: DataLoopProps<T>) {
  return <React.Fragment>{props.data.map(props.children)}</React.Fragment>;
};
