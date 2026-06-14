import React, { useState } from 'react';
import { View, Text, Image, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { currentUser } from '@/data/users';
import styles from './index.module.scss';

const EditProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    location: currentUser.location,
    skills: currentUser.skills.map(s => s.name),
    weekdays: currentUser.availableTime.weekdays,
    weekends: currentUser.availableTime.weekends,
    resources: currentUser.resources.map(r => r.name),
    categories: currentUser.preferences.interestedCategories,
    investment: currentUser.preferences.acceptableInvestment,
    timeCommitment: currentUser.preferences.timeCommitment,
    preferredRole: currentUser.preferences.preferredRole,
    minCreditScore: currentUser.preferences.minCreditScore.toString(),
  });

  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) {
      Taro.showToast({ title: '该技能已添加', icon: 'none' });
      return;
    }
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleTimeToggle = (type: 'weekdays' | 'weekends', time: string) => {
    setFormData(prev => {
      const times = prev[type];
      if (times.includes(time)) {
        return { ...prev, [type]: times.filter(t => t !== time) };
      } else {
        return { ...prev, [type]: [...times, time] };
      }
    });
  };

  const handleResourceToggle = (resource: string) => {
    setFormData(prev => {
      if (prev.resources.includes(resource)) {
        return { ...prev, resources: prev.resources.filter(r => r !== resource) };
      } else {
        return { ...prev, resources: [...prev.resources, resource] };
      }
    });
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleSave = () => {
    console.log('[EditProfilePage] 保存资料:', formData);
    Taro.showModal({
      title: '保存确认',
      content: '确定要保存修改的资料吗？',
      confirmText: '保存',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '保存成功',
            icon: 'success',
            success: () => {
              setTimeout(() => Taro.navigateBack(), 1000);
            }
          });
        }
      }
    });
  };

  const allWeekdays = ['09:00-12:00', '14:00-18:00', '19:00-22:00'];
  const allWeekends = ['09:00-12:00', '14:00-18:00', '19:00-22:00'];
  const allResources = [
    { name: '摊位/场地', icon: '🏪' },
    { name: '摄影设备', icon: '📷' },
    { name: '交通工具', icon: '🚗' },
    { name: '启动资金', icon: '💰' },
    { name: '电商店铺', icon: '🛒' },
    { name: '人脉资源', icon: '👥' },
  ];
  const allCategories = ['摊位经营', '探店账号', '手作团购', '社区团长', '摄影接单', '其他'];

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        <View className={styles.avatarSection}>
          <Image 
            className={styles.avatar} 
            src={currentUser.avatar} 
            mode="aspectFill"
          />
          <Text className={styles.uploadBtn}>点击更换头像</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>👤 基本信息</Text>
          <View className={styles.formItem}>
            <Text className={styles.label}>昵称</Text>
            <Input
              className={styles.input}
              value={formData.name}
              onInput={(e) => handleInputChange('name', e.detail.value)}
              placeholder="请输入昵称"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>所在地区</Text>
            <Input
              className={styles.input}
              value={formData.location}
              onInput={(e) => handleInputChange('location', e.detail.value)}
              placeholder="请输入所在地区"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>个人简介</Text>
            <Textarea
              className={styles.textarea}
              value={formData.bio}
              onInput={(e) => handleInputChange('bio', e.detail.value)}
              placeholder="介绍一下自己，让合伙人更了解你..."
              maxlength={200}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💪 技能名片</Text>
          <View className={styles.skillRow}>
            {formData.skills.map((skill, index) => (
              <View key={index} className={styles.skillTag}>
                <Text className={styles.skillName}>{skill}</Text>
                <Text 
                  className={styles.removeIcon}
                  onClick={() => handleRemoveSkill(skill)}
                >
                  ×
                </Text>
              </View>
            ))}
            <View className={styles.skillRow} style={{ width: '100%', marginTop: 16 }}>
              <Input
                className={styles.input}
                style={{ flex: 1 }}
                value={newSkill}
                onInput={(e) => setNewSkill(e.detail.value)}
                placeholder="添加新技能"
                confirmType="done"
                onConfirm={handleAddSkill}
              />
              <Button 
                className={styles.addSkillBtn}
                onClick={handleAddSkill}
              >
                添加
              </Button>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⏰ 可合作时间</Text>
          <View className={styles.timeGrid}>
            <View className={styles.timeColumn}>
              <Text className={styles.timeTitle}>工作日</Text>
              {allWeekdays.map((time, index) => (
                <View 
                  key={index} 
                  className={styles.timeSlot}
                  onClick={() => handleTimeToggle('weekdays', time)}
                >
                  <View className={`${styles.timeCheckbox} ${formData.weekdays.includes(time) ? styles.timeCheckboxChecked : ''}`}>
                    {formData.weekdays.includes(time) && <Text className={styles.checkIcon}>✓</Text>}
                  </View>
                  <Text className={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>
            <View className={styles.timeColumn}>
              <Text className={styles.timeTitle}>周末</Text>
              {allWeekends.map((time, index) => (
                <View 
                  key={index} 
                  className={styles.timeSlot}
                  onClick={() => handleTimeToggle('weekends', time)}
                >
                  <View className={`${styles.timeCheckbox} ${formData.weekends.includes(time) ? styles.timeCheckboxChecked : ''}`}>
                    {formData.weekends.includes(time) && <Text className={styles.checkIcon}>✓</Text>}
                  </View>
                  <Text className={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🎒 拥有资源</Text>
          <View className={styles.resourceGrid}>
            {allResources.map((resource, index) => (
              <View 
                key={index} 
                className={styles.resourceItem}
                onClick={() => handleResourceToggle(resource.name)}
              >
                <View className={`${styles.resourceCheckbox} ${formData.resources.includes(resource.name) ? styles.resourceCheckboxChecked : ''}`}>
                  {formData.resources.includes(resource.name) && <Text className={styles.checkIcon}>✓</Text>}
                </View>
                <Text className={styles.resourceIcon}>{resource.icon}</Text>
                <Text className={styles.resourceName}>{resource.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🎯 合作偏好</Text>
          <View className={styles.formItem}>
            <Text className={styles.label}>感兴趣类别</Text>
            <View className={styles.tagsRow}>
              {allCategories.map((category, index) => (
                <View
                  key={index}
                  className={`${styles.tagItem} ${formData.categories.includes(category) ? styles.tagItemActive : ''}`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </View>
              ))}
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>可接受投资</Text>
            <View 
              className={styles.selectItem}
              onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
            >
              <Text className={styles.selectLabel}>{formData.investment}</Text>
              <Text className={styles.selectValue}>选择 ›</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>时间承诺</Text>
            <View 
              className={styles.selectItem}
              onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
            >
              <Text className={styles.selectLabel}>{formData.timeCommitment}</Text>
              <Text className={styles.selectValue}>选择 ›</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>期望角色</Text>
            <View 
              className={styles.selectItem}
              onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
            >
              <Text className={styles.selectLabel}>{formData.preferredRole}</Text>
              <Text className={styles.selectValue}>选择 ›</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          保存资料
        </Button>
      </View>
    </View>
  );
};

export default EditProfilePage;
