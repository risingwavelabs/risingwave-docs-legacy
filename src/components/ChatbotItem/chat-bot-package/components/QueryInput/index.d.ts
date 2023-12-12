/// <reference types="react" />
interface QueryInputProps {
    disabled?: boolean;
    expand: boolean;
    onSubmit: (value: string) => void;
    onHandleExpand: () => void;
}
declare const QueryInput: React.FC<QueryInputProps>;
export default QueryInput;
