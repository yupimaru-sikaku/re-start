import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { calcAllWorkTime, convertTime } from '@/utils';
import { RecordServiceType } from '@/ducks/common-service/slice';

export const CreatePdf = async (pdfUrl: string, service: RecordServiceType) => {
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const notoSansBytes = await fetch('/NotoSansJP-Regular.otf').then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const notoSansFont = await pdfDoc.embedFont(notoSansBytes);

  // 年、月、名前
  const convertYear = service.year - 2018;
  const yPositionOfDate = 825;
  const infoArr = [
    { value: service.user_name, x: 292, y: 805 },
    { value: convertYear.toString(), x: 83, y: yPositionOfDate },
    { value: service.month.toString(), x: 117, y: yPositionOfDate },
  ];
  infoArr.map(({ value, x, y }) => {
    firstPage.drawText(value, {
      x: x,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });

  // 受給者証番号
  const numberArr = service.identification.split('');
  numberArr.map((value, index) => {
    firstPage.drawText(value, {
      x: 88 + index * 8.9,
      y: 800,
      size: 7,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });

  // 契約支給量

  // 日付毎の記録
  const yPositionOfContent = 694;
  const ySpanOfContent = 20.2;
  const contentArr = service.content_arr.map((content) => {
    return {
      work_date: `${content.work_date < 10 ? ' ' : ''}${content.work_date}`,
      service_content: content.service_content,
      start_time: convertTime(content.start_time),
      end_time: convertTime(content.end_time),
    };
  });
  contentArr.map((content, index) => {
    // 日付
    firstPage.drawText(content.work_date, {
      x: 34,
      y: yPositionOfContent - index * ySpanOfContent,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // サービス内容
    firstPage.drawText(content.service_content, {
      x: 88,
      y: yPositionOfContent - index * ySpanOfContent,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
      lineHeight: 6 * 1.1,
    });
    // 開始時間
    firstPage.drawText(content.start_time, {
      x: 128,
      y: yPositionOfContent - index * ySpanOfContent,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // 終了時間
    firstPage.drawText(content.end_time, {
      x: 163,
      y: yPositionOfContent - index * ySpanOfContent,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // サービス提供時間
    firstPage.drawText(content.start_time, {
      x: 232,
      y: yPositionOfContent - index * ySpanOfContent,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // サービス終了時間
    firstPage.drawText(content.end_time, {
      x: 268,
      y: yPositionOfContent - index * ySpanOfContent,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });

  // 各サービスの合計時間
  const yPositionOfAllWorkTime = 49;
  const allWorkTime = calcAllWorkTime(service.content_arr);
  firstPage.drawText(allWorkTime.toString(), {
    x: 200,
    y: yPositionOfAllWorkTime,
    size: 9,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(allWorkTime.toString(), {
    x: 307,
    y: yPositionOfAllWorkTime,
    size: 9,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // ページ数
  const yPositionOfPage = 20;
  firstPage.drawText('1', {
    x: 466,
    y: yPositionOfPage,
    size: 10,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText('1', {
    x: 523,
    y: yPositionOfPage,
    size: 10,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // 位置計算用
  // const arr = Array.from({ length: 1000 }, (_, i) => ({
  //   value: (i + 1) * 10,
  //   x: (i + 1) * 10,
  //   y: (i + 1) * 10,
  // }));
  // arr.map(({ value, x, y }) => {
  //   firstPage.drawText(value.toString(), {
  //     x: x,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }, index) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 0,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }, index) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 100,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }, index) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 200,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }, index) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 300,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }, index) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 400,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }, index) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 500,
  //     y: y,
  //     size: 10,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
