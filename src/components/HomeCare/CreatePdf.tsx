// createPdf.js
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { ReturnHomeCare } from '@/ducks/home-care/slice';
import {
  calcEachWorkTime,
  convertTime,
  formatServiceContent,
} from '@/utils';

export const CreatePdf = async (
  pdfUrl: string,
  homeCare: ReturnHomeCare
) => {
  const existingPdfBytes = await fetch(pdfUrl).then((res) =>
    res.arrayBuffer()
  );
  const notoSansBytes = await fetch('/NotoSansJP-Regular.otf').then(
    (res) => res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit); // Register fontkit instance
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const notoSansFont = await pdfDoc.embedFont(notoSansBytes);
  const textSize = 24;
  const text = `名前: ${name}`;
  const textWidth = notoSansFont.widthOfTextAtSize(text, textSize);

  const fontSize = 10;
  // 年、月、名前
  const convertYear = homeCare.year! - 2018;
  const infoArr = [
    { value: homeCare.name, x: 285, y: 810 },
    { value: convertYear.toString(), x: 71, y: 827 },
    { value: homeCare.month!.toString(), x: 107, y: 827 },
  ];
  infoArr.map(({ value, x, y }) => {
    firstPage.drawText(value, {
      x: x,
      y: y,
      size: fontSize,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  // 契約支給量
  const serviceArr = [
    { value: homeCare.amount_title_1 || '', x: 82, y: 783 },
    {
      value: homeCare.amount_value_1
        ? homeCare.amount_value_1.toString()
        : '',
      x: 268,
      y: 783,
    },
    { value: homeCare.amount_title_2 || '', x: 82, y: 771 },
    {
      value: homeCare.amount_value_2
        ? homeCare.amount_value_2.toString()
        : '',
      x: 268,
      y: 771,
    },
    { value: homeCare.amount_title_3 || '', x: 82, y: 759 },
    {
      value: homeCare.amount_value_3
        ? homeCare.amount_value_3.toString()
        : '',
      x: 268,
      y: 759,
    },
  ];
  serviceArr.map(({ value, x, y }) => {
    firstPage.drawText(value, {
      x: x,
      y: y,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });

  // 受給者証番号
  const numberArr = homeCare.identification.split('');
  numberArr.map((value, index) => {
    firstPage.drawText(value, {
      x: 82 + index * 8.2,
      y: 807,
      size: 7,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });

  // 日付毎の記録
  const contentArr = homeCare.content_arr.map((content) => {
    return {
      work_date: `${
        content.work_date! < 10 ? ' ' : ''
      }${content.work_date!}`,
      service_content: formatServiceContent(content.service_content),
      start_time: convertTime(content.start_time!),
      end_time: convertTime(content.end_time!),
    };
  });
  contentArr.map((content, index) => {
    // 日付
    firstPage.drawText(content.work_date, {
      x: 26,
      y: 698 - index * 18.1,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // サービス内容
    firstPage.drawText(content.service_content, {
      x:
        content.service_content === '家事援助' ||
        content.service_content === '身体介護'
          ? 77
          : 75,
      y:
        content.service_content === '家事援助' ||
        content.service_content === '身体介護'
          ? 699 - index * 18.1
          : 702 - index * 18.1,
      size: 5,
      font: notoSansFont,
      color: rgb(0, 0, 0),
      lineHeight: 6 * 1.1,
    });
    // 開始時間
    firstPage.drawText(content.start_time, {
      x: 111,
      y: 698 - index * 18.1,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // 終了時間
    firstPage.drawText(content.end_time, {
      x: 143,
      y: 698 - index * 18.1,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // サービス提供時間
    firstPage.drawText(content.start_time, {
      x: 226,
      y: 698 - index * 18.1,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
    // サービス終了時間
    firstPage.drawText(content.end_time, {
      x: 260,
      y: 698 - index * 18.1,
      size: 8,
      font: notoSansFont,
      color: rgb(0, 0, 0),
    });
  });
  // 各サービスの合計時間
  const { kaziAmount, shintaiAmount, withTsuinAmount, tsuinAmount } =
    calcEachWorkTime(homeCare.content_arr);
  firstPage.drawText(kaziAmount.toString(), {
    x:
      kaziAmount.length === 4
        ? 157
        : kaziAmount.length === 3
        ? 158
        : kaziAmount.length === 2
        ? 161
        : 163,
    y: 73,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(shintaiAmount.toString(), {
    x:
      shintaiAmount.length === 4
        ? 157
        : shintaiAmount.length === 3
        ? 158
        : shintaiAmount.length === 2
        ? 161
        : 163,
    y: 110,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(withTsuinAmount.toString(), {
    x:
      withTsuinAmount.length === 4
        ? 157
        : withTsuinAmount.length === 3
        ? 158
        : withTsuinAmount.length === 2
        ? 161
        : 163,
    y: 92,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(tsuinAmount.toString(), {
    x:
      tsuinAmount.length === 4
        ? 157
        : tsuinAmount.length === 3
        ? 158
        : tsuinAmount.length === 2
        ? 161
        : 163,
    y: 55,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(kaziAmount.toString(), {
    x:
      kaziAmount.length === 4
        ? 275
        : kaziAmount.length === 3
        ? 276
        : kaziAmount.length === 2
        ? 277
        : 281,
    y: 73,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(shintaiAmount.toString(), {
    x:
      shintaiAmount.length === 4
        ? 275
        : shintaiAmount.length === 3
        ? 276
        : shintaiAmount.length === 2
        ? 277
        : 281,
    y: 110,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(withTsuinAmount.toString(), {
    x:
      withTsuinAmount.length === 4
        ? 275
        : withTsuinAmount.length === 3
        ? 276
        : withTsuinAmount.length === 2
        ? 277
        : 281,
    y: 92,
    size: 8,
    font: notoSansFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(tsuinAmount.toString(), {
    x:
      tsuinAmount.length === 4
        ? 275
        : tsuinAmount.length === 3
        ? 276
        : tsuinAmount.length === 2
        ? 277
        : 281,
    y: 55,
    size: 8,
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
  //     size: fontSize,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });
  // arr.map(({ value, x, y }) => {
  //   firstPage.drawText(value.toString(), {
  //     x: 0,
  //     y: y,
  //     size: fontSize,
  //     font: notoSansFont,
  //     color: rgb(0, 0, 0),
  //   });
  // });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
