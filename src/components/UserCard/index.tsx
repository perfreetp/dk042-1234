import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { User } from '@/types/user';
import styles from './index.module.scss';

interface UserCardProps {
  user: User;
  showActions?: boolean;
  className?: string;
  onGreet?: () => void;
  onContact?: () => void;
  onMeet?: () => void;
}

const levelMap: Record<string, string> = {
  'beginner': '入门',
  'intermediate': '进阶',
  'expert': '专家'
};

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  showActions = true,
  className,
  onGreet,
  onContact,
  onMeet
}) => {
  const handleClick = () => {
    console.log('[UserCard] 点击用户:', user.id, user.name);
    Taro.navigateTo({
      url: `/pages/profile/index?id=${user.id}`
    });
  };

  const handleGreet = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[UserCard] 打招呼:', user.name);
    if (onGreet) {
      onGreet();
    } else {
      Taro.showToast({
        title: `已向${user.name}打招呼`,
        icon: 'success'
      });
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[UserCard] 交换联系方式:', user.name);
    if (onContact) {
      onContact();
    } else {
      Taro.showModal({
        title: '交换联系方式',
        content: `确定要向${user.name}发送联系方式交换请求吗？`,
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({
              title: '请求已发送',
              icon: 'success'
            });
          }
        }
      });
    }
  };

  const handleMeet = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[UserCard] 约线下见面:', user.name);
    if (onMeet) {
      onMeet();
    } else {
      Taro.showModal({
        title: '约线下见面',
        content: `确定要向${user.name}发送线下见面邀请吗？`,
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({
              title: '邀请已发送',
              icon: 'success'
            });
          }
        }
      });
    }
  };

  return (
    <View className={classnames(styles.card, className)} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.avatar}>
          <Image src={user.avatar} mode="aspectFill" />
          {user.matchScore && (
            <View className={styles.matchScore}>匹配度{user.matchScore}%</View>
          )}
        </View>
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{user.name}</Text>
            <Text className={styles.age}>{user.age}岁</Text>
          </View>
          <Text className={styles.location}>{user.location}</Text>
          <View className={styles.creditRow}>
            <Text>信用分：<Text className={styles.creditValue}>{user.creditScore}</Text></Text>
            <Text>完成项目：{user.completedProjects}</Text>
            <Text>成功率：{user.successRate}%</Text>
          </View>
        </View>
      </View>
      
      <Text className={styles.bio}>{user.bio}</Text>
      
      <View className={styles.skills}>
        <Text className={styles.sectionTitle}>技能专长</Text>
        <View className={styles.skillTags}>
          {user.skills.slice(0, 4).map((skill, index) => (
            <View key={index} className={styles.skillTag}>
              <Text>{skill.name}</Text>
              <Text className={styles.level}>{levelMap[skill.level]}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {user.complementarySkills && user.complementarySkills.length > 0 && (
        <View className={styles.complementary}>
          <Text className={styles.complementaryTitle}>✨ 与你互补的技能</Text>
          <View className={styles.complementarySkills}>
            {user.complementarySkills.map((skill, index) => (
              <Text key={index} className={styles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      )}
      
      {showActions && (
        <View className={styles.footer}>
          <Button 
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={handleGreet}
          >
            打招呼
          </Button>
          <Button 
            className={classnames(styles.actionBtn, styles.outline)}
            onClick={handleContact}
          >
            交换联系方式
          </Button>
          <Button 
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={handleMeet}
          >
            约见面
          </Button>
        </View>
      )}
    </View>
  );
};

export default UserCard;
