import React, { useState, useMemo } from 'react';
import { View, Text, Slider, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp, GlobalFilterOptions } from '@/context/AppContext';
import { investmentLevels } from '@/data/projects';
import { InvestmentLevel, TimeIntensity } from '@/types/project';
import styles from './index.module.scss';

const categoryKeyToLabel: Record<string, string> = {
  stall: '摊位经营',
  review: '探店账号',
  handmade: '手作团购',
  community: '社区团长',
  photography: '摄影接单',
  other: '其他',
};

const roleKeyToLabel: Record<string, string> = {
  operator: '运营负责人',
  sales: '销售推广',
  design: '设计创意',
  tech: '技术开发',
  finance: '财务行政',
  investor: '资金投入',
};

const roleLabelToKeywords: Record<string, string[]> = {
  '运营负责人': ['运营', '负责', '管理', '主管', '总监', '经理'],
  '销售推广': ['销售', '推广', '业务', '市场', '商务', '拓展'],
  '设计创意': ['设计', '创意', '美术', '视觉', 'UI', '美工'],
  '技术开发': ['技术', '开发', '程序', '代码', 'IT', '工程师', '程序员', '前端', '后端'],
  '财务行政': ['财务', '会计', '行政', '人事', '客服', '出纳'],
  '资金投入': ['资金', '投资', '出资', '金主', '合伙人', '天使'],
};

