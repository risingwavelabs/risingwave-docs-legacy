import { ChatItemInterface, useChatQuery } from './hooks/useChatQuery';
export { default as QueryInput } from './components/QueryInput/index';
export { default as AskItem } from './components/QueryResult/AskItem';
export { default as Answer } from './components/QueryResult/Answer';
export { useChatQuery };
export interface ChatItemProps extends ChatItemInterface {
}
