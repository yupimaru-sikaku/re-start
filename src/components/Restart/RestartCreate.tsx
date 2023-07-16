import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { CustomButton } from '@/components/Common/CustomButton';
import { Box, Checkbox, Divider, Paper, Select, SimpleGrid, Space, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { useGetUserListQuery } from '@/ducks/user/query';
import { useSelector } from '@/ducks/store';
import { useForm } from '@mantine/form';
import { createInitialState } from '@/ducks/restart/slice';
import { supabase } from '@/libs/supabase/supabase';
import { CustomConfirm } from '../Common/CustomConfirm';
import { showNotification } from '@mantine/notifications';
import { IconCheckbox, IconClock } from '@tabler/icons';
import { TimeInput, TimeRangeInput } from '@mantine/dates';
import { contentWidth, mainColor, serviceWidth, subColor, subContentWidth, subTitleWidth } from '@/pages/restart/[id]';

const YEAR_LIST = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const MONTH_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DAY_LIST = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
];
const USER_LIST = [
  '和田　伸也',
  '山田　陽介',
  '白江　淑造',
  '西村　千香',
  '山口　英樹',
  '梶本　美帆',
  '梶本　宏行',
  '梶本　涼斗',
  '山田　真弓',
  '樽本　暦',
  '永海　美幸',
  '國政　寛子',
  '古定　未佳',
  '山内　理恵',
  '湯淺　まり子',
  '芹澤　洋太',
  '村上　誠一',
  '湊　理華',
  '清水　瑛梨樺',
  '葛迫　一富美',
  '上田　恭輔',
  '御手洗　政信',
  '玉置　徹',
  '洞　典明',
  '竹山　まり',
  '中村　圭吾',
  '寺岡　賢一',
  '香田　典之',
  '菊田　和伸',
  '後藤　暁',
  '中井　耕太',
  '斎藤　確',
  '田川　聡太',
  '北野　新',
  '福原　寛善',
  '福島　麻希江',
];
const STAFF_LIST = [
  '石山　詩織',
  '布谷　和枝',
  '中本　皓斗',
  '吉田　一貴',
  '田中　秋水',
  '山田　正和',
  '山田　美樹',
  '清水　麻衣',
  '小松　賢治',
  '南方　陵',
  '下中　大陽',
  '稲津　春美',
  '山田　一樹',
  '澤本　拓也',
  '三宅　大貴',
  '中田　一成',
  '中井　健太',
  '鹿津　達也',
  '曾我部　拓磨',
  '宮井　美佳',
  '八木　俊之',
  '河崎　禎信',
  '宮里　康和',
  '山中　啓輔',
  '上田　瞳',
  '中島　翔子',
  '田中　慶',
  '田中　寿子',
  '大迫　優希',
  '松永　幸貴',
  '山口　匠吾',
  '望戸　賢一',
  '伊藤　孝仁',
  '前　仁寿',
  '中山　洋平',
  '森口　愛子',
  '永尾　享春',
  '宮崎　由香',
  '中野　美波',
  '廣島　達也',
  '権藤　伸子',
  '宮里　美代子',
  '三野　貴文',
];
const SERVICE_CONTENT_LIST = [
  '行動援護',
  '同行援護',
  '移動支援',
  '居宅介護_家事援助',
  '居宅介護_身体介護',
  '居宅介護_通院等介助（伴う）',
  '居宅介護_通院等介助（伴わない）',
];

export const CHECK_LIST = [
  { name: 'トイレ介助', order: 0 },
  { name: 'Pトイレ介助', order: 1 },
  { name: 'おむつ交換', order: 2 },
  { name: 'パッド交換', order: 3 },
  { name: '汚れた衣服やリネン等の交換処理', order: 4 },
  { name: '陰部・臀部の清掃・洗浄', order: 5 },
  { name: '排尿・尿処理', order: 6 },
  { name: '排便', order: 7 },
  { name: '姿勢の確保', order: 8 },
  { name: 'メニュー・材料の説明', order: 9 },
  { name: '摂食介助', order: 10 },
  { name: '食事量：完食・残量（   /   ）', order: 11 },
  { name: '水分補給（        cc ）', order: 12 },
  { name: '清拭（全身・部分）', order: 13 },
  { name: '洗髪', order: 14 },
  { name: '全身浴（入浴・シャワー浴）', order: 15 },
  { name: '洗面', order: 16 },
  { name: '口腔ケア', order: 17 },
  { name: '整容（爪・耳・髭・髪・化粧）', order: 18 },
  { name: '更衣介助', order: 19 },
  { name: '体位変換', order: 20 },
  { name: '移乗介助', order: 21 },
  { name: '移動介助', order: 22 },
  { name: '外出準備介助', order: 23 },
  { name: '帰宅受入介助', order: 24 },
  { name: '通院介助', order: 25 },
  { name: '買い物介助', order: 26 },
  { name: '起床介助', order: 27 },
  { name: '就寝介助', order: 28 },
  { name: '服薬介助・確認・補充', order: 29 },
  { name: '薬の塗布', order: 30 },
  { name: '共に行う（調理・清掃・洗濯・衣類整理）', order: 31 },
  { name: '声かけと見守り（入浴・更衣・移動）', order: 32 },
  { name: '買い物援助', order: 33 },
  { name: '居室', order: 34 },
  { name: 'トイレ', order: 35 },
  { name: '卓上', order: 36 },
  { name: '台所', order: 37 },
  { name: '浴室', order: 38 },
  { name: '寝室', order: 39 },
  { name: '廊下', order: 40 },
  { name: '洗濯', order: 41 },
  { name: '乾燥（物干し）', order: 42 },
  { name: '取入れ・収納', order: 43 },
  { name: 'アイロン', order: 44 },
  { name: '下拵え', order: 45 },
  { name: '調理', order: 46 },
  { name: '配・下膳', order: 47 },
];

