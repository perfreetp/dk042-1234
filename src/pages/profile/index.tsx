import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { User } from '@/types/user';
import { useApp } from '@/context/AppContext';
import MeetModal from '@/components/MeetModal';
import styles from './index.module.scss';

const resourceIconMap: Record<string, string> = {
  'equipment': '📷',
  'space': '🏪',
  'capital': '💰',
  'network': '👥',
  'other': '📦'
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { getUserById } = useApp();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetModalVisible, setMeetModalVisible] = useState(false);

  useEffect(() => {
    const userId = router.params.id;
    console.log('[ProfilePage] 用户ID:', userId);
    
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const found = getUserById(userId);
    console.log('[ProfilePage] 查找结果:', found?.name, found?.id);
    
    setTimeout(() => {
      if (found) {
        setProfileUser(found);
      } else {
        console.log('[ProfilePage] 未找到用户，使用兜底数据');
        const fallbackUser = (require('@/data/users').mockUsers as User[])[0];
        setProfileUser(fallbackUser);
      }
      setLoading(false);
    }, 100);
  }, [router.params.id, getUserById]);

  const handleHello = () => {
    if (!profileUser) return;
    console.log('[ProfilePage] 打招呼');
    Taro.showModal({
      title: '发送问候',
      content: `确定要向${profileUser.name}发送问候吗？`,
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
    if (!profileUser) return;
    console.log('[ProfilePage] 交换联系方式');
    Taro.showModal({
      title: '交换联系方式',
      content: `向${profileUser.name}发送联系方式交换请求？对方同意后即可互换微信。`,
      confirmText: '发送请求',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '请求已发送，等待对方同意',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  };

  const handleMeet = () => {
    if (!profileUser) return;
    console.log('[ProfilePage] 打开约见面弹窗');
    setMeetModalVisible(true);
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 120, textAlign: 'center' }}>
          <Text style={{ fontSize: 32, color: '#999' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 120, textAlign: 'center' }}>
          <Text style={{ fontSize: 48 }}>😢</Text>
          <Text style={{ fontSize: 32, color: '#999', marginTop: 16, display: 'block' }}>未找到该用户</Text>
          <Button 
            style={{ marginTop: 32, background: '#ff7d00', color: '#fff', borderRadius: 12 }}
            onClick={() => Taro.navigateBack()}
          >
            返回
          </Button>
        </View>
      </View>
    );
  }

  const totalHours = profileUser.availableTime?.totalHoursPerWeek || 0;
  const skills = profileUser.skills && profileUser.skills.length > 0 ? profileUser.skills : [];
  const weekdays = profileUser.availableTime?.weekdays || [];
  const weekends = profileUser.availableTime?.weekends || [];
  const resources = profileUser.resources && profileUser.resources.length > 0 ? profileUser.resources : [];
  const reviews = profileUser.reviews || [];
  const prefs = profileUser.cooperationPreferences;

  console.log('[ProfilePage] 渲染用户:', profileUser.name, '技能数:', skills.length, '资源数:', resources.length);

  return (
    <View className={styles.page}>
      <ScrollView scrollY enhanced showScrollbar={false} style={{ minHeight: '100vh' }}>
        <View className={styles.header}>
          <View className={styles.profileCard}>
            <Image 
              className={styles.avatar} 
              src={profileUser.avatar} 
              mode="aspectFill"
            />
            <View className={styles.info}>
              <View className={styles.nameRow}>
                <Text className={styles.name}>{profileUser.name}</Text>
                <View className={styles.creditBadge}>⭐ {profileUser.creditScore}分</View>
              </View>
              <Text className={styles.location}>📍 {profileUser.location || '未设置位置'}</Text>
              <Text className={styles.bio} numberOfLines={3}>{profileUser.bio || '这个人很懒，没有留下简介'}</Text>
            </View>
          </View>
          
          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{profileUser.completedProjects || 0}</Text>
              <Text className={styles.statLabel}>完成项目</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{profileUser.successRate || 0}%</Text>
              <Text className={styles.statLabel}>成功率</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{totalHours}h</Text>
              <Text className={styles.statLabel}>周投入</Text>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>💪 技能名片</Text>
            {skills.length > 0 ? (
              <View className={styles.skillsList}>
                {skills.map((skill, index) => (
                  <View key={`skill-${index}`} className={styles.skillItem}>
                    <Text className={styles.skillName}>{skill.name}</Text>
                    <Text className={styles.skillLevel}>
                      {skill.level === 'expert' ? '专家' : skill.level === 'intermediate' ? '进阶' : '入门'}
                      {skill.experience ? ` · ${skill.experience}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#999', fontSize: 28, textAlign: 'center', padding: 16 }}>
                暂无技能记录
              </Text>
            )}
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>⏰ 可合作时间</Text>
            <View className={styles.timeGrid}>
              <View className={styles.timeColumn}>
                <Text className={styles.timeTitle}>工作日</Text>
                {weekdays.length > 0 ? (
                  weekdays.map((time, index) => (
                    <Text key={`wd-${index}`} className={styles.timeSlot}>🕐 {time}</Text>
                  ))
                ) : (
                  <Text className={styles.timeSlot} style={{ color: '#bbb' }}>暂未设置</Text>
                )}
              </View>
              <View className={styles.timeColumn}>
                <Text className={styles.timeTitle}>周末</Text>
                {weekends.length > 0 ? (
                  weekends.map((time, index) => (
                    <Text key={`we-${index}`} className={styles.timeSlot}>🕐 {time}</Text>
                  ))
                ) : (
                  <Text className={styles.timeSlot} style={{ color: '#bbb' }}>暂未设置</Text>
                )}
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>🎒 资源清单</Text>
            {resources.length > 0 ? (
              <View className={styles.resourcesGrid}>
                {resources.map((resource, index) => (
                  <View key={`res-${index}`} className={styles.resourceItem}>
                    <Text className={styles.resourceIcon}>
                      {resource.icon || resourceIconMap[resource.type] || '📦'}
                    </Text>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text className={styles.resourceName} numberOfLines={1}>{resource.name}</Text>
                      {resource.description && (
                        <Text style={{ fontSize: 22, color: '#999', marginTop: 4, display: 'block' }} numberOfLines={1}>
                          {resource.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#999', fontSize: 28, textAlign: 'center', padding: 16 }}>
                暂无资源清单
              </Text>
            )}
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>⭐ 信用评价 ({reviews.length})</Text>
            <View style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: 20, 
              background: 'linear-gradient(135deg, #fff7f0 0%, #fff3e6 100%)', 
              borderRadius: 16,
              marginBottom: 16 
            }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#ff7d00' }}>{profileUser.creditScore}</Text>
                <Text style={{ fontSize: 24, color: '#999', marginTop: 4 }}>综合信用分</Text>
              </View>
              <View style={{ width: 1, height: 64, background: '#eee' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1d2129' }}>
                  {reviews.filter(r => r.rating >= 4).length}/{reviews.length}
                </Text>
                <Text style={{ fontSize: 24, color: '#999', marginTop: 4 }}>好评率</Text>
              </View>
            </View>
            {reviews.length > 0 ? (
              reviews.slice(0, 5).map((review, index) => (
                <View key={`review-${index}`} className={styles.reviewItem}>
                  <View className={styles.reviewHeader}>
                    <Text className={styles.reviewerName}>{review.fromUserName}</Text>
                    <Text className={styles.reviewRating}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </Text>
                  </View>
                  <Text className={styles.reviewContent}>{review.comment}</Text>
                  {review.projectName && (
                    <Text style={{ fontSize: 22, color: '#bbb', marginTop: 8, display: 'block' }}>
                      项目：{review.projectName} · {review.createdAt}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={{ color: '#999', fontSize: 28, textAlign: 'center', padding: 16 }}>
                暂无评价记录，合作完成后将获得评价
              </Text>
            )}
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>🎯 合作偏好</Text>
            {prefs ? (
              <>
                <View className={styles.preferenceItem}>
                  <Text className={styles.preferenceLabel}>感兴趣类别</Text>
                  <Text className={styles.preferenceValue} numberOfLines={2}>
                    {prefs.projectCategories && prefs.projectCategories.length > 0 
                      ? prefs.projectCategories.join('、') 
                      : '不限'}
                  </Text>
                </View>
                <View className={styles.preferenceItem}>
                  <Text className={styles.preferenceLabel}>可接受投资</Text>
                  <Text className={styles.preferenceValue}>
                    {prefs.investmentRange 
                      ? `¥${prefs.investmentRange[0].toLocaleString()} - ¥${prefs.investmentRange[1].toLocaleString()}`
                      : '不限'}
                  </Text>
                </View>
                <View className={styles.preferenceItem}>
                  <Text className={styles.preferenceLabel}>时间承诺</Text>
                  <Text className={styles.preferenceValue}>
                    {prefs.timeCommitment === 'weekend' ? '仅周末' 
                      : prefs.timeCommitment === 'parttime' ? '兼职（10-20h/周）' 
                      : prefs.timeCommitment === 'any' ? '时间灵活' 
                      : '不限'}
                  </Text>
                </View>
                <View className={styles.preferenceItem}>
                  <Text className={styles.preferenceLabel}>期望角色</Text>
                  <Text className={styles.preferenceValue} numberOfLines={2}>
                    {prefs.preferRoles && prefs.preferRoles.length > 0 
                      ? prefs.preferRoles.join('、') 
                      : '不限'}
                  </Text>
                </View>
                <View className={styles.preferenceItem}>
                  <Text className={styles.preferenceLabel}>最低信用分</Text>
                  <Text className={styles.preferenceValue}>
                    {prefs.minCreditScore || 60}分以上
                  </Text>
                </View>
              </>
            ) : (
              <Text style={{ color: '#999', fontSize: 28, textAlign: 'center', padding: 16 }}>
                暂未设置合作偏好
              </Text>
            )}
          </View>
        </View>
        <View style={{ height: 160 }} />
      </ScrollView>

      <View className={styles.footer}>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleHello}>
          👋 打招呼
        </Button>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleContact}>
          📱 换微信
        </Button>
        <Button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleMeet}>
          ☕ 约见面
        </Button>
      </View>

      <MeetModal
        visible={meetModalVisible}
        targetUser={profileUser}
        onClose={() => setMeetModalVisible(false)}
      />
    </View>
  );
};

export default ProfilePage;
