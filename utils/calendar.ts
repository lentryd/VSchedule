type EventData = {
  start: Date;
  end: Date;

  id: number;
  hash: number;

  title: string;
  location: string;
  description: string;
};

function hash(data: string) {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const chr = data.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

class VCalendar {
  private _calendar: GoogleAppsScript.Calendar.Calendar;

  static range() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setMonth(start.getMonth() + 2);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  static getHash(data: Omit<EventData, "id" | "hash">) {
    const { start, end, title, location, description } = data;
    const id = hash([start.toJSON(), end.toJSON()].join("-&-"));
    const contentHash = hash([title, location, description].join("-&-"));

    return { id, contentHash };
  }

  constructor() {
    const properties = PropertiesService.getUserProperties();
    let calendarId = properties.getProperty("CALENDAR_ID");

    if (!calendarId) {
      calendarId = CalendarApp.createCalendar("Edu Schedule", {
        color: "#4285f4",
        summary: "Расписание занятий",
        location: "https://edu.donstu.ru/WebApp/#/RaspManager/Calendar",
      }).getId();
      properties.setProperty("CALENDAR_ID", calendarId);
    }

    this._calendar = CalendarApp.getCalendarById(calendarId);
  }

  all() {
    return this._calendar
      .getEvents(VCalendar.range().start, VCalendar.range().end)
      .map((e) => ({
        id: e.getTag("EVENT_ID"),
        hash: e.getTag("EVENT_HASH"),
        event: e,
      }));
  }

  read(id: number | string) {
    const data = this._calendar
      .getEvents(VCalendar.range().start, VCalendar.range().end)
      .find((e) => e.getTag("EVENT_ID") === id.toString());

    return !data
      ? undefined
      : {
          id: data.getTag("EVENT_ID"),
          hash: data.getTag("EVENT_HASH"),
          event: data,
        };
  }

  write(data: Omit<EventData, "id" | "hash">) {
    const { id, contentHash } = VCalendar.getHash(data);
    let item = this.read(id);
    if (item?.hash == contentHash.toString()) return item;

    if (item) {
      item.event
        .setTitle(data.title)
        .setLocation(data.location)
        .setDescription(data.description)
        .setTag("EVENT_HASH", contentHash.toString());
    } else {
      let event = this._calendar
        .createEvent(data.title, data.start, data.end, {
          location: data.location,
          description: data.description,
        })
        .setTag("EVENT_ID", id.toString())
        .setTag("EVENT_HASH", contentHash.toString());
      item = { id: id.toString(), hash: contentHash.toString(), event };
    }

    return item;
  }

  remove(id: number) {
    this.read(id)?.event.deleteEvent();
  }
}