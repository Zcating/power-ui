export { default as afZA } from "./af-ZA";
export { default as ar } from "./ar";
export { default as bg } from "./bg";
export { default as ca } from "./ca";
export { default as csCZ } from "./cs-CZ";
export { default as da } from "./da";
export { default as de } from "./de";
export { default as ee } from "./ee";
export { default as el } from "./el";
export { default as en } from "./en";
export { default as eo } from "./eo";
export { default as es } from "./es";
export { default as eu } from "./eu";
export { default as fa } from "./fa";
export { default as fi } from "./fi";
export { default as fr } from "./fr";
export { default as he } from "./he";
export { default as hr } from "./hr";
export { default as hu } from "./hu";
export { default as hyAM } from "./hy-AM";
export { default as id } from "./id";
export { default as it } from "./it";
export { default as ja } from "./ja";
export { default as kg } from "./kg";
export { default as km } from "./km";
export { default as ko } from "./ko";
export { default as ku } from "./ku";
export { default as kz } from "./kz";
export { default as lt } from "./lt";
export { default as lv } from "./lv";
export { default as mn } from "./mn";
export { default as nbNO } from "./nb-NO";
export { default as nl } from "./nl";
export { default as pl } from "./pl";
export { default as ptbr } from "./pt-br";
export { default as pt } from "./pt";
export { default as ro } from "./ro";
export { default as ruRU } from "./ru-RU";
export { default as sk } from "./sk";
export { default as sl } from "./sl";
export { default as sr } from "./sr";
export { default as svSE } from "./sv-SE";
export { default as ta } from "./ta";
export { default as th } from "./th";
export { default as tk } from "./tk";
export { default as trTR } from "./tr-TR";
export { default as ua } from "./ua";
export { default as ugCN } from "./ug-CN";
export { default as uzUZ } from "./uz-UZ";
export { default as vi } from "./vi";
export { default as zhCN } from "./zh-CN";
export { default as zhTW } from "./zh-TW";

export interface LangConfig {
  colorpicker: {
    confirm: string;
    clear: string;
  };
  datepicker: {
    now: string;
    today: string;
    cancel: string;
    clear: string;
    confirm: string;
    selectDate: string;
    selectTime: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    prevYear: string;
    nextYear: string;
    prevMonth: string;
    nextMonth: string;
    year: string;
    month1: string;
    month2: string;
    month3: string;
    month4: string;
    month5: string;
    month6: string;
    month7: string;
    month8: string;
    month9: string;
    month10: string;
    month11: string;
    month12: string;
    weeks: {
      sun: string;
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
    };
    months: {
      jan: string;
      feb: string;
      mar: string;
      apr: string;
      may: string;
      jun: string;
      jul: string;
      aug: string;
      sep: string;
      oct: string;
      nov: string;
      dec: string;
    };
  };
  select: {
    loading: string;
    noMatch: string;
    noData: string;
    placeholder: string;
  };
  cascader: {
    noMatch: string;
    loading: string;
    placeholder: string;
    noData: string;
  };
  pagination: {
    goto: string;
    pagesize: string;
    total: string;
    pageClassifier: string;
  };
  messagebox: {
    title: string;
    confirm: string;
    cancel: string;
    error: string;
  };
  upload: {
    deleteTip: string;
    delete: string;
    preview: string;
    continue: string;
  };
  table: {
    emptyText: string;
    confirmFilter: string;
    resetFilter: string;
    clearFilter: string;
    sumText: string;
  };
  tree: {
    emptyText: string;
  };
  transfer: {
    noMatch: string;
    noData: string;
    titles: string[];
    filterPlaceholder: string;
    noCheckedFormat: string;
    hasCheckedFormat: string;
  };
  image: {
    error: string;
  };
  pageHeader: {
    title: string;
  };
  popconfirm: {
    confirmButtonText: string;
    cancelButtonText: string;
  };
}
