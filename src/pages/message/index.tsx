import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Message, MessageType } from '@/types/message';
import { mockMessages, messageTabs } from '@/data/messages';
import { useApp } from '@/context/AppContext';
import MessageItem from '@/components/MessageItem';
import styles from './index.module.scss';

const MessagePage: React.FC = () => {
  const { setUnreadMessageCount } = useApp();
  const [activeTab, setActiveTab] = useState<MessageType>('application');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => m.type === activeTab);
  }, [messages, activeTab]);

  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    messageTabs.forEach(tab => {
      counts[tab.key] = messages.filter(m => m.type === tab.key && !m.isRead).length;
    });
    return counts;
  }, [messages]);

  const totalUnread = useMemo(() => {
    return messages.filter(m => !m.isRead).length;
  }, [messages]);

  const handleTabChange = (key: MessageType) => {
    console.log('[MessagePage] 切换标签:', key);
    setActiveTab(key);
  };

  const handleMarkAllRead = () => {
    console.log('[MessagePage] 标记全部已读');
    Taro.showModal({
      title: '标记全部已读',
      content: '确定要将所有消息标记为已读吗？',
      success: (res) => {
        if (res.confirm) {
          const updated = messages.map(m => ({ ...m, isRead: true }));
          setMessages(updated);
          setUnreadMessageCount(0);
          Taro.showToast({
            title: '已全部标记为已读',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleAccept = (message: Message) => {
    console.log('[MessagePage] 接受:', message.id);
    const updated = messages.map(m => 
      m.id === message.id ? { ...m, isRead: true, status: 'accepted' as const } : m
    );
    setMessages(updated);
    setUnreadMessageCount(prev => Math.max(0, prev - 1));
    Taro.showToast({
      title: '已接受',
      icon: 'success'
    });
  };

  const handleReject = (message: Message) => {
    console.log('[MessagePage] 拒绝:', message.id);
    Taro.showModal({
      title: '拒绝申请',
      content: '确定要拒绝该申请吗？',
      success: (res) => {
        if (res.confirm) {
          const updated = messages.map(m => 
            m.id === message.id ? { ...m, isRead: true, status: 'rejected' as const } : m
          );
          setMessages(updated);
          setUnreadMessageCount(prev => Math.max(0, prev - 1));
          Taro.showToast({
            title: '已拒绝',
            icon: 'none'
          });
        }
      }
    });
  };

  const handleConfirm = (message: Message) => {
    console.log('[MessagePage] 确认:', message.id);
    const updated = messages.map(m => 
      m.id === message.id ? { ...m, isRead: true, status: 'accepted' as const } : m
    );
    setMessages(updated);
    setUnreadMessageCount(prev => Math.max(0, prev - 1));
    Taro.showToast({
      title: '已确认',
      icon: 'success'
    });
  };

  const handleMessageClick = (message: Message) => {
    console.log('[MessagePage] 点击消息:', message.id);
    if (!message.isRead) {
      const updated = messages.map(m => 
        m.id === message.id ? { ...m, isRead: true } : m
      );
      setMessages(updated);
      setUnreadMessageCount(prev => Math.max(0, prev - 1));
    }
    
    if (message.projectId) {
      Taro.navigateTo({
        url: `/pages/project-detail/index?id=${message.projectId}`
      });
    } else if (message.fromUserId) {
      Taro.navigateTo({
        url: `/pages/profile/index?id=${message.fromUserId}`
      });
    }
  };

  const handleCollaborationClick = () => {
    console.log('[MessagePage] 进入协作中心');
    Taro.navigateTo({
      url: '/pages/collaboration/index'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        <ScrollView 
          className={styles.tabList}
          scrollX
          showScrollbar={false}
        >
          {messageTabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(
                styles.tabItem,
                activeTab === tab.key && styles.active
              )}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
              {unreadCounts[tab.key] > 0 && (
                <View className={styles.badge}>
                  {unreadCounts[tab.key] > 99 ? '99+' : unreadCounts[tab.key]}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View className={styles.header}>
        <Text className={styles.headerTitle}>
          {messageTabs.find(t => t.key === activeTab)?.label}
          {unreadCounts[activeTab] > 0 && ` (${unreadCounts[activeTab]}条未读)`}
        </Text>
        {totalUnread > 0 && (
          <Button className={styles.markAllBtn} onClick={handleMarkAllRead}>
            全部已读
          </Button>
        )}
      </View>
      
      <ScrollView
        className={styles.list}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onAccept={() => handleAccept(message)}
              onReject={() => handleReject(message)}
              onConfirm={() => handleConfirm(message)}
              onClick={() => handleMessageClick(message)}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.icon}>📭</Text>
            <Text className={styles.text}>暂无{messageTabs.find(t => t.key === activeTab)?.label}消息</Text>
            <Text className={styles.subText}>有新消息时会在这里显示</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
