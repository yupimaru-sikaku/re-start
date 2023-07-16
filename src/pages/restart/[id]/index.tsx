import { RestartDashboardLayout } from '@/components/Layout/DashboardLayout/RestartDashboardLayout';
import { CHECK_LIST } from '@/components/Restart/RestartCreate';
import { ReturnRestart } from '@/ducks/restart/slice';
import { useAuth } from '@/hooks/auth/useAuth';
import { supabase } from '@/libs/supabase/supabase';
import { Box, Checkbox, Paper, Space, Text, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export const contentWidth = 900;
export const serviceWidth = 150;
export const subTitleWidth = 100;
export const subContentWidth = 800;
export const mainColor = '#228BE6';
export const subColor = '#D0EBFF';

const RestartIdPage = () => {
  useAuth();

  const router = useRouter();
  const restartId = router.query.id;

  const [restartData, setRestartData] = useState<ReturnRestart>();

  useEffect(() => {
    const restartData = async () => {
      const { data } = (await supabase.from('restart').select('*').eq('id', restartId).single()) as any;
      if (!data) return;
      setRestartData(data);
    };
    restartData();
  }, [restartData, restartId]);

  if (!restartData) {
    return <>ローディング中</>;
  }

  const startDate = new Date(restartData.start_time);
  const startDateTimeHour = startDate.getHours();
  const startDateTimeMinute = startDate.getMinutes();
  const endDate = new Date(restartData.end_time);
  const endDateTimeHour = endDate.getHours();
  const endDateTimeMinute = endDate.getMinutes();

  const isChecked = (index: number) => {
    return restartData.check_list.includes(index);
  };

  return (
    <RestartDashboardLayout title="実施記録表">
      <Paper p={10} sx={{ width: contentWidth, overflow: 'auto', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', gap: 30 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '300px', justifyContent: 'space-between' }}>
            <Text
              sx={{
                backgroundColor: mainColor,
                width: '100%',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              サービス実施記録
            </Text>
            <TextInput
              label="お名前"
              variant="unstyled"
              value={restartData.user_name}
              rightSection={<Text>様</Text>}
              styles={{ input: { textAlign: 'center' } }}
              sx={{ borderBottom: '1px solid' }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
            <TextInput
              label="事業所名"
              value="リスタート"
              variant="unstyled"
              sx={{ borderBottom: '1px solid' }}
              styles={{ input: { textAlign: 'center' } }}
            />
            <TextInput
              label="担当ヘルパー"
              value={restartData.staff_name}
              variant="unstyled"
              sx={{ borderBottom: '1px solid' }}
              styles={{ input: { textAlign: 'center' } }}
            />
          </Box>
        </Box>
        <Space h="xl" />
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid' }}>
          <Text
            sx={{
              width: serviceWidth,
              borderRight: '1px solid',
              backgroundColor: mainColor,
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            サービス実施日時
          </Text>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '250px', borderRight: '1px solid' }}>
            <Text>　{`${restartData.year}　年　${restartData.month}　月　${restartData.day}　日`}</Text>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '350px', borderRight: '1px solid' }}>
            <Text>
              　{`${startDateTimeHour}　時　${startDateTimeMinute}　分　〜　${endDateTimeHour}　時　${endDateTimeMinute}　分`}
            </Text>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Text>　利用者確認</Text>
            <Checkbox size="xs" checked sx={{ display: 'flex', alignItems: 'center' }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: serviceWidth, borderRight: '1px solid', backgroundColor: subColor }}>サービスの種類</Text>
          <Text sx={{ width: 'auto', margin: '0 auto' }}>{restartData.service_content}</Text>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '5px',
            backgroundColor: mainColor,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          <Text>身体介護</Text>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>排泄</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(0, 8).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>食事</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(8, 13).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>清拭・入浴</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(13, 16).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>身体整容</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(16, 20).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>移動</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(20, 27).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>起床就寝</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(27, 29).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>服薬その他</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(29, 31).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>自立支援</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(31, 34).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '5px',
            backgroundColor: mainColor,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          <Text>生活援助</Text>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>清掃</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(34, 41).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>洗濯</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(41, 45).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>調理</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(45, 48).map((content) => (
              <Checkbox key={content.order} label={content.name} checked={isChecked(content.order)} readOnly />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '5px',
            backgroundColor: mainColor,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          <Text>特記・連絡事項</Text>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ textAlign: 'center', margin: '0 auto' }}>{restartData.comment}</Text>
        </Box>
        <Box>
          <Text color="gray">※介護者には守秘義務があります。この日誌は適正に管理し、業務以外に使用することはありません。</Text>
        </Box>
      </Paper>
    </RestartDashboardLayout>
  );
};

export default RestartIdPage;
