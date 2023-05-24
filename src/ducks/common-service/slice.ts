import { validate as accompanyValidate } from '@/utils/validate/accompany';
import { validate as mobilityValidate } from '@/utils/validate/mobility';
import { validate as behaviorValidate } from '@/utils/validate/behavior';

import { CreateAccompanyParams, ReturnAccompany } from '../accompany/slice';
import { CreateBehaviorParams, ReturnBehavior } from '../behavior/slice';
import { CreateMobilityParams, ReturnMobility } from '../mobility/slice';
import { useCreateAccompanyMutation } from '../accompany/query';

export type RecordServiceType = ReturnAccompany | ReturnMobility | ReturnBehavior;
export type CreateRecordInitialStateType = CreateAccompanyParams | CreateBehaviorParams | CreateMobilityParams;
export type CreateRecordValidateType = typeof accompanyValidate | typeof mobilityValidate | typeof behaviorValidate;
export type CreateRecordType = any;
export type UpdateRecordType = any;

export type ContentArr = {
  work_date: number; // サービス提供日
  service_content: string; // サービス内容
  start_time: string; // 開始時間
  end_time: string; // 終了時間
  city: string; // 市区町村
  staff_name: string; // スタッフ名
};
