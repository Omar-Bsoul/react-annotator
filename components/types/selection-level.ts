export enum SelectionLevel {
  Highlighted,
  Selected,
}

type Tuple<T1, T2> = {
  [T1.constructor.name]: T1;
  [T2.constructor.name]: T2;
};
