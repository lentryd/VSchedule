type EventData = {
  start: Date;
  end: Date;

  id: number;
  hash: number;
  color: string;

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

  static format(data: Schedule.RaspList) {
    let title = data.name.trim();
    if (data.info.type) title = data.info.type + " | " + title;

    let description = "";
    if (data.info.moduleName) description += data.info.moduleName + "\n";
    if (data.info.theme) description += data.info.theme + "\n";
    if (data.info.groupName) description += data.info.groupName + "\n";
    if (data.info.teachersNames) description += "\n" + data.info.teachersNames;
    description = description.trim();

    return {
      start: new Date(data.start),
      end: new Date(data.end),

      title,
      color: data.color,
      location: data.info.link
        ? data.info.link
        : data.info.aud
        ? data.info.aud
        : "",
      description,
    };
  }

  static getHash(data: Omit<EventData, "id" | "hash">) {
    const { start, end, color, title, location, description } = data;
    const id = hash([start.toJSON(), end.toJSON()].join("-&-"));
    const contentHash = hash(
      [title, location, description, nearestColor(color)].join("-&-")
    );

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
        .setColor(nearestColor(data.color))
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
        .setTag("EVENT_HASH", contentHash.toString())
        .setColor(nearestColor(data.color));
      item = { id: id.toString(), hash: contentHash.toString(), event };
    }

    return item;
  }

  remove(id: number) {
    this.read(id)?.event.deleteEvent();
  }
}
