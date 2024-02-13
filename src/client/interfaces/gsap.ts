type FunctionBasedValue<T> = (index: number, target: any, targets: any[]) => T;
type NumberValue = number | FunctionBasedValue<number>;
type StringValue = string | FunctionBasedValue<string>;

export type TweenValue = NumberValue | StringValue;
