export interface TMenuItem {
    key: string;
    value: string;
    subItems?: TMenuItem[];
    iconClass?: string;
}

export interface TMenuInputModel {
    items: TMenuItem[]
}