import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { mockProjects } from '@/data/projects';
import { Project } from '@/types/project';
import { formatMoney, getInvestmentText, getTimeText, getCategoryText } from '@/utils';
import styles from './index.module.scss';

const ProjectDetailPage: React.FC = () => {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const projectId = router.params.id;
    console.log('[ProjectDetailPage] 项目ID:', projectId);
    
    const found = mockProjects.find(p => p.id === projectId);
    if (found) {
      setProject(found);
    } else {
      setProject(mockProjects[0]);
    }
  }, []);

  const handleApply = () => {
    console.log('[ProjectDetailPage] 申请加入');
    Taro.showModal({
      title: '确认申请',
      content: '确定要申请加入这个项目吗？发布者会收到你的申请通知。',
      confirmText: '确认申请',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '申请已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleContact = () => {
    console.log('[ProjectDetailPage] 联系发布者');
    Taro.showToast({
      title: '请先申请加入',
      icon: 'none'
    });
  };

  if (!project) {
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
      <Image 
        className={styles.coverImage} 
        src={project.coverImage} 
        mode="aspectFill"
      />
      
      <View className={styles.content}>
        <Text className={styles.title}>{project.title}</Text>
        
        <View className={styles.metaRow}>
          <View className={styles.tag}>{getCategoryText(project.category)}</View>
          <Text className={styles.distance}>📍 {project.distance}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📋 项目介绍</Text>
          <Text className={styles.description}>{project.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💰 基本信息</Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>启动成本</Text>
              <Text className={styles.infoValue}>{formatMoney(project.startupCost)}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>投入金额</Text>
              <Text className={styles.infoValue}>{getInvestmentText(project.investmentAmount)}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>时间强度</Text>
              <Text className={styles.infoValue}>{getTimeText(project.timeIntensity)}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>试运行周期</Text>
              <Text className={styles.infoValue}>{project.trialPeriod}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>👥 需要的合伙人</Text>
          <View className={styles.roleList}>
            {project.requiredRoles.map((role, index) => (
              <View key={index} className={styles.roleItem}>
                <Text className={styles.roleName}>{role.name}</Text>
                <Text className={styles.roleCount}>{role.count}人 · {role.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📊 分账方式</Text>
          <Text className={styles.description}>{project.profitSharing}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📝 退出约定</Text>
          <Text className={styles.description}>{project.exitAgreement}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>👤 发布者</Text>
          <View className={styles.publisher}>
            <Image 
              className={styles.avatar} 
              src={project.publisher.avatar} 
              mode="aspectFill"
            />
            <View className={styles.publisherInfo}>
              <Text className={styles.publisherName}>{project.publisher.name}</Text>
              <Text className={styles.publisherBio}>{project.publisher.bio}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleContact}>
          在线咨询
        </Button>
        <Button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleApply}>
          申请加入
        </Button>
      </View>
    </View>
  );
};

export default ProjectDetailPage;
