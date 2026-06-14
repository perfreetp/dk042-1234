import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import { User } from '@/types/user';
import { mockUsers, currentUser } from '@/data/users';
import { useApp } from '@/context/AppContext';
import UserCard from '@/components/UserCard';
import styles from './index.module.scss';

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'high', label: '高匹配度' },
  { key: 'skill', label: '技能互补' },
  { key: 'nearby', label: '距离最近' },
  { key: 'highCredit', label: '高信用分' }
];

const MatchPage: React.FC = () => {
  const { user } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const calculateMatchScore = useCallback((targetUser: User): number => {
    let score = 60;
    
    const userSkills = user.skills.map(s => s.name.toLowerCase());
    const targetSkills = targetUser.skills.map(s => s.name.toLowerCase());
    
    const complementary = targetSkills.filter(s => !userSkills.includes(s));
    score += complementary.length * 5;
    
    const matchingCategories = targetUser.cooperationPreferences.projectCategories.filter(
      c => user.cooperationPreferences.projectCategories.includes(c)
    );
    score += matchingCategories.length * 3;
    
    if (targetUser.creditScore >= user.cooperationPreferences.minCreditScore) {
      score += 5;
    }
    
    const timeMatch = 
      user.cooperationPreferences.timeCommitment === 'any' ||
      targetUser.cooperationPreferences.timeCommitment === user.cooperationPreferences.timeCommitment;
    if (timeMatch) score += 5;
    
    return Math.min(99, score);
  }, [user]);

  const getComplementarySkills = useCallback((targetUser: User): string[] => {
    const userSkills = user.skills.map(s => s.name.toLowerCase());
    return targetUser.skills
      .filter(s => !userSkills.includes(s.name.toLowerCase()))
      .map(s => s.name)
      .slice(0, 3);
  }, [user]);

  const loadMatches = useCallback(() => {
    setLoading(true);
    console.log('[MatchPage] 加载匹配用户');
    
    setTimeout(() => {
      const matchedUsers = mockUsers
        .filter(u => u.id !== user.id)
        .map(u => ({
          ...u,
          matchScore: calculateMatchScore(u),
          complementarySkills: getComplementarySkills(u)
        }))
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setUsers(matchedUsers);
      setLoading(false);
      console.log('[MatchPage] 加载完成，匹配用户数:', matchedUsers.length);
    }, 800);
  }, [user, calculateMatchScore, getComplementarySkills]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  usePullDownRefresh(() => {
    console.log('[MatchPage] 下拉刷新');
    loadMatches();
    Taro.stopPullDownRefresh();
  });

  const handleRefresh = () => {
    console.log('[MatchPage] 点击刷新按钮');
    loadMatches();
    Taro.showToast({
      title: '已刷新匹配结果',
      icon: 'success'
    });
  };

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    console.log('[MatchPage] 筛选:', key);
    
    let filtered = [...mockUsers]
      .filter(u => u.id !== user.id)
      .map(u => ({
        ...u,
        matchScore: calculateMatchScore(u),
        complementarySkills: getComplementarySkills(u)
      }));
    
    switch (key) {
      case 'high':
        filtered = filtered.filter(u => (u.matchScore || 0) >= 85);
        break;
      case 'skill':
        filtered = filtered.filter(u => (u.complementarySkills?.length || 0) >= 2);
        break;
      case 'nearby':
        break;
      case 'highCredit':
        filtered = filtered.filter(u => u.creditScore >= 90);
        break;
    }
    
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    setUsers(filtered);
  };

  const handleGreet = (targetUser: User) => {
    console.log('[MatchPage] 打招呼:', targetUser.name);
    Taro.showToast({
      title: `已向${targetUser.name}打招呼`,
      icon: 'success'
    });
  };

  const handleContact = (targetUser: User) => {
    console.log('[MatchPage] 交换联系方式:', targetUser.name);
    Taro.showModal({
      title: '交换联系方式',
      content: `确定要向${targetUser.name}发送联系方式交换请求吗？双方同意后将互相展示联系方式。`,
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

  const handleMeet = (targetUser: User) => {
    console.log('[MatchPage] 约线下见面:', targetUser.name);
    Taro.showModal({
      title: '约线下见面',
      content: `确定要向${targetUser.name}发送线下见面邀请吗？建议在公共场所见面，注意安全。`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '邀请已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleImproveProfile = () => {
    console.log('[MatchPage] 完善资料');
    Taro.navigateTo({
      url: '/pages/edit-profile/index'
    });
  };

  const averageMatchScore = users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + (u.matchScore || 0), 0) / users.length)
    : 0;

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>为你推荐</Text>
          <Button className={styles.refreshBtn} onClick={handleRefresh}>
            🔄
          </Button>
        </View>
        <Text className={styles.subtitle}>
          基于你的技能和偏好，智能匹配互补合伙人
        </Text>
        <View className={styles.matchStats}>
          <View className={styles.statItem}>
            <Text className={styles.value}>{users.length}</Text>
            <Text className={styles.label}>位候选人</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{averageMatchScore}%</Text>
            <Text className={styles.label}>平均匹配度</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{user.creditScore}</Text>
            <Text className={styles.label}>我的信用分</Text>
          </View>
        </View>
      </View>
      
      <ScrollView
        className={styles.filterBar}
        scrollX
        showScrollbar={false}
      >
        {filterOptions.map((option) => (
          <Button
            key={option.key}
            className={classnames(
              styles.filterChip,
              activeFilter === option.key && styles.active
            )}
            onClick={() => handleFilterChange(option.key)}
          >
            {option.label}
          </Button>
        ))}
      </ScrollView>
      
      <ScrollView
        className={styles.list}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {loading ? (
          <View className={styles.loading}>
            <Text>🔮 正在为你智能匹配...</Text>
          </View>
        ) : users.length > 0 ? (
          users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onGreet={() => handleGreet(u)}
              onContact={() => handleContact(u)}
              onMeet={() => handleMeet(u)}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.icon}>🤝</Text>
            <Text className={styles.text}>暂无匹配的合伙人选</Text>
            <Text className={styles.subText}>完善你的技能和偏好，获得更多精准匹配</Text>
            <Button className={styles.actionBtn} onClick={handleImproveProfile}>
              去完善资料
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MatchPage;
