import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/context/AppContext';
import { Project } from '@/types/project';
import { getLevelText } from '@/utils';
import ProjectCard from '@/components/ProjectCard';
import styles from './index.module.scss';

const resourceTypeMap: Record<string, string> = {
  'equipment': '设备',
  'space': '场地',
  'capital': '资金',
  'network': '人脉',
  'other': '其他'
};

const timeCommitmentMap: Record<string, string> = {
  'weekend': '仅周末',
  'parttime': '兼职',
  'any': '时间灵活'
};

const categoryLabelMap: Record<string, string> = {
  stall: '摊位经营',
  review: '探店账号',
  handmade: '手作团购',
  community: '社区团长',
  photography: '摄影接单',
  other: '其他',
};

const investmentLabelMap: Record<string, string> = {
  zero: '零投入',
  low: '1万以下',
  medium: '1-5万',
  high: '5万以上',
};

const timeLabelMap: Record<string, string> = {
  weekend: '仅周末',
  parttime: '兼职',
  fulltime: '全职',
};

type ViewMode = 'main' | 'published' | 'joined' | 'reviews';

const MinePage: React.FC = () => {
  const { user, getMyPublishedProjects, getMyJoinedProjects } = useApp();

  const [viewMode, setViewMode] = useState<ViewMode>('main');

  useDidShow(() => {
    console.log('[MinePage] 页面显示');
  });

  const myPublished = useMemo(() => getMyPublishedProjects(), [user, getMyPublishedProjects]);
  const myJoined = useMemo(() => getMyJoinedProjects(), [getMyJoinedProjects]);

  const handleEditProfile = () => {
    console.log('[MinePage] 编辑资料');
    Taro.navigateTo({
      url: '/pages/edit-profile/index'
    });
  };

  const handleMenuClick = (key: string) => {
    console.log('[MinePage] 点击菜单:', key);
    switch (key) {
      case 'published':
        setViewMode('published');
        break;
      case 'joined':
        setViewMode('joined');
        break;
      case 'collaboration':
        Taro.navigateTo({
          url: '/pages/collaboration/index'
        });
        break;
      case 'reviews':
        setViewMode('reviews');
        break;
      case 'settings':
        Taro.showToast({
          title: '设置',
          icon: 'none'
        });
        break;
    }
  };

  const handleBack = () => {
    setViewMode('main');
  };

  const handleGotoProject = (project: Project) => {
    console.log('[MinePage] 查看项目:', project.id, project.title);
    Taro.navigateTo({
      url: `/pages/project-detail/index?id=${project.id}`
    });
  };

  const menuItems = [
    { key: 'published', icon: '📝', title: '我发布的项目', badge: myPublished.length },
    { key: 'joined', icon: '🤝', title: '我参与的项目', badge: myJoined.length },
    { key: 'collaboration', icon: '📋', title: '协作中心' },
    { key: 'reviews', icon: '⭐', title: '信用评价', badge: user.reviews.length },
    { key: 'settings', icon: '⚙️', title: '设置' }
  ];

  const getCategoryLabel = (c: string) => categoryLabelMap[c] || c;
  const getInvestmentLabel = (k: string) => investmentLabelMap[k] || k;
  const getTimeLabel = (k: string) => timeLabelMap[k] || k;

  const renderMain = () => (
    <>
      <View className={styles.profileHeader}>
        <View className={styles.profileTop}>
          <View className={styles.avatar}>
            <Image src={user.avatar} mode="aspectFill" />
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.name}>{user.name}</Text>
            <Text className={styles.location}>📍 {user.location} · {user.age}岁</Text>
            <Text className={styles.bio}>{user.bio}</Text>
          </View>
          <Button className={styles.editBtn} onClick={handleEditProfile}>
            编辑
          </Button>
        </View>

        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.value}>{user.creditScore}</Text>
            <Text className={styles.label}>信用分</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{user.completedProjects}</Text>
            <Text className={styles.label}>完成项目</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{user.successRate}%</Text>
            <Text className={styles.label}>成功率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{user.availableTime.totalHoursPerWeek}h</Text>
            <Text className={styles.label}>每周可投入</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.icon}>💪</Text>
              技能名片
            </Text>
            <Button className={styles.moreBtn} onClick={handleEditProfile}>
              管理
            </Button>
          </View>
          <View className={styles.skillList}>
            {user.skills.map((skill, index) => (
              <View key={index} className={styles.skillItem}>
                <View className={styles.skillInfo}>
                  <Text className={styles.skillName}>{skill.name}</Text>
                  <Text className={styles.skillExp}>{skill.experience}经验</Text>
                </View>
                <View className={classnames(styles.skillLevel, styles[skill.level])}>
                  {getLevelText(skill.level)}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.icon}>⏰</Text>
              可合作时间
            </Text>
          </View>
          <View className={styles.timeSection}>
            <View className={styles.timeColumn}>
              <Text className={styles.timeLabel}>工作日</Text>
              <View className={styles.timeSlots}>
                {user.availableTime.weekdays.length > 0 ? (
                  user.availableTime.weekdays.map((time, index) => (
                    <Text key={index} className={styles.timeSlot}>{time}</Text>
                  ))
                ) : (
                  <Text className={styles.timeSlot}>暂无可合作时间</Text>
                )}
              </View>
            </View>
            <View className={styles.timeColumn}>
              <Text className={styles.timeLabel}>周末</Text>
              <View className={styles.timeSlots}>
                {user.availableTime.weekends.length > 0 ? (
                  user.availableTime.weekends.map((time, index) => (
                    <Text key={index} className={styles.timeSlot}>{time}</Text>
                  ))
                ) : (
                  <Text className={styles.timeSlot}>暂无可合作时间</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.icon}>📦</Text>
              资源清单
            </Text>
            <Button className={styles.moreBtn} onClick={handleEditProfile}>
              管理
            </Button>
          </View>
          <View className={styles.resourceList}>
            {user.resources.map((resource, index) => (
              <View key={index} className={styles.resourceItem}>
                <Text className={styles.resourceType}>
                  {resourceTypeMap[resource.type] || resource.type}
                </Text>
                <Text className={styles.resourceName}>{resource.name}</Text>
                <Text className={styles.resourceDesc}>{resource.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.icon}>⭐</Text>
              信用评价
            </Text>
            <Button className={styles.moreBtn} onClick={() => handleMenuClick('reviews')}>
              查看全部
            </Button>
          </View>
          <View className={styles.creditSection}>
            <View className={styles.creditScore}>
              <Text className={styles.scoreValue}>{user.creditScore}</Text>
              <Text className={styles.scoreLabel}>信用分</Text>
            </View>
            <View className={styles.creditInfo}>
              <Text className={styles.creditDesc}>
                您的信用良好，已获得众多合伙人的信赖。
                完成更多项目并获得好评可以提升信用分。
              </Text>
              <Text className={styles.creditTips}>
                信用分 ≥ 90 可解锁高价值项目推荐
              </Text>
            </View>
          </View>

          {user.reviews.length > 0 && (
            <View style={{ marginTop: '24rpx' }}>
              {user.reviews.slice(0, 2).map((review) => (
                <View key={review.id} style={{
                  padding: '24rpx',
                  background: '#fff7f0',
                  borderRadius: '12rpx',
                  marginBottom: '16rpx'
                }}>
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8rpx' }}>
                    <Text style={{ fontSize: '28rpx', fontWeight: 500, color: '#1d2129' }}>
                      {review.fromUserName}
                    </Text>
                    <Text style={{ fontSize: '22rpx', color: '#86909c' }}>
                      {review.createdAt}
                    </Text>
                  </View>
                  <Text style={{ fontSize: '24rpx', color: '#ff7d00', marginBottom: '8rpx' }}>
                    {'⭐'.repeat(review.rating)}
                  </Text>
                  <Text style={{ fontSize: '26rpx', color: '#4e5969' }}>
                    {review.comment}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: '#86909c', marginTop: '8rpx' }}>
                    项目：{review.projectName}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.icon}>🎯</Text>
              合作偏好
            </Text>
            <Button className={styles.moreBtn} onClick={handleEditProfile}>
              编辑
            </Button>
          </View>
          <View className={styles.preferenceList}>
            <View className={styles.preferenceItem}>
              <Text className={styles.preferenceLabel}>感兴趣的类别</Text>
              <View className={styles.preferenceTags}>
                {user.cooperationPreferences.projectCategories.map((cat, index) => (
                  <Text key={index} className={styles.preferenceTag}>{cat}</Text>
                ))}
              </View>
            </View>
            <View className={styles.preferenceItem}>
              <Text className={styles.preferenceLabel}>可接受投资</Text>
              <Text className={styles.preferenceValue}>
                ¥{user.cooperationPreferences.investmentRange[0].toLocaleString()} - 
                ¥{user.cooperationPreferences.investmentRange[1].toLocaleString()}
              </Text>
            </View>
            <View className={styles.preferenceItem}>
              <Text className={styles.preferenceLabel}>时间承诺</Text>
              <Text className={styles.preferenceValue}>
                {timeCommitmentMap[user.cooperationPreferences.timeCommitment] || user.cooperationPreferences.timeCommitment}
              </Text>
            </View>
            <View className={styles.preferenceItem}>
              <Text className={styles.preferenceLabel}>期望角色</Text>
              <View className={styles.preferenceTags}>
                {user.cooperationPreferences.preferRoles.map((role, index) => (
                  <Text key={index} className={styles.preferenceTag}>{role}</Text>
                ))}
              </View>
            </View>
            <View className={styles.preferenceItem}>
              <Text className={styles.preferenceLabel}>最低信用分</Text>
              <Text className={styles.preferenceValue}>
                {user.cooperationPreferences.minCreditScore}分以上
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.menuList}>
          {menuItems.map((item) => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.key)}
            >
              <View className={styles.menuLeft}>
                <View className={styles.menuIcon}>{item.icon}</View>
                <Text className={styles.menuTitle}>{item.title}</Text>
                {item.badge !== undefined && item.badge > 0 && (
                  <View className={styles.menuBadge}>{item.badge}</View>
                )}
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderPublishedList = () => (
    <>
      <View className={styles.subPageHeader}>
        <Text className={styles.backBtn} onClick={handleBack}>‹ 返回</Text>
        <Text className={styles.subPageTitle}>我发布的项目</Text>
        <View style={{ width: 80 }} />
      </View>
      <View className={styles.listPageContent}>
        {myPublished.length > 0 ? (
          <>
            <View className={styles.listCountTip}>
              共发布 <Text className={styles.highlight}>{myPublished.length}</Text> 个项目
            </View>
            {myPublished.map(project => (
              <View key={project.id} onClick={() => handleGotoProject(project)}>
                <ProjectCard project={project} />
              </View>
            ))}
          </>
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>还没有发布过项目</Text>
            <Text className={styles.emptySubText}>去发现页看看，或者自己发布一个吧～</Text>
            <Button
              className={styles.emptyBtn}
              onClick={() => Taro.switchTab({ url: '/pages/publish/index' })}
            >
              去发布项目
            </Button>
          </View>
        )}
      </View>
    </>
  );

  const renderJoinedList = () => (
    <>
      <View className={styles.subPageHeader}>
        <Text className={styles.backBtn} onClick={handleBack}>‹ 返回</Text>
        <Text className={styles.subPageTitle}>我参与的项目</Text>
        <View style={{ width: 80 }} />
      </View>
      <View className={styles.listPageContent}>
        {myJoined.length > 0 ? (
          <>
            <View className={styles.listCountTip}>
              共参与 <Text className={styles.highlight}>{myJoined.length}</Text> 个项目
            </View>
            {myJoined.map(project => (
              <View key={project.id} onClick={() => handleGotoProject(project)}>
                <ProjectCard project={project} />
              </View>
            ))}
          </>
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🤝</Text>
            <Text className={styles.emptyText}>还没有参与的项目</Text>
            <Text className={styles.emptySubText}>多在发现页逛逛，遇到合适的就申请加入吧～</Text>
            <Button
              className={styles.emptyBtn}
              onClick={() => Taro.switchTab({ url: '/pages/discover/index' })}
            >
              去发现项目
            </Button>
          </View>
        )}
      </View>
    </>
  );

  const renderReviews = () => (
    <>
      <View className={styles.subPageHeader}>
        <Text className={styles.backBtn} onClick={handleBack}>‹ 返回</Text>
        <Text className={styles.subPageTitle}>信用评价</Text>
        <View style={{ width: 80 }} />
      </View>
      <View className={styles.listPageContent}>
        <View style={{
          padding: '32rpx',
          background: 'linear-gradient(135deg, #fff7f0 0%, #ffe8d6 100%)',
          borderRadius: '20rpx',
          marginBottom: '24rpx',
          display: 'flex',
          alignItems: 'center',
          gap: '32rpx'
        }}>
          <Text style={{
            fontSize: '96rpx',
            fontWeight: 700,
            color: '#ff7d00'
          }}>{user.creditScore}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: '28rpx', fontWeight: 600, color: '#1d2129', display: 'block', marginBottom: '8rpx' }}>
              信用分 {user.creditScore >= 90 ? '优秀' : user.creditScore >= 80 ? '良好' : '一般'}
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#86909c', lineHeight: 1.6 }}>
              已完成 {user.completedProjects} 个项目，成功率 {user.successRate}%
            </Text>
          </View>
        </View>

        {user.reviews.length > 0 ? (
          <>
            <View className={styles.listCountTip}>
              共收到 <Text className={styles.highlight}>{user.reviews.length}</Text> 条评价
            </View>
            {user.reviews.map((review) => (
              <View key={review.id} style={{
                padding: '24rpx',
                background: '#ffffff',
                borderRadius: '16rpx',
                marginBottom: '16rpx',
                boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)'
              }}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12rpx' }}>
                  <Text style={{ fontSize: '28rpx', fontWeight: 500, color: '#1d2129' }}>
                    {review.fromUserName}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: '#86909c' }}>
                    {review.createdAt}
                  </Text>
                </View>
                <Text style={{ fontSize: '24rpx', color: '#ff7d00', marginBottom: '12rpx' }}>
                  {'⭐'.repeat(review.rating)}
                </Text>
                <Text style={{ fontSize: '26rpx', color: '#4e5969', lineHeight: 1.6 }}>
                  {review.comment}
                </Text>
                <Text style={{ fontSize: '22rpx', color: '#86909c', marginTop: '12rpx' }}>
                  项目：{review.projectName}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>⭐</Text>
            <Text className={styles.emptyText}>还没有评价</Text>
            <Text className={styles.emptySubText}>完成项目后会收到合伙人的评价～</Text>
          </View>
        )}
      </View>
    </>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'published': return renderPublishedList();
      case 'joined': return renderJoinedList();
      case 'reviews': return renderReviews();
      case 'main':
      default: return renderMain();
    }
  };

  return (
    <ScrollView className={styles.page} scrollY enhanced showScrollbar={false}>
      {renderContent()}
    </ScrollView>
  );
};

export default MinePage;
