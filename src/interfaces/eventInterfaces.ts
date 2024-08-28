export interface ICalculateScore {
  register(event: IRegisterEvent): Promise<IResolve | IReject>;
  get(event: IGetScoreEvent): Promise<IResolve | IReject>;
  update(event: IGetScoreEvent): Promise<IResolve | IReject>;
}

export interface IEvent {
  httpMethod?: 'POST' | 'GET' | 'PATCH';
  body?: any;
  queryStringParameters?: any;
  pathParameters?: any;
}
export interface IResolve {
  statusCode: number;
  headers?: any;
  body?: string;
}
export interface IReject {
  statusCode: number;
  headers?: any;
}

export interface IRegisterEvent extends IEvent {
  body: string;
}

export interface IGetScoreEvent extends IEvent {
  pathParameters: { ScoreID: string } | string;
}