type Props = {
  type: 'create' | 'edit';
};

export const RestartCreate: FC<Props> = ({ type }) => {
  const currentDate = new Date();
  const router = useRouter();
  const TITLE = type === 'create' ? '登録' : '更新';
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const isOK = await CustomConfirm(`記録票を作成しますか？\n利用者の方に確認を取ってください。`, '確認画面');
    if (!isOK) {
      setIsLoading(false);
      return;
    }
    try {
      const { error } = await supabase.from('restart').insert({
        user_name: form.values.user_name,
        staff_name: form.values.staff_name,
        year: form.values.year,
        month: form.values.month,
        day: form.values.day,
        start_time: form.values.start_time.toLocaleString(),
        end_time: form.values.end_time.toLocaleString(),
        service_content: form.values.service_content,
        check_list: form.values.check_list,
        comment: form.values.comment,
      });
      if (error) throw new Error('登録に失敗しました。');

      showNotification({
        icon: <IconCheckbox />,
        message: `登録に成功しました！`,
      });
      router.push('/restart');
    } catch (err: any) {
      await CustomConfirm(err, 'Caution');
      // await CustomConfirm(err.message, 'Caution');
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const form = useForm({
    initialValues: {
      ...createInitialState,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    },
  });

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, order: number) => {
    const oldList = form.values.check_list;
    const newList = e.currentTarget.checked ? [...oldList, order] : oldList.filter((list) => list !== order);
    form.setFieldValue('check_list', newList);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
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
            <Select
              label="利用者名"
              required={true}
              searchable
              nothingFound="No Data"
              data={USER_LIST.map((user) => ({
                value: user,
                label: user,
              }))}
              variant="filled"
              {...form.getInputProps('user_name')}
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
            <Select
              label="担当ヘルパー"
              required={true}
              searchable
              nothingFound="No Data"
              data={STAFF_LIST.map((staff) => ({
                value: staff,
                label: staff,
              }))}
              variant="filled"
              {...form.getInputProps('staff_name')}
            />
          </Box>
        </Box>
        <Space h="xl" />
        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid' }}>
          <Text
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: serviceWidth,
              borderRight: '1px solid',
              backgroundColor: mainColor,
              color: 'white',
              fontWeight: 'bold',
              height: '61px',
            }}
          >
            サービス実施日時
          </Text>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '270px', gap: 10, marginLeft: 10 }}>
            <Select
              label="西暦"
              required={true}
              searchable
              nothingFound="No Data"
              data={YEAR_LIST.map((year) => ({
                value: year,
                label: year.toString(),
              }))}
              variant="filled"
              {...form.getInputProps('year')}
            />
            <Select
              label="月"
              required={true}
              searchable
              nothingFound="No Data"
              data={MONTH_LIST.map((month) => ({
                value: month,
                label: month.toString(),
              }))}
              variant="filled"
              {...form.getInputProps('month')}
            />
            <Select
              label="日"
              required={true}
              searchable
              nothingFound="No Data"
              data={DAY_LIST.map((day) => ({
                value: day,
                label: day.toString(),
              }))}
              variant="filled"
              {...form.getInputProps('day')}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '400px', gap: 10, marginLeft: 10 }}>
            <TimeInput
              required
              label="開始時間"
              icon={<IconClock size={16} />}
              variant="filled"
              {...form.getInputProps('start_time')}
            />
            <TimeInput
              required
              label="終了時間"
              icon={<IconClock size={16} />}
              variant="filled"
              {...form.getInputProps('end_time')}
            />
            <Select
              label="サービスの種類"
              required={true}
              searchable
              nothingFound="No Data"
              data={SERVICE_CONTENT_LIST.map((service_content) => ({
                value: service_content,
                label: service_content,
              }))}
              variant="filled"
              {...form.getInputProps('service_content')}
            />
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
          <Text>身体介護</Text>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>排泄</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(0, 8).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>食事</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(8, 13).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>清拭・入浴</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(13, 16).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>身体整容</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(16, 20).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>移動</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(20, 27).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>起床就寝</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(27, 29).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>服薬その他</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(29, 31).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>自立支援</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(31, 34).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
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
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>洗濯</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(41, 45).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', border: '1px solid', borderTop: 'none' }}>
          <Text sx={{ width: subTitleWidth, borderRight: '1px solid', backgroundColor: subColor }}>調理</Text>
          <Box sx={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: subContentWidth, padding: 5 }}>
            {CHECK_LIST.slice(45, 48).map((content) => (
              <Checkbox
                key={content.order}
                value={content.order}
                label={content.name}
                onChange={(e) => handleCheck(e, content.order)}
              />
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
          <Textarea
            sx={{ width: '100%' }}
            required={true}
            variant="filled"
            autosize
            minRows={5}
            {...form.getInputProps('comment')}
          />
          {/* <Text sx={{ textAlign: 'center', margin: '0 auto' }}>{restartData.comment}</Text> */}
        </Box>
        <Box>
          <Text color="gray">※介護者には守秘義務があります。この日誌は適正に管理し、業務以外に使用することはありません。</Text>
        </Box>
        <Space h="xl" />
        <CustomButton type="submit" fullWidth loading={isLoading}>
          {TITLE}
        </CustomButton>
      </Paper>
    </form>
  );
};
