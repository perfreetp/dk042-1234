import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom, useDidShow } from '@tarojs/taro';
import { Project } from '@/types/project';
import { categories, investmentLevels, timeIntensities } from '@/data/projects';
import { useApp } from '@/context/AppContext';
import ProjectCard from '@/components/ProjectCard';
import TagFilter from '@/components/TagFilter';
import styles from './index.module.scss';

const categoryFilterKeyToLabel: Record<string, string> = {
  stall: '摊位经营',
  review: '探店账号',
  handmade: '手作团购',
  community: '社区团长',
  photography: '摄影接单',
  other: '其他',
};

const DiscoverPage: React.FC = () => {
  const { projects, globalFilter, setGlobalFilter } = useApp();

  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeInvestment, setActiveInvestment] = useState('all');
  const [activeTime, setActiveTime] = useState('all');
  const [displayProjects, setDisplayProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filterProjects = useMemo(() => {
    let filtered = [...projects];

    if (globalFilter) {
      if (globalFilter.categories && globalFilter.categories.length > 0) {
        const labels = globalFilter.categories.map(k => categoryFilterKeyToLabel[k]).filter(Boolean);
        filtered = filtered.filter(p => {
          const pLabel = categoryFilterKeyToLabel[p.category] || p.category;
          return labels.includes(pLabel) || globalFilter.categories.includes(p.category);
        });
      }

      if (globalFilter.timeIntensities && globalFilter.timeIntensities.length > 0) {
        filtered = filtered.filter(p => globalFilter.timeIntensities.includes(p.timeIntensity));
      }

      if (globalFilter.roles && globalFilter.roles.length > 0) {
        filtered = filtered.filter(p =>
          p.requiredRoles.some(role =>
            globalFilter.roles.some(r =>
              role.name.includes(r) ||
              role.skills.some(s => s.includes(r))
            )
          )
        );
      }

      const { investmentMin, investmentMax } = globalFilter;
      if (investmentMin > 0 || investmentMax < 20000) {
        filtered = filtered.filter(p => {
          const level = investmentLevels.find(l => l.key === p.investmentAmount);
          if (!level) return true;
          return level.min <= investmentMax && level.max >= investmentMin;
        });
      }

      if (globalFilter.distanceMax && globalFilter.distanceMax < 30) {
        filtered = filtered.filter(p => {
          const km = parseFloat(p.distance) || 0;
          return km <= globalFilter.distanceMax;
        });
      }
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => {
        const pLabel = categoryFilterKeyToLabel[p.category] || p.category;
        return p.category === activeCategory || pLabel === activeCategory;
      });
    }

    if (activeInvestment !== 'all') {
      filtered = filtered.filter(p => p.investmentAmount === activeInvestment);
    }

    if (activeTime !== 'all') {
      filtered = filtered.filter(p => p.timeIntensity === activeTime);
    }

    if (searchText) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.tags.some(t => t.toLowerCase().includes(keyword)) ||
        p.location.toLowerCase().includes(keyword)
      );
    }

    if (globalFilter?.sortBy) {
      const sortFn = (() => {
        switch (globalFilter.sortBy) {
          case 'investment_asc':
          case 'investment_desc': {
            const order = globalFilter.sortBy === 'investment_asc' ? 1 : -1;
            return (a: Project, b: Project) => {
              const la = investmentLevels.find(l => l.key === a.investmentAmount);
              const lb = investmentLevels.find(l => l.key === b.investmentAmount);
              return ((la?.min ?? 0) - (lb?.min ?? 0)) * order;
            };
          }
          case 'time_asc':
          case 'time_desc': {
            const order = globalFilter.sortBy === 'time_asc' ? 1 : -1;
            const timeOrder: Record<string, number> = { weekend: 1, parttime: 2, fulltime: 3 };
            return (a: Project, b: Project) => {
              return ((timeOrder[a.timeIntensity] ?? 0) - (timeOrder[b.timeIntensity] ?? 0)) * order;
            };
          }
          case 'distance':
          default:
            return (a: Project, b: Project) => {
              const da = parseFloat(a.distance) || 0;
              const db = parseFloat(b.distance) || 0;
              return da - db;
            };
        }
      })();
      filtered.sort(sortFn);
    } else {
      filtered.sort((a, b) => (b.applyCount - a.applyCount) || (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }

    return filtered;
  }, [projects, globalFilter, activeCategory, activeInvestment, activeTime, searchText]);

  const loadProjects = useCallback((reset = false) => {
    if (loading) return;
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const start = 0;
    const end = currentPage * pageSize;
    const newProjects = filterProjects.slice(start, end);

    setTimeout(() => {
      setDisplayProjects(newProjects);
      setHasMore(end < filterProjects.length);
      if (reset) setPage(1);
      setLoading(false);
    }, reset ? 300 : 150);
  }, [loading, page, filterProjects]);

  useEffect(() => {
    loadProjects(true);
  }, [filterProjects]);

  useDidShow(() => {
    loadProjects(true);
  });

  usePullDownRefresh(() => {
    loadProjects(true);
    Taro.stopPullDownRefresh();
  });

  useReachBottom(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setTimeout(() => {
      const end = nextPage * pageSize;
      const newProjects = filterProjects.slice(0, end);
      setDisplayProjects(newProjects);
      setHasMore(end < filterProjects.length);
    }, 150);
  });

  const handleSearch = (e: any) => setSearchText(e.detail.value);
  const handleSearchClick = () => {};
  const handleFilterClick = () => Taro.navigateTo({ url: '/pages/filter/index' });
  const handleCategoryChange = (key: string) => setActiveCategory(key);
  const handleInvestmentChange = (key: string) => setActiveInvestment(key);
  const handleTimeChange = (key: string) => setActiveTime(key);

  const handleClearGlobalFilter = () => {
    setGlobalFilter(null);
    Taro.showToast({ title: '已清除筛选条件', icon: 'success' });
  };

  const filterTagLabel = useMemo(() => {
    if (!globalFilter) return '';
    const parts: string[] = [];
    if (globalFilter.categories && globalFilter.categories.length > 0) {
      const names = globalFilter.categories.map(k => categoryFilterKeyToLabel[k] || k);
      parts.push(`类别(${names.length})`);
    }
    if (globalFilter.timeIntensities && globalFilter.timeIntensities.length > 0) {
      parts.push(`时间(${globalFilter.timeIntensities.length})`);
    }
    if (globalFilter.distanceMax && globalFilter.distanceMax < 30) {
      parts.push(`≤${globalFilter.distanceMax}km`);
    }
    if ((globalFilter.investmentMin ?? 0) > 0 || (globalFilter.investmentMax ?? 20000) < 20000) {
      parts.push(`¥${globalFilter.investmentMin}-${globalFilter.investmentMax}`);
    }
    if (globalFilter.roles && globalFilter.roles.length > 0) {
      parts.push(`角色(${globalFilter.roles.length})`);
    }
    return parts.join(' · ');
  }, [globalFilter]);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <View className={styles.searchInput} onClick={handleSearchClick}>
            <Text className={styles.icon}>🔍</Text>
            <Input
              className={styles.placeholder}
              placeholder="搜索项目、技能、地点..."
              value={searchText}
              onInput={handleSearch}
              confirmType="search"
            />
          </View>
          <Button className={styles.filterBtn} onClick={handleFilterClick}>
            🎛️
          </Button>
        </View>

        {globalFilter && (
          <View className={styles.activeFilterBar}>
            <Text className={styles.activeFilterLabel}>
              🎯 高级筛选：{filterTagLabel}
            </Text>
            <Text className={styles.activeFilterClear} onClick={handleClearGlobalFilter}>清除 ✕</Text>
          </View>
        )}

        <View className={styles.filterSection}>
          <TagFilter options={categories} activeKey={activeCategory} onChange={handleCategoryChange} />
          <View className={styles.filterRow}>
            <Text className={styles.label}>投入金额</Text>
            <TagFilter options={investmentLevels} activeKey={activeInvestment} onChange={handleInvestmentChange} />
          </View>
          <View className={styles.filterRow}>
            <Text className={styles.label}>时间强度</Text>
            <TagFilter options={timeIntensities} activeKey={activeTime} onChange={handleTimeChange} />
          </View>
        </View>
      </View>

      <ScrollView className={styles.list} scrollY enhanced showScrollbar={false}>
        {displayProjects.length > 0 ? (
          <>
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {loading && (
              <View className={styles.loading}><Text>加载中...</Text></View>
            )}
            {!loading && !hasMore && displayProjects.length > 0 && (
              <View className={styles.noMore}><Text>— 没有更多了 —</Text></View>
            )}
          </>
        ) : (
          !loading && (
            <View className={styles.empty}>
              <Text className={styles.icon}>🔍</Text>
              <Text className={styles.text}>暂无符合条件的项目</Text>
              <Text className={styles.subText}>试试调整筛选条件吧</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default DiscoverPage;
