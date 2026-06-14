import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagFilterOption {
  key: string;
  label: string;
}

interface TagFilterProps {
  options: TagFilterOption[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({
  options,
  activeKey,
  onChange,
  className
}) => {
  return (
    <View className={classnames(styles.container, className)}>
      <ScrollView 
        className={styles.scrollContainer}
        scrollX 
        showScrollbar={false}
      >
        <View className={styles.tagList}>
          {options.map((option) => (
            <View
              key={option.key}
              className={classnames(
                styles.tagItem,
                activeKey === option.key && styles.active
              )}
              onClick={() => {
                console.log('[TagFilter] 选择标签:', option.key, option.label);
                onChange(option.key);
              }}
            >
              {option.label}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TagFilter;
