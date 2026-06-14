import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/context/AppContext';
import { User } from '@/types/user';
import styles from './index.module.scss';

interface MeetModalProps {
  visible: boolean;
  targetUser: User | null;
  onClose: () => void;
}

const MeetModal: React.FC<MeetModalProps> = ({ visible, targetUser, onClose }) => {
  const { user, sendMeetInvitation } = useApp();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [lastInvitation, setLastInvitation] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      setDate('');
      setTime('');
      setLocation('');
      setMessage('');
      setSubmitting(false);
      setResultVisible(false);
      setLastInvitation(null);
    }
  }, [visible]);

  if (!visible || !targetUser) return null;

  const dateOptions = [
    { key: 'tomorrow', label: '明天' },
    { key: 'dayAfter', label: '后天' },
    { key: 'thisWeekend', label: '本周六' },
    { key: 'nextWeekend', label: '本周日' },
  ];

  const timeOptions = [
    { key: '10:00', label: '上午 10:00' },
    { key: '14:00', label: '下午 14:00' },
    { key: '16:00', label: '下午 16:00' },
    { key: '19:00', label: '晚上 19:00' },
  ];

  const locationOptions = [
    '星巴克（就近门店）',
    '麦当劳/肯德基',
    '商圈咖啡馆',
    '项目所在地附近',
  ];

  const validate = (): boolean => {
    if (!date) {
      Taro.showToast({ title: '请选择见面日期', icon: 'none' });
      return false;
    }
    if (!time) {
      Taro.showToast({ title: '请选择见面时间', icon: 'none' });
      return false;
    }
    if (!location.trim()) {
      Taro.showToast({ title: '请填写见面地点', icon: 'none' });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);

    setTimeout(() => {
      const dateLabel = dateOptions.find(d => d.key === date)?.label || date;
      const timeLabel = timeOptions.find(t => t.key === time)?.label || time;

      const invitation = sendMeetInvitation({
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: targetUser.id,
        toUserName: targetUser.name,
        date: dateLabel,
        time: timeLabel,
        location: location,
        message: message || `你好，我是${user.name}，想和你聊聊合作的事～`,
      });

      setLastInvitation(invitation);
      setSubmitting(false);
      setResultVisible(true);
    }, 600);
  };

  const handleCloseResult = () => {
    setResultVisible(false);
    onClose();
  };

  const renderForm = () => (
    <View className={styles.mask} onClick={onClose}>
      <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>☕ 约 {targetUser.name} 线下见面</Text>
          <Text className={styles.close} onClick={onClose}>✕</Text>
        </View>

        <View className={styles.body}>
          <View className={styles.section}>
            <Text className={styles.label}>见面日期</Text>
            <View className={styles.optionRow}>
              {dateOptions.map(opt => (
                <Button
                  key={opt.key}
                  className={classnames(styles.optionItem, date === opt.key && styles.optionActive)}
                  onClick={() => setDate(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>见面时间</Text>
            <View className={styles.optionRow}>
              {timeOptions.map(opt => (
                <Button
                  key={opt.key}
                  className={classnames(styles.optionItem, time === opt.key && styles.optionActive)}
                  onClick={() => setTime(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>见面地点</Text>
            <View className={styles.locationOptions}>
              {locationOptions.map((loc, idx) => (
                <View
                key={idx}
                className={classnames(styles.locationChip, location === loc && styles.locationChipActive)}
                onClick={() => setLocation(loc)}
              >
                {loc}
              </View>
              ))}
            </View>
            <Input
              className={styles.locationInput}
              placeholder="或自定义地点（如具体地址）"
              value={locationOptions.includes(location) ? '' : location}
              onInput={(e) => setLocation(e.detail.value)}
            />
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>留言（选填）</Text>
            <Textarea
              className={styles.textarea}
              placeholder="给对方留个话，让TA更愿意赴约～"
              value={message}
              onInput={(e) => setMessage(e.detail.value)}
              maxlength={150}
            />
          </View>

          <View className={styles.tip}>
            <Text className={styles.tipText}>💡 温馨提示：建议选择公共场所见面，注意人身和财产安全</Text>
          </View>
        </View>

        <View className={styles.footer}>
          <Button className={classnames(styles.btn, styles.btnCancel)} onClick={onClose}>
            取消
          </Button>
          <Button
            className={classnames(styles.btn, styles.btnConfirm, submitting && styles.disabled)}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '发送中...' : '发送邀约'}
          </Button>
        </View>
      </View>
    </View>
  );

  const renderResult = () => (
    <View className={styles.mask} onClick={handleCloseResult}>
      <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <View className={styles.resultIcon}>✅</View>
        <Text className={styles.resultTitle}>邀约已发送</Text>
        <Text className={styles.resultSubtitle}>
          已向 {targetUser.name} 发出见面邀约
        </Text>

        <View className={styles.resultDetail}>
          <View className={styles.resultRow}>
            <Text className={styles.resultLabel}>📅 日期</Text>
            <Text className={styles.resultValue}>{lastInvitation?.date}</Text>
          </View>
          <View className={styles.resultRow}>
            <Text className={styles.resultLabel}>⏰ 时间</Text>
            <Text className={styles.resultValue}>{lastInvitation?.time}</Text>
          </View>
          <View className={styles.resultRow}>
            <Text className={styles.resultLabel}>📍 地点</Text>
            <Text className={styles.resultValue}>{lastInvitation?.location}</Text>
          </View>
          {lastInvitation?.message && (
            <View className={styles.resultRow}>
              <Text className={styles.resultLabel}>💬 留言</Text>
              <Text className={styles.resultValue}>{lastInvitation.message}</Text>
            </View>
          )}
        </View>

        <Text className={styles.resultTip}>
          等待对方确认后，你们可以在「协作中心」查看详情
        </Text>

        <View className={styles.footer}>
          <Button className={classnames(styles.btn, styles.btnConfirm, styles.btnFull)} onClick={handleCloseResult}>
            我知道了
          </Button>
        </View>
      </View>
    </View>
  );

  return resultVisible ? renderResult() : renderForm();
};

export default MeetModal;
