declare module AuthData {
  export interface Data2 {
    userName: string;
    requertAt: string;
    accessToken: string;
    uid_1c: string;
    id: number;
  }
  export interface Data {
    state: number;
    msg?: any;
    data: Data2;
    accessToken: string;
    requertAt: number;
    expiresIn: number;
  }
  export interface RootObject {
    data: Data;
    state: number;
    msg: string;
  }
}

declare module Periods {
  export interface TypePeriod {
    typeID: number;
    name: string;
    workName?: any;
    forTeachers?: boolean;
  }

  export interface Activity {
    activityID: number;
    name: string;
    description: string;
    category: string;
    link: string;
    parentID: number;
    order?: number;
    dateStart?: any;
    dateEnd?: any;
    isDelete: boolean;
    enabledByDefault: boolean;
    workName: string;
  }

  export interface Data {
    periodizations: any[];
    courses: number[];
    typePeriods: TypePeriod[];
    activities: Activity[];
    years: string[];
  }

  export interface RootObject {
    data: Data;
    state: number;
    msg: string;
  }
}

declare module Schedule {
  export interface Group {
    name: string;
    groupID: number;
    raspItemID?: any;
  }

  export interface Teacher {
    fullName: string;
    name: string;
    email: string;
    number?: any;
    userID: number;
    teacherID: number;
    raspItemID?: any;
  }

  export interface Info {
    moduleName: string;
    categoryID: number;
    moduleID: number;
    moduleDisID: number;
    theme: string;
    aud: string;
    link: string;
    teacher?: any;
    teacherName?: any;
    teacherFullName?: any;
    teacherEmail?: any;
    teacherNumberMobile?: any;
    photoPath?: any;
    teacherID?: any;
    userID?: any;
    raspItemID: number;
    timeZanID: number;
    teachersNames: string;
    groupName: string;
    groups: Group[];
    teachers: Teacher[];
    groupID: number;
    typeID: number;
    educationSpaceID: number;
    studentsCount: number;
    course: number;
    type: string;
    courses: number[];
    journalFilled: boolean;
  }

  export interface RaspList {
    name: string;
    color: string;
    bordered: boolean;
    start: Date;
    end: Date;
    timeStart?: any;
    timeEnd?: any;
    info: Info;
    groupsIDs: number[];
    teachersIDs: number[];
    raspItemsIDs: number[];
    hide: boolean;
  }

  export interface Data {
    raspList: RaspList[];
    allowEdit: boolean;
    showExportButton: boolean;
    isRaspDisp: boolean;
    userCategories: any[];
  }

  export interface RootObject {
    data: Data;
    state: number;
    msg: string;
  }
}

class Wrapper {
  private userName: string;
  private password: string;
  private _properties: GoogleAppsScript.Properties.Properties;

  constructor() {
    this._properties = PropertiesService.getUserProperties();

    const userName = this._properties.getProperty("USERNAME");
    const password = this._properties.getProperty("PASSWORD");
    if (!userName || !password) throw new Error("Login or password is not set");

    this.userName = userName;
    this.password = password;
  }

  logIn() {
    const request = Client.post("https://edu.donstu.ru/api/tokenauth", {
      contentType: "application/json",
      payload: JSON.stringify({
        userName: this.userName,
        password: this.password,
      }),
    });

    if (request.getResponseCode() !== 200) throw new Error("Login failed");

    const data = JSON.parse(request.getContentText()) as AuthData.RootObject;
    this._properties.setProperty("AUTH_TOKEN", data.data.accessToken);
    return true;
  }

  sessionValidate() {
    const request = Client.get("https://edu.donstu.ru/api/tokenauth", {
      muteHttpExceptions: true,
    });

    return request.getResponseCode() === 200;
  }

  year() {
    const request = Client.get(
      "https://edu.donstu.ru/api/SchoolX/Admin/Periods?now=true&educationSpaceID=4"
    );
    const data = JSON.parse(request.getContentText()) as Periods.RootObject;
    const years = data.data.years;

    return years[years.length - 1];
  }

  schedule() {
    if (!this.sessionValidate()) this.logIn();

    const year = this.year();
    const mouth = new Date().getMonth() + 1;

    const request = Client.get(
      `https://edu.donstu.ru/api/RaspManager?educationSpaceID=4&month=${mouth}&year=${year}`
    );
    const data = JSON.parse(request.getContentText()) as Schedule.RootObject;
    const request1 = Client.get(
      `https://edu.donstu.ru/api/RaspManager?educationSpaceID=4&month=${
        mouth + 1
      }&year=${year}`
    );
    const data1 = JSON.parse(request1.getContentText()) as Schedule.RootObject;

    return [...data.data.raspList, ...data1.data.raspList];
  }
}
