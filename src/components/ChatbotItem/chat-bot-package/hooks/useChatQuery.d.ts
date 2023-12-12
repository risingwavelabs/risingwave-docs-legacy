export interface ChatItemInterface {
    type: "ask" | "answer";
    content: string;
}
interface ChatQueryProps {
    session?: string;
}
export declare const useChatQuery: (props?: ChatQueryProps) => {
    chatList: ChatItemInterface[];
    querying: boolean;
    ask: (prompt: string, askSession?: string) => Promise<void>;
};
export {};
