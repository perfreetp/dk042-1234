import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/context/AppContext';
import { Skill, Resource, User } from '@/types/user';
import styles from './index.module.scss';

const resourceNameToType: Record<string, { type: Resource['type']; desc: string }> = {
  '摊位/场地': { type: 'space', desc: '有可用于经营的摊位或场地资源' },
  '摄影设备': { type: 'equipment', desc: '拥有专业摄影器材' },
  '交通工具': { type: 'equipment', desc: '有可用作运输或经营的车辆' },
  '启动资金': { type: 'capital', desc: '可提供启动资金支持' },
  '电商店铺': { type: 'other', desc: '有可运营的线上店铺账号' },
  '人脉资源': { type: 'network', desc: '拥有本地商业人脉和推广渠道' },
};

const investmentToRange: Record<string, [number, number]> = {
  '零投入': [0, 0],
  '1万以下': [0, 10000],
  '1-5万': [10000, 50000],
  '5-10万': [50000, 100000],
  '10万以上': [100000, 500000],
};

const EditProfilePage: React.FC = () => {
  const { user, setUser } = useApp();

  const investmentOptions = useMemo(() => ['零投入', '1万以下', '1-5万', '5-10万', '10万以上'], []);
  const timeOptions = useMemo(() => ['仅周末', '兼职', '时间灵活'], []);
  const roleOptions = useMemo(() => ['运营负责人', '销售推广', '设计创意', '技术开发', '财务行政', '资金投入'], []);

  const findInvestmentLabel = (range: [number, number]): string => {
    for (const [label, r] of Object.entries(investmentToRange)) {
      if (r[0] === range[0] && r[1] === range[1]) return label;
    }
    const avg = (range[0] + range[1]) / 2;
    if (avg === 0) return '零投入';
    if (avg < 10000) return '1万以下';
    if (avg < 50000) return '1-5万';
    return '5-10万';
  };

  const timeLabelToKey: Record<string, 'weekend' | 'parttime' | 'any'> = {
    '仅周末': 'weekend',
    '兼职': 'parttime',
    '时间灵活': 'any',
  };

  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    skills: user.skills.map(s => s.name),
    weekdays: user.availableTime.weekdays,
    weekends: user.availableTime.weekends,
    resources: user.resources.map(r => r.name),
    categories: user.cooperationPreferences.projectCategories,
    investment: findInvestmentLabel(user.cooperationPreferences.investmentRange),
    timeCommitment: (() => {
      const m: Record<string, string> = { 'weekend': '仅周末', 'parttime': '兼职', 'any': '时间灵活' };
      return m[user.cooperationPreferences.timeCommitment] || '兼职';
    })(),
    preferredRole: user.cooperationPreferences.preferRoles[0] || '运营负责人',
    minCreditScore: user.cooperationPreferences.minCreditScore.toString(),
  });

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleOptionSelect = (field: 'investment' | 'timeCommitment' | 'preferredRole', options: string[]) => {
    Taro.showActionSheet({
      itemList: options,
      success: (res) => {
        handleInputChange(field, options[res.tapIndex]);
      }
    });
  };

  const computeTotalHours = (): number => {
    const perSlot = 3;
    return (formData.weekdays.length + formData.weekends.length) * perSlot;
  };

  const handleSave = () => {
    if (saving) return;
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }
    if (!formData.location.trim()) {
      Taro.showToast({ title: '请填写所在地区', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '保存确认',
      content: '确定要保存修改的资料吗？',
      confirmText: '保存',
      success: (modalRes) => {
        if (modalRes.confirm) {
          setSaving(true);

          setTimeout(() => {
            try {
              const skills: Skill[] = formData.skills.map((name, idx) => ({
                name,
                level: idx < 2 ? 'intermediate' : 'beginner',
                experience: '1年以上',
              }));

              const existingResourcesMap = new Map(
                user.resources.map(r => [r.name, r])
              );
              const resources: Resource[] = formData.resources.map(name => {
                if (existingResourcesMap.has(name)) {
                  return existingResourcesMap.get(name)!;
                }
                const meta = resourceNameToType[name] || { type: 'other', desc: `${name}资源` };
                return {
                  type: meta.type,
                  name,
                  description: meta.desc,
                };
              });

              const totalHours = computeTotalHours();
              const investmentRange = investmentToRange[formData.investment] || [0, 10000];
              const timeCommitment = timeLabelToKey[formData.timeCommitment] || 'parttime';
              const minCreditScore = Math.max(0, Math.min(100, parseInt(formData.minCreditScore) || 80));

              const updatedUser: User = {
                ...user,
                name: formData.name.trim(),
                bio: formData.bio.trim(),
                location: formData.location.trim(),
                skills,
                resources,
                availableTime: {
                  weekdays: formData.weekdays,
                  weekends: formData.weekends,
                  totalHoursPerWeek: totalHours,
                },
                cooperationPreferences: {
                  ...user.cooperationPreferences,
                  projectCategories: formData.categories.length > 0 ? formData.categories : user.cooperationPreferences.projectCategories,
                  investmentRange,
                  timeCommitment,
                  preferRoles: formData.preferredRole ? [formData.preferredRole] : user.cooperationPreferences.preferRoles,
                  minCreditScore,
                },
              };

              setUser(updatedUser);
              console.log('[EditProfilePage] 保存成功，已回写全局状态:', updatedUser);

              Taro.showToast({
                title: '保存成功',
                icon: 'success',
                success: () => {
                  setTimeout(() => {
                    setSaving(false);
                    Taro.navigateBack();
                  }, 800);
                }
              });
            } catch (err) {
              console.error('[EditProfilePage] 保存失败:', err);
              setSaving(false);
              Taro.showToast({ title: '保存失败，请重试', icon: 'none' });
            }
          }, 500);
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
            src={user.avatar} 
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
          </View>
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
          <Text className={styles.tip}>每周可投入约 {computeTotalHours()} 小时</Text>
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
              onClick={() => handleOptionSelect('investment', investmentOptions)}
            >
              <Text className={styles.selectLabel}>{formData.investment}</Text>
              <Text className={styles.selectValue}>选择 ›</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>时间承诺</Text>
            <View 
              className={styles.selectItem}
              onClick={() => handleOptionSelect('timeCommitment', timeOptions)}
            >
              <Text className={styles.selectLabel}>{formData.timeCommitment}</Text>
              <Text className={styles.selectValue}>选择 ›</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>期望角色</Text>
            <View 
              className={styles.selectItem}
              onClick={() => handleOptionSelect('preferredRole', roleOptions)}
            >
              <Text className={styles.selectLabel}>{formData.preferredRole}</Text>
              <Text className={styles.selectValue}>选择 ›</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.label}>最低信用分要求</Text>
            <View className={styles.scoreRow}>
              <Slider
                className={styles.scoreSlider}
                min={60}
                max={100}
                step={1}
                value={parseInt(formData.minCreditScore) || 80}
                activeColor="#ff7d00"
                backgroundColor="#f0f0f0"
                blockColor="#ff7d00"
                blockSize={24}
                onChange={(e) => handleInputChange('minCreditScore', String(e.detail.value))}
              />
              <Text className={styles.scoreValue}>{formData.minCreditScore}分</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <Button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存资料'}
        </Button>
      </View>
    </View>
  );
};

export default EditProfilePage;
