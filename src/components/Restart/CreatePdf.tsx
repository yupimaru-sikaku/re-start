import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { calcAllWorkTime, convertTime } from '@/utils';
import { RecordServiceType } from '@/ducks/common-service/slice';

export const CreatePdf = async (pdfUrl: string, service: any) => {
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const notoSansBytes = await fetch('/NotoSansJP-Regular.otf').then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const notoSansFont = await pdfDoc.embedFont(notoSansBytes);

  // 事業所名
  firstPage.drawText('リスタート', {
    x: 295,
    y: 620,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // お名前
  firstPage.drawText(service.user_name, {
    x: 90,
    y: 590,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // 年月時間
  firstPage.drawText(service.year.toString(), {
    x: 148,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(service.month.toString(), {
    x: 190,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(service.day.toString(), {
    x: 225,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  const startTime = new Date(service.start_time);
  const endTime = new Date(service.end_time);
  const startHour = startTime.getHours();
  const startMinute = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinute = endTime.getMinutes();
  firstPage.drawText(startHour.toString(), {
    x: 260,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(startMinute.toString(), {
    x: 292,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(endHour.toString(), {
    x: 347,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(endMinute.toString(), {
    x: 380,
    y: 556,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // サービスの種類
  firstPage.drawText(service.service_content.toString(), {
    x: 265,
    y: 536,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // コメント
  let comment: string = 'ああああああああああああああああああああああああああああああああああああああああああああああああああ';
  // if (comment.length)
  firstPage.drawText(comment.toString(), {
    x: 95,
    y: 225,
    size: 11,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });

  // 位置計算用
  const arr = Array.from({ length: 1000 }, (_, i) => ({
    value: (i + 1) * 10,
    x: (i + 1) * 10,
    y: (i + 1) * 10,
  }));
  arr.map(({ value, x, y }) => {
    firstPage.drawText(value.toString(), {
      x: x,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  arr.map(({ value, x, y }, index) => {
    firstPage.drawText(value.toString(), {
      x: 0,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  arr.map(({ value, x, y }, index) => {
    firstPage.drawText(value.toString(), {
      x: 100,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  arr.map(({ value, x, y }, index) => {
    firstPage.drawText(value.toString(), {
      x: 200,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  arr.map(({ value, x, y }, index) => {
    firstPage.drawText(value.toString(), {
      x: 300,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  arr.map(({ value, x, y }, index) => {
    firstPage.drawText(value.toString(), {
      x: 400,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  arr.map(({ value, x, y }, index) => {
    firstPage.drawText(value.toString(), {
      x: 500,
      y: y,
      size: 10,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
