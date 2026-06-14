export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
  isRead: boolean;
  actionRequired?: boolean;
  actionType?: 'apply' | 'invite' | 'contact' | 'meet' | 'confirm';
  status?: 'pending' | 'accepted' | 'rejected';
}

export type MessageType = 'application' | 'invitation' | 'reminder' | 'system' | 'chat';

export interface MessageTab {
  key: MessageType;
  label: string;
  count: number;
}
