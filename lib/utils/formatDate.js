import date_format from "date-format";
export const dateNowDataBase = (is_, date) => {
    if (is_) {
        return date_format("yyyy-MM-dd hh:mm:ss", date || new Date());
    }
    return date_format("yyyy/MM/dd hh:mm:ss", date || new Date());
};
export const dateNowByHour = (time, date = new Date(), sumDay = false) => {
    if (sumDay) return `${sumDate(sumDay, date)} ${time}`;
    return date_format(`yyyy-MM-dd ${time}`, date);
};