const FilterPage: React.FC = () => {
  const { projects, setGlobalFilter } = useApp();

  const [investmentRange, setInvestmentRange] = useState([0, 10000]);
  const [distanceRange, setDistanceRange] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTimeIntensities, setSelectedTimeIntensities] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('distance');

  const categories = [
    { key: 'stall', label: '摊位经营' },
    { key: 'review', label: '探店账号' },
    { key: 'handmade', label: '手作团购' },
    { key: 'community', label: '社区团长' },
    { key: 'photography', label: '摄影接单' },
    { key: 'other', label: '其他' },
  ];

  const timeIntensities = [
    { key: 'weekend', label: '仅周末', desc: '每周投入10小时以内' },
    { key: 'parttime', label: '兼职', desc: '每周投入10-20小时' },
    { key: 'fulltime', label: '全职', desc: '每周投入20小时以上' },
  ];

  const roles = [
    { key: 'operator', label: '运营负责人' },
    { key: 'sales', label: '销售推广' },
    { key: 'design', label: '设计创意' },
    { key: 'tech', label: '技术开发' },
    { key: 'finance', label: '财务行政' },
    { key: 'investor', label: '资金投入' },
  ];

  const sortOptions = [
    { key: 'distance', label: '距离最近' },
    { key: 'investment_asc', label: '投入最低' },
    { key: 'investment_desc', label: '投入最高' },
    { key: 'time_asc', label: '时间最少' },
    { key: 'time_desc', label: '时间最多' },
  ];

  const matchProjectCount = useMemo(() => {
    let filtered = [...projects];

    if (selectedCategories.length > 0) {
      const labels = selectedCategories.map(k => categoryKeyToLabel[k]).filter(Boolean);
      filtered = filtered.filter(p => {
        const pLabel = categoryKeyToLabel[p.category] || p.category;
        return labels.includes(pLabel) || selectedCategories.includes(p.category);
      });
    }

    if (selectedTimeIntensities.length > 0) {
      filtered = filtered.filter(p => selectedTimeIntensities.includes(p.timeIntensity));
    }

    if (selectedRoles.length > 0) {
      const roleLabels = selectedRoles.map(k => roleKeyToLabel[k]).filter(Boolean);
      const allKeywords = roleLabels.flatMap(label => roleLabelToKeywords[label] || [label]);
      filtered = filtered.filter(p =>
        p.requiredRoles.some(role => {
          const roleText = role.name + role.skills.join('');
          return allKeywords.some(kw => roleText.includes(kw));
        })
      );
    }

    const [minInv, maxInv] = investmentRange;
    filtered = filtered.filter(p => {
      const level = investmentLevels.find(l => l.key === p.investmentAmount);
      if (!level) return true;
      return level.min <= maxInv && level.max >= minInv;
    });

    if (distanceRange < 30) {
      filtered = filtered.filter(p => {
        const km = parseFloat(p.distance) || 0;
        return km <= distanceRange;
      });
    }

    return filtered.length;
  }, [projects, selectedCategories, selectedTimeIntensities, selectedRoles, investmentRange, distanceRange]);

  const handleCategoryToggle = (key: string) => {
    setSelectedCategories(prev => 
      prev.includes(key) 
        ? prev.filter(c => c !== key)
        : [...prev, key]
    );
  };

  const handleTimeToggle = (key: string) => {
    setSelectedTimeIntensities(prev => 
      prev.includes(key) 
        ? prev.filter(t => t !== key)
        : [...prev, key]
    );
  };

  const handleRoleToggle = (key: string) => {
    setSelectedRoles(prev => 
      prev.includes(key) 
        ? prev.filter(r => r !== key)
        : [...prev, key]
    );
  };

  const handleReset = () => {
    console.log('[FilterPage] 重置筛选');
    setInvestmentRange([0, 10000]);
    setDistanceRange(10);
    setSelectedCategories([]);
    setSelectedTimeIntensities([]);
    setSelectedRoles([]);
    setSortBy('distance');
    setGlobalFilter(null);
    Taro.showToast({
      title: '已重置',
      icon: 'success'
    });
  };

  const handleApply = () => {
    console.log('[FilterPage] 应用筛选:', {
      investmentRange,
      distanceRange,
      selectedCategories,
      selectedTimeIntensities,
      selectedRoles,
      sortBy
    });

    const filter: GlobalFilterOptions = {
      categories: selectedCategories,
      investmentMin: investmentRange[0],
      investmentMax: investmentRange[1],
      investmentLevels: (selectedTimeIntensities.length > 0
        ? investmentLevels.filter(l => l.key !== 'all').map(l => l.key)
        : []) as InvestmentLevel[],
      timeIntensities: selectedTimeIntensities as TimeIntensity[],
      roles: selectedRoles,
      distanceMax: distanceRange,
      sortBy,
    };

    setGlobalFilter(filter);

    Taro.showToast({
      title: `找到 ${matchProjectCount} 个项目`,
      icon: 'success',
      success: () => {
        setTimeout(() => Taro.navigateBack(), 600);
      }
    });
  };

  const handleLocationChange = () => {
    Taro.showToast({
      title: '定位功能开发中',
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        <Text className={styles.resultCount}>
          当前筛选条件下约有 <Text className={styles.highlight}>{matchProjectCount}</Text> 个匹配项目
        </Text>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📍 当前位置</Text>
          <View className={styles.locationRow}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text className={styles.locationText}>北京市朝阳区三里屯</Text>
            <Text className={styles.locationChange} onClick={handleLocationChange}>
              切换
            </Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💰 投入金额</Text>
          <View className={styles.rangeRow}>
            <Text className={styles.rangeLabel}>最低</Text>
            <Slider
              className={styles.rangeSlider}
              min={0}
              max={5000}
              step={100}
              value={investmentRange[0]}
              activeColor="#ff7d00"
              backgroundColor="#f0f0f0"
              blockColor="#ff7d00"
              blockSize={24}
              onChange={(e) => setInvestmentRange([e.detail.value, investmentRange[1]])}
            />
            <Text className={styles.rangeValue}>¥{investmentRange[0]}</Text>
          </View>
          <View className={styles.rangeRow}>
            <Text className={styles.rangeLabel}>最高</Text>
            <Slider
              className={styles.rangeSlider}
              min={1000}
              max={20000}
              step={500}
              value={investmentRange[1]}
              activeColor="#ff7d00"
              backgroundColor="#f0f0f0"
              blockColor="#ff7d00"
              blockSize={24}
              onChange={(e) => setInvestmentRange([investmentRange[0], e.detail.value])}
            />
            <Text className={styles.rangeValue}>¥{investmentRange[1]}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📏 距离范围</Text>
          <View className={styles.rangeRow}>
            <Text className={styles.rangeLabel}>距离</Text>
            <Slider
              className={styles.rangeSlider}
              min={1}
              max={30}
              step={1}
              value={distanceRange}
              activeColor="#ff7d00"
              backgroundColor="#f0f0f0"
              blockColor="#ff7d00"
              blockSize={24}
              onChange={(e) => setDistanceRange(e.detail.value)}
            />
            <Text className={styles.rangeValue}>{distanceRange}km</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🏷️ 项目类别</Text>
          <View className={styles.tagsRow}>
            {categories.map(cat => (
              <View
                key={cat.key}
                className={`${styles.tagItem} ${selectedCategories.includes(cat.key) ? styles.tagItemActive : ''}`}
                onClick={() => handleCategoryToggle(cat.key)}
              >
                {cat.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⏰ 时间强度</Text>
          {timeIntensities.map(item => (
            <View 
              key={item.key}
              className={styles.checkboxItem}
              onClick={() => handleTimeToggle(item.key)}
            >
              <View className={`${styles.checkbox} ${selectedTimeIntensities.includes(item.key) ? styles.checkboxChecked : ''}`}>
                {selectedTimeIntensities.includes(item.key) && <Text className={styles.checkIcon}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text className={styles.checkboxLabel}>{item.label}</Text>
                <Text className={styles.checkboxDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>👤 期望角色</Text>
          <View className={styles.tagsRow}>
            {roles.map(role => (
              <View
                key={role.key}
                className={`${styles.tagItem} ${selectedRoles.includes(role.key) ? styles.tagItemActive : ''}`}
                onClick={() => handleRoleToggle(role.key)}
              >
                {role.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📊 排序方式</Text>
          {sortOptions.map(option => (
            <View 
              key={option.key}
              className={styles.sortItem}
              onClick={() => setSortBy(option.key)}
            >
              <Text className={styles.sortLabel}>{option.label}</Text>
              <View className={`${styles.sortRadio} ${sortBy === option.key ? styles.sortRadioChecked : ''}`}>
                {sortBy === option.key && <View className={styles.sortRadioInner} />}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleReset}>
          重置
        </Button>
        <Button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleApply}>
          应用筛选
        </Button>
      </View>
    </View>
  );
};

export default FilterPage;
