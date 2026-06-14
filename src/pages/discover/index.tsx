import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import classnames from 'classnames';
import { Project } from '@/types/project';
import { mockProjects, categories, investmentLevels, timeIntensities } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import TagFilter from '@/components/TagFilter';
import styles from './index.module.scss';

const DiscoverPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeInvestment, setActiveInvestment] = useState('all');
  const [activeTime, setActiveTime] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filterProjects = useCallback(() => {
    console.log('[DiscoverPage] 筛选项目:', {
      category: activeCategory,
      investment: activeInvestment,
      time: activeTime,
      search: searchText
    });
    
    let filtered = [...mockProjects];
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
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
        p.tags.some(t => t.toLowerCase().includes(keyword))
      );
    }
    
    return filtered;
  }, [activeCategory, activeInvestment, activeTime, searchText]);

  const loadProjects = useCallback((reset = false) => {
    if (loading) return;
    
    setLoading(true);
    console.log('[DiscoverPage] 加载项目，reset:', reset);
    
    setTimeout(() => {
      const allFiltered = filterProjects();
      const currentPage = reset ? 1 : page;
      const start = 0;
      const end = currentPage * pageSize;
      const newProjects = allFiltered.slice(start, end);
      
      if (reset) {
        setProjects(newProjects);
        setPage(1);
      } else {
        setProjects(newProjects);
      }
      
      setHasMore(end < allFiltered.length);
      setLoading(false);
      console.log('[DiscoverPage] 加载完成，项目数:', newProjects.length, 'hasMore:', end < allFiltered.length);
    }, 500);
  }, [loading, page, filterProjects]);

  useEffect(() => {
    loadProjects(true);
  }, [activeCategory, activeInvestment, activeTime, searchText]);

  usePullDownRefresh(() => {
    console.log('[DiscoverPage] 下拉刷新');
    loadProjects(true);
    Taro.stopPullDownRefresh();
  });

  useReachBottom(() => {
    if (!hasMore || loading) return;
    console.log('[DiscoverPage] 上拉加载更多');
    const nextPage = page + 1;
    setPage(nextPage);
    loadProjects();
  });

  const handleSearch = (e: any) => {
    setSearchText(e.detail.value);
  };

  const handleSearchClick = () => {
    console.log('[DiscoverPage] 点击搜索框');
    Taro.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  };

  const handleFilterClick = () => {
    console.log('[DiscoverPage] 点击高级筛选');
    Taro.navigateTo({
      url: '/pages/filter/index'
    });
  };

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
  };

  const handleInvestmentChange = (key: string) => {
    setActiveInvestment(key);
  };

  const handleTimeChange = (key: string) => {
    setActiveTime(key);
  };

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
        
        <View className={styles.filterSection}>
          <TagFilter
            options={categories}
            activeKey={activeCategory}
            onChange={handleCategoryChange}
          />
          
          <View className={styles.filterRow}>
            <Text className={styles.label}>投入金额</Text>
            <TagFilter
              options={investmentLevels}
              activeKey={activeInvestment}
              onChange={handleInvestmentChange}
            />
          </View>
          
          <View className={styles.filterRow}>
            <Text className={styles.label}>时间强度</Text>
            <TagFilter
              options={timeIntensities}
              activeKey={activeTime}
              onChange={handleTimeChange}
            />
          </View>
        </View>
      </View>
      
      <ScrollView
        className={styles.list}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {projects.length > 0 ? (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            
            {loading && (
              <View className={styles.loading}>
                <Text>加载中...</Text>
              </View>
            )}
            
            {!loading && !hasMore && projects.length > 0 && (
              <View className={styles.noMore}>
                <Text>— 没有更多了 —</Text>
              </View>
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
