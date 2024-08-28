export interface UserData {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  dob: {
    date: string;
    age: number;
  };
}

export interface FetchUserDataResponse {
  results: UserData[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}
