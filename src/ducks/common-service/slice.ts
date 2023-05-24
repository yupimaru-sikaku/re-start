import { ReturnAccompany } from '../accompany/slice';
import { ReturnBehavior } from '../behavior/slice';
import { ReturnMobility } from '../mobility/slice';

export type ServiceType = ReturnAccompany | ReturnMobility | ReturnBehavior;

export type ContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  city: string; // 市区町村
  staff_name: string; // スタッフ名
};
