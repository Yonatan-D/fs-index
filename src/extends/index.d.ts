import 'express';

interface GlobalData {
  get(key: string): any;
}

interface MyAPI {
  GlobalData: GlobalData;
  Logger(req: Request, res: Response, message: string): void;
  Throw(message: string, code: number): void;
}

declare module 'express' {
  export interface Application {
    MyAPI: MyAPI;
  }
}