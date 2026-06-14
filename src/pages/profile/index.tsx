import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { mockUsers } from '@/data/users';
import { User } from '@/types/user';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = router.params.id;
    console.log('[ProfilePage] 用户ID:', userId);
    
    const found = mockUsers.find(u => u.id === userId);
    if (found) {
      setUser(found);
    } else {
      setUser(mockUsers[0]);
    }
  }, []);

  const handleHello = () => {
    console.log('[ProfilePage] 打招呼');
    Taro.showModal({
      title: '发送问候',
      content: `确定要向${user?.name}发送问候吗？`,
      confirmText: '发送',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '问候已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleContact = () => {
    console.log('[ProfilePage] 交换联系方式');
    Taro.showModal({
      title: '交换联系方式',
      content: '对方同意后即可互换微信。确定发送请求吗？',
      confirmText: '发送请求',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '请求已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleMeet = () => {
    console.log('[ProfilePage] 约线下见面');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  if (!user) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 40, textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <Image 
            className={styles.avatar} 
            src={user.avatar} 
            mode="aspectFill"
          />
          <View className={styles.info}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{user.name}</Text>
              <View className={styles.creditBadge}>⭐ {user.creditScore}分</View>
            </View>
            <Text className={styles.location}>📍 {user.location}</Text>
            <Text className={styles.bio}>{user.bio}</Text>
          </View>
        </View>
        
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.completedProjects}</Text>
            <Text className={styles.statLabel}>完成项目</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.successRate}%</Text>
            <Text className={styles.statLabel}>成功率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.availableHours}h</Text>
            <Text className={styles.statLabel}>周投入</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💪 技能名片</Text>
          <View className={styles.skillsList}>
            {user.skills.map((skill, index) => (
              <View key={index} className={styles.skillItem}>
                <Text className={styles.skillName}>{skill.name}</Text>
                <Text className={styles.skillLevel}>{skill.level}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⏰ 可合作时间</Text>
          <View className={styles.timeGrid}>
            <View className={styles.timeColumn}>
              <Text className={styles.timeTitle}>工作日</Text>
              {user.availableTime.weekdays.map((time, index) => (
                <Text key={index} className={styles.timeSlot}>{time}</Text>
              ))}
            </View>
            <View className={styles.timeColumn}>
              <Text className={styles.timeTitle}>周末</Text>
              {user.availableTime.weekends.map((time, index) => (
                <Text key={index} className={styles.timeSlot}>{time}</Text>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🎒 资源清单</Text>
          <View className={styles.resourcesGrid}>
            {user.resources.map((resource, index) => (
              <View key={index} className={styles.resourceItem}>
                <Text className={styles.resourceIcon}>{resource.icon}</Text>
                <Text className={styles.resourceName}>{resource.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⭐ 信用评价</Text>
          {user.reviews.slice(0, 3).map((review, index) => (
            <View key={index} className={styles.reviewItem}>
              <View className={styles.reviewHeader}>
                <Text className={styles.reviewerName}>{review.reviewerName}</Text>
                <Text className={styles.reviewRating}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </Text>
              </View>
              <Text className={styles.reviewContent}>{review.content}</Text>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🎯 合作偏好</Text>
          <View className={styles.preferenceItem}>
            <Text className={styles.preferenceLabel}>感兴趣类别</Text>
            <Text className={styles.preferenceValue}>
              {user.preferences.interestedCategories.join('、')}
            </Text>
          </View>
          <View className={styles.preferenceItem}>
            <Text className={styles.preferenceLabel}>可接受投资</Text>
            <Text className={styles.preferenceValue}>{user.preferences.acceptableInvestment}</Text>
          </View>
          <View className={styles.preferenceItem}>
            <Text className={styles.preferenceLabel}>时间承诺</Text>
            <Text className={styles.preferenceValue}>{user.preferences.timeCommitment}</Text>
          </View>
          <View className={styles.preferenceItem}>
            <Text className={styles.preferenceLabel}>期望角色</Text>
            <Text className={styles.preferenceValue}>{user.preferences.preferredRole}</Text>
          </View>
          <View className={styles.preferenceItem}>
            <Text className={styles.preferenceLabel}>最低信用分</Text>
            <Text className={styles.preferenceValue}>{user.preferences.minCreditScore}分以上</Text>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleHello}>
          👋 打招呼
        </Button>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleContact}>
          📱 换联系方式
        </Button>
        <Button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleMeet}>
          ☕ 约见面
        </Button>
      </View>
    </View>
  );
};

export default ProfilePage;
