import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Message } from '@/types/message';
import styles from './index.module.scss';

interface MessageItemProps {
  message: Message;
  className?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onConfirm?: () => void;
  onClick?: () => void;
}

const typeIconMap: Record<string, string> = {
  'application': '📩',
  'invitation': '💌',
  'reminder': '⏰',
  'system': '📢',
  'chat': '💬'
};

const statusMap: Record<string, string> = {
  'pending': '待处理',
  'accepted': '已接受',
  'rejected': '已拒绝'
};

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  className,
  onAccept,
  onReject,
  onConfirm,
  onClick
}) => {
  const handleClick = () => {
    console.log('[MessageItem] 点击消息:', message.id, message.title);
    if (onClick) {
      onClick();
    }
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[MessageItem] 接受:', message.id);
    if (onAccept) {
      onAccept();
    } else {
      Taro.showToast({
        title: '已接受',
        icon: 'success'
      });
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[MessageItem] 拒绝:', message.id);
    if (onReject) {
      onReject();
    } else {
      Taro.showToast({
        title: '已拒绝',
        icon: 'none'
      });
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[MessageItem] 确认:', message.id);
    if (onConfirm) {
      onConfirm();
    } else {
      Taro.showToast({
        title: '已确认',
        icon: 'success'
      });
    }
  };

  return (
    <View 
      className={classnames(styles.item, !message.isRead && styles.unread, className)}
      onClick={handleClick}
    >
      {message.fromUserAvatar ? (
        <View className={styles.avatar}>
          <Image src={message.fromUserAvatar} mode="aspectFill" />
          {!message.isRead && <View className={styles.unreadDot} />}
        </View>
      ) : (
        <View className={styles.iconWrapper}>
          <View className={classnames(styles.typeIcon, styles[message.type])}>
            {typeIconMap[message.type]}
          </View>
          {!message.isRead && <View className={styles.unreadDot} />}
        </View>
      )}
      
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{message.title}</Text>
          <Text className={styles.time}>{message.createdAt}</Text>
        </View>
        
        <Text className={styles.preview}>{message.content}</Text>
        
        {message.actionRequired && message.status && (
          <View className={styles.actions}>
            {message.status === 'pending' && (
              <>
                {(message.actionType === 'apply' || message.actionType === 'invite') && (
                  <>
                    <Button 
                      className={classnames(styles.actionBtn, styles.reject)}
                      onClick={handleReject}
                    >
                      拒绝
                    </Button>
                    <Button 
                      className={classnames(styles.actionBtn, styles.accept)}
                      onClick={handleAccept}
                    >
                      接受
                    </Button>
                  </>
                )}
                {message.actionType === 'confirm' && (
                  <Button 
                    className={classnames(styles.actionBtn, styles.confirm)}
                    onClick={handleConfirm}
                  >
                    确认
                  </Button>
                )}
              </>
            )}
            {message.status !== 'pending' && (
              <View className={classnames(styles.statusBadge, styles[message.status])}>
                {statusMap[message.status]}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default MessageItem;
