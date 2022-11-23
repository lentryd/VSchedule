function doGet() {
  return HtmlService.createTemplateFromFile("web/app").evaluate();
}
function include(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function init(login: string, password: string) {
  const properties = PropertiesService.getUserProperties();
  const trigger = ScriptApp.getProjectTriggers().find(
    (t) => t.getUniqueId() === properties.getProperty("TRIGGER_ID")
  );
  if (trigger) ScriptApp.deleteTrigger(trigger);

  if (login && password) {
    properties.setProperty("USERNAME", login);
    properties.setProperty("PASSWORD", password);
  } else if (!properties.getProperty("AUTH_TOKEN")) {
    throw new Error("Не указаны логин и пароль");
  }

  const edu = new Wrapper();
  if (!edu.logIn()) return;

  const triggerId = ScriptApp.newTrigger("triggerManager")
    .timeBased()
    .everyMinutes(5)
    .create()
    .getUniqueId();
  properties.setProperty("TRIGGER_ID", triggerId);
}
function needAuth() {
  return !PropertiesService.getUserProperties().getProperty("AUTH_TOKEN");
}
function triggerManager() {
  const now = new Date();
  const properties = PropertiesService.getUserProperties();
  let lastUpdate = new Date(properties.getProperty("LAST_UPDATE"));
  if (!lastUpdate.getTime()) lastUpdate = new Date(0);

  if (
    (now.getHours() >= 6 && now.getHours() < 18) ||
    now.getTime() - lastUpdate.getTime() >= 1.8e6
  ) {
    parseSchedule();
    properties.setProperty("LAST_UPDATE", now.toJSON());
  }
}

function parseSchedule() {
  const edu = new Wrapper();
  const calendar = new VCalendar();

  const schedule = edu
    .schedule()
    .filter(
      ({ start }) =>
        new Date(start).getTime() >= VCalendar.range().start.getTime()
    )
    .map(VCalendar.format);

  const allEvents = calendar.all();
  const allIds = schedule.map((data) => VCalendar.getHash(data).id.toString());
  allEvents.forEach((item) => {
    if (!item.id || !allIds.includes(item.id)) item.event.deleteEvent();
  });

  schedule.forEach((data) => calendar.write(data));
}
