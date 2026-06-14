import { Message, MessageTab } from '@/types/message';

export const mockMessages: Message[] = [
  {
    id: 'm1',
    type: 'application',
    title: '新的合作申请',
    content: '小琳 申请加入您的「周末夜市手作饰品摊位」项目',
    fromUserId: 'u1',
    fromUserName: '小琳',
    fromUserAvatar: 'https://picsum.photos/id/64/200/200',
    projectId: '1',
    projectTitle: '周末夜市手作饰品摊位',
    createdAt: '2024-02-10 14:30',
    isRead: false,
    actionRequired: true,
    actionType: 'apply',
    status: 'pending'
  },
  {
    id: 'm2',
    type: 'application',
    title: '新的合作申请',
    content: '摄影师Leo 申请加入您的「宠物摄影工作室」项目',
    fromUserId: 'u4',
    fromUserName: '摄影师Leo',
    fromUserAvatar: 'https://picsum.photos/id/338/200/200',
    projectId: '4',
    projectTitle: '宠物摄影工作室合伙人',
    createdAt: '2024-02-10 10:15',
    isRead: false,
    actionRequired: true,
    actionType: 'apply',
    status: 'pending'
  },
  {
    id: 'm3',
    type: 'invitation',
    title: '合作邀请',
    content: '食神阿杰 邀请您参与「美食探店账号」项目，担任摄像师角色',
    fromUserId: 'u2',
    fromUserName: '食神阿杰',
    fromUserAvatar: 'https://picsum.photos/id/91/200/200',
    projectId: '2',
    projectTitle: '本地美食探店账号合作',
    createdAt: '2024-02-09 16:45',
    isRead: false,
    actionRequired: true,
    actionType: 'invite',
    status: 'pending'
  },
  {
    id: 'm4',
    type: 'invitation',
    title: '合作邀请',
    content: 'MCN创始人 邀请您加入「抖音本地生活服务商」项目，担任视频编导',
    fromUserId: 'u8',
    fromUserName: 'MCN创始人',
    fromUserAvatar: 'https://picsum.photos/id/177/200/200',
    projectId: '8',
    projectTitle: '抖音本地生活服务商',
    createdAt: '2024-02-09 11:20',
    isRead: true,
    actionRequired: true,
    actionType: 'invite',
    status: 'pending'
  },
  {
    id: 'm5',
    type: 'reminder',
    title: '待办提醒',
    content: '您在「社区团购鲜果供应链」中的待办任务「本周订单统计」将于明天截止',
    projectId: '3',
    projectTitle: '社区团购鲜果供应链',
    createdAt: '2024-02-10 09:00',
    isRead: false,
    actionRequired: false
  },
  {
    id: 'm6',
    type: 'reminder',
    title: '约见提醒',
    content: '您与「露营达人」的线下见面约在今天下午14:00，请准时参加',
    fromUserId: 'u6',
    fromUserName: '露营达人',
    fromUserAvatar: 'https://picsum.photos/id/1025/200/200',
    createdAt: '2024-02-10 08:30',
    isRead: false,
    actionRequired: false
  },
  {
    id: 'm7',
    type: 'reminder',
    title: '分账确认',
    content: '「文创市集摊主招募」项目的第一期分账已生成，请及时确认',
    projectId: '10',
    projectTitle: '文创市集摊主招募',
    createdAt: '2024-02-08 15:30',
    isRead: true,
    actionRequired: true,
    actionType: 'confirm',
    status: 'pending'
  },
  {
    id: 'm8',
    type: 'system',
    title: '信用分更新',
    content: '恭喜！您的信用分已提升至88分，可解锁更多优质项目',
    createdAt: '2024-02-07 10:00',
    isRead: true,
    actionRequired: false
  },
  {
    id: 'm9',
    type: 'system',
    title: '实名认证通过',
    content: '您的实名认证已通过，现在可以发布项目和申请合作了',
    createdAt: '2024-02-01 14:20',
    isRead: true,
    actionRequired: false
  },
  {
    id: 'm10',
    type: 'chat',
    title: '小琳',
    content: '您好，我对您的饰品摊位项目很感兴趣，请问还招人吗？',
    fromUserId: 'u1',
    fromUserName: '小琳',
    fromUserAvatar: 'https://picsum.photos/id/64/200/200',
    createdAt: '2024-02-10 15:00',
    isRead: false,
    actionRequired: false
  }
];

export const messageTabs: MessageTab[] = [
  { key: 'application', label: '申请', count: 2 },
  { key: 'invitation', label: '邀请', count: 2 },
  { key: 'reminder', label: '提醒', count: 3 },
  { key: 'system', label: '系统', count: 2 },
  { key: 'chat', label: '聊天', count: 1 }
];
