import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Project, RequiredRole } from '@/types/project';
import { useApp } from '@/context/AppContext';
import { categories, investmentLevels, timeIntensities } from '@/data/projects';
import styles from './index.module.scss';

interface FormData {
  title: string;
  category: string;
  description: string;
  coverImage: string;
  location: string;
  investmentAmount: string;
  timeIntensity: string;
  goals: string;
  roles: RequiredRole[];
  profitSharing: string;
  startupCost: string;
  trialPeriod: string;
  exitAgreement: string;
  tags: string[];
}

const PublishPage: React.FC = () => {
  const { user, addProject } = useApp();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    coverImage: '',
    location: '',
    investmentAmount: '',
    timeIntensity: '',
    goals: '',
    roles: [
      { name: '', count: 1, skills: [], description: '' }
    ],
    profitSharing: '',
    startupCost: '',
    trialPeriod: '1个月',
    exitAgreement: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRole = (index: number, field: keyof RequiredRole, value: any) => {
    const newRoles = [...formData.roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    updateField('roles', newRoles);
  };

  const addRole = () => {
    const newRoles = [
      ...formData.roles,
      { name: '', count: 1, skills: [], description: '' }
    ];
    updateField('roles', newRoles);
  };

  const removeRole = (index: number) => {
    if (formData.roles.length <= 1) {
      Taro.showToast({
        title: '至少需要一个角色',
        icon: 'none'
      });
      return;
    }
    const newRoles = formData.roles.filter((_, i) => i !== index);
    updateField('roles', newRoles);
  };

  const handleUploadCover = () => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        updateField('coverImage', res.tempFilePaths[0]);
      }
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (formData.tags.includes(tagInput.trim())) {
      Taro.showToast({
        title: '标签已存在',
        icon: 'none'
      });
      return;
    }
    if (formData.tags.length >= 5) {
      Taro.showToast({
        title: '最多添加5个标签',
        icon: 'none'
      });
      return;
    }
    updateField('tags', [...formData.tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    updateField('tags', formData.tags.filter(t => t !== tag));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请填写项目名称', icon: 'none' });
      return false;
    }
    if (!formData.category) {
      Taro.showToast({ title: '请选择项目类别', icon: 'none' });
      return false;
    }
    if (!formData.description.trim()) {
      Taro.showToast({ title: '请填写项目描述', icon: 'none' });
      return false;
    }
    if (!formData.location.trim()) {
      Taro.showToast({ title: '请填写项目地点', icon: 'none' });
      return false;
    }
    if (!formData.investmentAmount) {
      Taro.showToast({ title: '请选择投入金额', icon: 'none' });
      return false;
    }
    if (!formData.timeIntensity) {
      Taro.showToast({ title: '请选择时间强度', icon: 'none' });
      return false;
    }
    if (!formData.goals.trim()) {
      Taro.showToast({ title: '请填写合作目标', icon: 'none' });
      return false;
    }

    const invalidRole = formData.roles.find(r => !r.name.trim());
    if (invalidRole) {
      Taro.showToast({ title: '请填写角色名称', icon: 'none' });
      return false;
    }

    if (!formData.profitSharing.trim()) {
      Taro.showToast({ title: '请填写分账方式', icon: 'none' });
      return false;
    }
    if (!formData.startupCost.trim() || isNaN(Number(formData.startupCost))) {
      Taro.showToast({ title: '请填写有效的启动成本', icon: 'none' });
      return false;
    }
    if (!formData.trialPeriod.trim()) {
      Taro.showToast({ title: '请填写试运行周期', icon: 'none' });
      return false;
    }
    if (!formData.exitAgreement.trim()) {
      Taro.showToast({ title: '请填写退出约定', icon: 'none' });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    console.log('[PublishPage] 提交表单:', formData);

    if (!validateForm()) return;

    setSubmitting(true);

    setTimeout(() => {
      try {
        const newProject: Project = {
          id: 'p_' + Date.now(),
          title: formData.title.trim(),
          category: formData.category as any,
          description: formData.description.trim(),
          coverImage: formData.coverImage || `https://picsum.photos/id/${100 + Math.floor(Math.random() * 900)}/750/500`,
          location: formData.location.trim(),
          distance: `${(Math.random() * 8 + 0.5).toFixed(1)}km`,
          investmentAmount: formData.investmentAmount as any,
          timeIntensity: formData.timeIntensity as any,
          requiredRoles: formData.roles.filter(r => r.name.trim()),
          profitSharing: formData.profitSharing.trim(),
          startupCost: Number(formData.startupCost) || 0,
          trialPeriod: formData.trialPeriod,
          exitAgreement: formData.exitAgreement.trim(),
          goals: formData.goals.trim(),
          publisher: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            creditScore: user.creditScore,
            completedProjects: user.completedProjects,
          },
          status: 'recruiting',
          createdAt: new Date().toISOString().slice(0, 10),
          tags: formData.tags.length > 0 ? formData.tags : ['新发布', '同城'],
          viewCount: 0,
          applyCount: 0,
        };

        addProject(newProject);
        console.log('[PublishPage] 项目已加入全局列表:', newProject.id, newProject.title);

        Taro.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              setSubmitting(false);
              Taro.switchTab({
                url: '/pages/discover/index'
              });
            }, 1500);
          }
        });
      } catch (err) {
        console.error('[PublishPage] 发布失败:', err);
        setSubmitting(false);
        Taro.showToast({ title: '发布失败，请重试', icon: 'none' });
      }
    }, 1000);
  };

  const handlePreview = () => {
    Taro.showToast({
      title: '预览功能开发中',
      icon: 'none'
    });
  };

  const categoryOptions = categories.filter(c => c.key !== 'all');
  const investmentOptions = investmentLevels.filter(i => i.key !== 'all');
  const timeOptions = timeIntensities.filter(t => t.key !== 'all');

  return (
    <View className={styles.page}>
      <ScrollView className={styles.form} scrollY>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            项目封面
          </Text>
          <View className={styles.coverUpload} onClick={handleUploadCover}>
            {formData.coverImage ? (
              <Image src={formData.coverImage} mode="aspectFill" className={styles.image} />
            ) : (
              <>
                <Text className={styles.icon}>📷</Text>
                <Text className={styles.text}>点击上传封面图片</Text>
              </>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            基本信息 <Text className={styles.required}>*</Text>
          </Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              项目名称 <Text className={styles.required}>*</Text>
            </Text>
            <Input
              className={styles.input}
              placeholder="请输入项目名称"
              value={formData.title}
              onInput={(e) => updateField('title', e.detail.value)}
              maxlength={50}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              项目类别 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.optionList}>
              {categoryOptions.map((option) => (
                <Button
                  key={option.key}
                  className={classnames(
                    styles.optionItem,
                    formData.category === option.key && styles.active
                  )}
                  onClick={() => updateField('category', option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              项目描述 <Text className={styles.required}>*</Text>
            </Text>
            <Textarea
              className={styles.textarea}
              placeholder="详细描述你的项目，包括项目背景、当前进展、未来规划等"
              value={formData.description}
              onInput={(e) => updateField('description', e.detail.value)}
              maxlength={500}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              项目地点 <Text className={styles.required}>*</Text>
            </Text>
            <Input
              className={styles.input}
              placeholder="请输入项目所在地点"
              value={formData.location}
              onInput={(e) => updateField('location', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            投入与时间 <Text className={styles.required}>*</Text>
          </Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              投入金额 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.optionList}>
              {investmentOptions.map((option) => (
                <Button
                  key={option.key}
                  className={classnames(
                    styles.optionItem,
                    formData.investmentAmount === option.key && styles.active
                  )}
                  onClick={() => updateField('investmentAmount', option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              时间强度 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.optionList}>
              {timeOptions.map((option) => (
                <Button
                  key={option.key}
                  className={classnames(
                    styles.optionItem,
                    formData.timeIntensity === option.key && styles.active
                  )}
                  onClick={() => updateField('timeIntensity', option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            合作目标 <Text className={styles.required}>*</Text>
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder="详细描述你希望达成的合作目标，包括短期目标和长期规划"
            value={formData.goals}
            onInput={(e) => updateField('goals', e.detail.value)}
            maxlength={300}
          />
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            需要的人 <Text className={styles.required}>*</Text>
          </Text>

          {formData.roles.map((role, index) => (
            <View key={index} className={styles.roleItem}>
              <View className={styles.roleHeader}>
                <Text className={styles.roleTitle}>角色 {index + 1}</Text>
                <Button
                  className={styles.deleteBtn}
                  onClick={() => removeRole(index)}
                >
                  ✕
                </Button>
              </View>

              <View className={styles.roleInputs}>
                <View className={styles.roleInput}>
                  <Text className={styles.label}>角色名称</Text>
                  <Input
                    className={styles.input}
                    placeholder="如：销售、技术"
                    value={role.name}
                    onInput={(e) => updateRole(index, 'name', e.detail.value)}
                  />
                </View>
                <View className={styles.roleInput}>
                  <Text className={styles.label}>需要人数</Text>
                  <Input
                    className={styles.input}
                    type="number"
                    value={String(role.count)}
                    onInput={(e) => updateRole(index, 'count', parseInt(e.detail.value) || 1)}
                  />
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>所需技能（用逗号分隔）</Text>
                <Input
                  className={styles.input}
                  placeholder="如：沟通能力,销售经验"
                  value={role.skills.join(',')}
                  onInput={(e) => updateRole(index, 'skills', e.detail.value.split(',').filter(Boolean))}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>职责描述</Text>
                <Textarea
                  className={styles.textarea}
                  placeholder="描述该角色的具体职责"
                  value={role.description}
                  onInput={(e) => updateRole(index, 'description', e.detail.value)}
                  style={{ minHeight: '120rpx' }}
                />
              </View>
            </View>
          ))}

          <Button className={styles.addRoleBtn} onClick={addRole}>
            + 添加角色
          </Button>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            分账方式 <Text className={styles.required}>*</Text>
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder="详细描述利润分配方式，例如：利润5:5分成，按月结算；或每单提成15%-20%等"
            value={formData.profitSharing}
            onInput={(e) => updateField('profitSharing', e.detail.value)}
            maxlength={300}
          />
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            启动成本 <Text className={styles.required}>*</Text>
          </Text>
          <Input
            className={styles.input}
            type="digit"
            placeholder="请输入预估启动成本（元）"
            value={formData.startupCost}
            onInput={(e) => updateField('startupCost', e.detail.value)}
          />
          <Text className={styles.tip}>启动成本将对所有合伙人透明公开</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            试运行周期 <Text className={styles.required}>*</Text>
          </Text>
          <View className={styles.optionList}>
            {['1周', '2周', '1个月', '2个月', '3个月'].map((period) => (
              <Button
                key={period}
                className={classnames(
                  styles.optionItem,
                  formData.trialPeriod === period && styles.active
                )}
                onClick={() => updateField('trialPeriod', period)}
              >
                {period}
              </Button>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            退出约定 <Text className={styles.required}>*</Text>
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder="详细描述退出机制，例如：提前15天通知，剩余库存按比例分配；或账号归属运营方，已产生收益按比例结算等"
            value={formData.exitAgreement}
            onInput={(e) => updateField('exitAgreement', e.detail.value)}
            maxlength={300}
          />
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            项目标签
          </Text>
          <View className={styles.tagsInput}>
            {formData.tags.map((tag) => (
              <View key={tag} className={styles.tagItem}>
                <Text>{tag}</Text>
                <Text className={styles.close} onClick={() => handleRemoveTag(tag)}>✕</Text>
              </View>
            ))}
            <Input
              className={styles.tagInputField}
              placeholder={formData.tags.length < 5 ? '输入标签后按回车' : '最多5个标签'}
              value={tagInput}
              onInput={(e) => setTagInput(e.detail.value)}
              onConfirm={handleAddTag}
              disabled={formData.tags.length >= 5}
            />
          </View>
          <Text className={styles.tip}>添加标签可以让项目更容易被搜索到（最多5个）</Text>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <Button className={styles.previewBtn} onClick={handlePreview}>
          预览
        </Button>
        <Button
          className={classnames(styles.submitBtn, submitting && styles.disabled)}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '发布中...' : '立即发布'}
        </Button>
      </View>
    </View>
  );
};

export default PublishPage;
