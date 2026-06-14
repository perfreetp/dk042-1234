import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockProjects } from '@/data/projects';
import { TodoItem, ExpenseItem, ProfitSharing, ProgressUpdate, Dispute } from '@/types/collaboration';
import { formatMoney } from '@/utils';
import styles from './index.module.scss';

const mockTodos: TodoItem[] = [
  { id: '1', title: '采购摊位物料', deadline: '2024-01-15', assignee: '张三', completed: false },
  { id: '2', title: '设计宣传海报', deadline: '2024-01-12', assignee: '李四', completed: true },
  { id: '3', title: '联系场地负责人', deadline: '2024-01-10', assignee: '王五', completed: false },
];

const mockExpenses: ExpenseItem[] = [
  { id: '1', title: '摊位租金', amount: 2000, payer: '张三', date: '2024-01-08', category: '场地' },
  { id: '2', title: '物料采购', amount: 800, payer: '李四', date: '2024-01-09', category: '物料' },
  { id: '3', title: '宣传打印', amount: 300, payer: '王五', date: '2024-01-10', category: '宣传' },
];

const mockSharing: ProfitSharing[] = [
  { partnerName: '张三', partnerAvatar: 'https://picsum.photos/id/64/100', amount: 2500, percentage: 50 },
  { partnerName: '李四', partnerAvatar: 'https://picsum.photos/id/65/100', amount: 1500, percentage: 30 },
  { partnerName: '王五', partnerAvatar: 'https://picsum.photos/id/66/100', amount: 1000, percentage: 20 },
];

const mockProgress: ProgressUpdate[] = [
  { id: '1', author: '张三', content: '摊位已确定，位于商圈入口处，人流量大。', time: '2024-01-08 14:30' },
  { id: '2', author: '李四', content: '宣传海报设计完成，已上传到群文件，请确认。', time: '2024-01-09 10:15' },
  { id: '3', author: '王五', content: '首批物料已采购完成，明天可以到位。', time: '2024-01-10 16:45' },
];

const mockDisputes: Dispute[] = [
  { id: '1', title: '物料费用分摊争议', content: '关于采购物料的费用分摊比例，双方有不同意见，需要协商解决。', status: 'pending', submitter: '张三', time: '2024-01-10' },
];

type TabType = 'todo' | 'expense' | 'sharing' | 'progress' | 'dispute';

const CollaborationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('todo');
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const project = mockProjects[0];

  const handleTabChange = (tab: TabType) => {
    console.log('[CollaborationPage] 切换标签:', tab);
    setActiveTab(tab);
  };

  const handleTodoToggle = (id: string) => {
    console.log('[CollaborationPage] 切换待办状态:', id);
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleAddTodo = () => {
    console.log('[CollaborationPage] 添加待办');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  const handleAddExpense = () => {
    console.log('[CollaborationPage] 记录费用');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  const handleConfirmSharing = () => {
    console.log('[CollaborationPage] 确认分账');
    Taro.showModal({
      title: '确认分账',
      content: '确认当前分账方案无误？确认后将无法修改。',
      confirmText: '确认分账',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '分账已确认',
            icon: 'success'
          });
        }
      }
    });
  };

  const handlePostProgress = () => {
    console.log('[CollaborationPage] 发布进展');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  const handleSubmitDispute = () => {
    console.log('[CollaborationPage] 提交争议');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSharing = mockSharing.reduce((sum, s) => sum + s.amount, 0);

  const tabs = [
    { key: 'todo' as TabType, label: '📋 待办', icon: '📋' },
    { key: 'expense' as TabType, label: '💰 费用', icon: '💰' },
    { key: 'sharing' as TabType, label: '📊 分账', icon: '📊' },
    { key: 'progress' as TabType, label: '📢 进展', icon: '📢' },
    { key: 'dispute' as TabType, label: '⚖️ 争议', icon: '⚖️' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.projectHeader}>
        <Text className={styles.projectTitle}>{project.title}</Text>
        <View className={styles.projectMeta}>
          <Text>👥 {project.requiredRoles.length}位合伙人</Text>
          <Text>📅 试运行中</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.content}>
        {activeTab === 'todo' && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>📋 待办事项</Text>
            {todos.map(todo => (
              <View key={todo.id} className={styles.todoItem}>
                <View 
                  className={`${styles.checkbox} ${todo.completed ? styles.checkboxChecked : ''}`}
                  onClick={() => handleTodoToggle(todo.id)}
                >
                  {todo.completed && <Text className={styles.checkboxIcon}>✓</Text>}
                </View>
                <View className={styles.todoContent}>
                  <Text className={`${styles.todoTitle} ${todo.completed ? styles.todoTitleCompleted : ''}`}>
                    {todo.title}
                  </Text>
                  <View className={styles.todoMeta}>
                    <Text className={styles.todoAssignee}>👤 {todo.assignee}</Text>
                    <Text className={styles.todoDeadline}>⏰ {todo.deadline}</Text>
                  </View>
                </View>
              </View>
            ))}
            <View className={styles.addBtn} onClick={handleAddTodo}>
              + 添加待办
            </View>
          </View>
        )}

        {activeTab === 'expense' && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>💰 费用记录</Text>
            {mockExpenses.map(expense => (
              <View key={expense.id} className={styles.expenseItem}>
                <View className={styles.expenseInfo}>
                  <Text className={styles.expenseTitle}>{expense.title}</Text>
                  <Text className={styles.expenseMeta}>
                    {expense.category} · {expense.payer} 垫付 · {expense.date}
                  </Text>
                </View>
                <Text className={styles.expenseAmount}>-{formatMoney(expense.amount)}</Text>
              </View>
            ))}
            <View className={styles.summaryRow}>
              <Text className={styles.summaryLabel}>总支出</Text>
              <Text className={styles.summaryValue}>{formatMoney(totalExpenses)}</Text>
            </View>
            <View className={styles.addBtn} onClick={handleAddExpense}>
              + 记录费用
            </View>
          </View>
        )}

        {activeTab === 'sharing' && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>📊 分账确认</Text>
            {mockSharing.map((sharing, index) => (
              <View key={index} className={styles.sharingItem}>
                <View className={styles.sharingPartner}>
                  <Image 
                    className={styles.partnerAvatar} 
                    src={sharing.partnerAvatar} 
                    mode="aspectFill"
                  />
                  <Text className={styles.partnerName}>{sharing.partnerName}</Text>
                </View>
                <View>
                  <Text className={styles.sharingAmount}>+{formatMoney(sharing.amount)}</Text>
                  <Text className={styles.sharingPercent}>({sharing.percentage}%)</Text>
                </View>
              </View>
            ))}
            <View className={styles.summaryRow}>
              <Text className={styles.summaryLabel}>总分润</Text>
              <Text className={styles.summaryValue}>{formatMoney(totalSharing)}</Text>
            </View>
          </View>
        )}

        {activeTab === 'progress' && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>📢 项目进展</Text>
            {mockProgress.map(progress => (
              <View key={progress.id} className={styles.progressItem}>
                <View className={styles.progressHeader}>
                  <Text className={styles.progressAuthor}>{progress.author}</Text>
                  <Text className={styles.progressTime}>{progress.time}</Text>
                </View>
                <Text className={styles.progressContent}>{progress.content}</Text>
              </View>
            ))}
            <View className={styles.addBtn} onClick={handlePostProgress}>
              + 发布进展
            </View>
          </View>
        )}

        {activeTab === 'dispute' && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>⚖️ 争议处理</Text>
            {mockDisputes.length > 0 ? (
              mockDisputes.map(dispute => (
                <View key={dispute.id} className={styles.disputeItem}>
                  <Text className={styles.disputeTitle}>{dispute.title}</Text>
                  <View>
                    <Text className={styles.disputeStatus}>
                      {dispute.status === 'pending' ? '处理中' : '已解决'}
                    </Text>
                  </View>
                  <Text className={styles.disputeContent}>{dispute.content}</Text>
                  <Text style={{ fontSize: 24, color: '#999', marginTop: 8 }}>
                    提交人：{dispute.submitter} · {dispute.time}
                  </Text>
                </View>
              ))
            ) : (
              <View style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <Text>暂无争议</Text>
              </View>
            )}
            <View className={styles.addBtn} onClick={handleSubmitDispute}>
              + 提交争议说明
            </View>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        {activeTab === 'sharing' ? (
          <Button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleConfirmSharing}>
            确认分账
          </Button>
        ) : (
          <>
            <Button className={`${styles.btn} ${styles.btnOutline}`}>
              项目资料
            </Button>
            <Button className={`${styles.btn} ${styles.btnPrimary}`}>
              联系合伙人
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default CollaborationPage;
