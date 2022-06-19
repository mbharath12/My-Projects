import moment from "moment-timezone";

export class Timezone {
  convertDateToGivenTimezone(date: string, timeZone: string) {
    const convertedDate = moment.tz(date, timeZone).format();
    return convertedDate;
  }
}

export const timeZone = new Timezone();
