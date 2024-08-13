export type Groups = IGroup[];

export interface IGroup {
  group_id: string;
  group_label: string;
  items: IItem[]
};

export interface IItem {
  id: string;
  label: string;
  isCompleted: boolean;
}