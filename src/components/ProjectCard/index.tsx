import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Project } from '@/types/project';
import styles from './index.module.scss';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const categoryMap: Record<string, string> = {
  'stall': '摊位经营',
  '探店账号': '探店账号',
  '手作团购': '手作团购',
  '社区团长': '社区团长',
  '摄影接单': '摄影接单',
  '其他': '其他'
};

const investmentMap: Record<string, string> = {
  'zero': '零投入',
  'low': '1万以下',
  'medium': '1-5万',
  'high': '5万以上'
};

const timeMap: Record<string, string> = {
  'weekend': '仅周末',
  'parttime': '兼职',
  'fulltime': '全职'
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const handleClick = () => {
    console.log('[ProjectCard] 点击项目:', project.id, project.title);
    Taro.navigateTo({
      url: `/pages/project-detail/index?id=${project.id}`
    });
  };

  return (
    <View className={classnames(styles.card, className)} onClick={handleClick}>
      <View className={styles.cover}>
        <Image 
          src={project.coverImage} 
          mode="aspectFill"
          onError={(e) => console.error('[ProjectCard] 图片加载失败:', e)}
        />
        <View className={styles.categoryTag}>
          {categoryMap[project.category] || project.category}
        </View>
        <View className={styles.distanceTag}>
          {project.distance}
        </View>
      </View>
      
      <View className={styles.content}>
        <Text className={styles.title}>{project.title}</Text>
        <Text className={styles.desc}>{project.description}</Text>
        
        <View className={styles.meta}>
          <View className={styles.metaItem}>
            <Text className={styles.label}>投入：</Text>
            <Text className={styles.value}>{investmentMap[project.investmentAmount]}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.label}>时间：</Text>
            <Text className={styles.value}>{timeMap[project.timeIntensity]}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.label}>启动金：</Text>
            <Text className={styles.price}>¥{project.startupCost.toLocaleString()}</Text>
          </View>
        </View>
        
        <View className={styles.tags}>
          {project.tags.map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        
        <View className={styles.footer}>
          <View className={styles.publisher}>
            <View className={styles.avatar}>
              <Image src={project.publisher.avatar} mode="aspectFill" />
            </View>
            <View className={styles.publisherInfo}>
              <Text className={styles.name}>{project.publisher.name}</Text>
              <Text className={styles.credit}>
                信用{project.publisher.creditScore}分 · 已完成{project.publisher.completedProjects}个项目
              </Text>
            </View>
          </View>
          <View className={styles.stats}>
            <Text>{project.viewCount}浏览</Text>
            <Text>{project.applyCount}人申请</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProjectCard;
