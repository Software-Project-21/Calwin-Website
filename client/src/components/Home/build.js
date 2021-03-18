export default function buildCalendar(val) {

    const startDay = val.clone().startOf("month").startOf("week");
    const endDay = val.clone().endOf("month").endOf("week");
    var cal = [];
    const _date = startDay.clone().subtract(1, "day");
    while (_date.isBefore(endDay, "day")) {
        cal.push(
            Array(7)
            .fill(0)
            .map(() => _date.add(1, "day").clone())
        );
    }
    return cal;
}