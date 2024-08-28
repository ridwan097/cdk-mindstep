import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ICalculateScore,
  IEvent,
  IGetScoreEvent,
  IRegisterEvent,
} from '../interfaces/eventInterfaces';

import { FetchUserDataResponse, UserData } from '../interfaces/resultInterface';

export const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

export default class CalculateScore implements ICalculateScore {
  event: IEvent | undefined;
  constructor(event?: any) {
    this.event = event;
  }

  async fetchUserData() {
    const response = await fetch('https://randomuser.me/api/');
    const data = (await response.json()) as FetchUserDataResponse;
    return data.results[0];
  }

  async calculateInvisibilityScore(superheroScore: number, userData: any) {
    const genderWeighting = userData.gender === 'male' ? 5 : 8;
    const age = userData.dob.age;
    let invisibilityScore = genderWeighting * (superheroScore - age);

    invisibilityScore = Math.max(0, Math.min(100, invisibilityScore));

    let status = 'Not invisible';
    if (invisibilityScore >= 80) {
      status = 'Invisible';
    } else if (invisibilityScore >= 60) {
      status = 'Transparent';
    } else if (invisibilityScore >= 40) {
      status = 'Translucent';
    } else if (invisibilityScore >= 20) {
      status = 'Camouflage';
    }

    return {
      superheroScore,
      invisibilityScore,
      status,
    };
  }

  async saveToCsv(
    result: {
      superheroScore: number;
      invisibilityScore: number;
      status: string;
    },
    userData: UserData,
  ): Promise<string> {
    const invisibilityID = uuidv4();
    const filePath = path.join(__dirname, '..', 'invisibility_scores.csv');

    const fileExists = fs.existsSync(filePath);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      // path: '/tmp/invisibility_scores.csv',

      header: [
        { id: 'invisibilityID', title: 'Invisibility ID' },
        { id: 'superheroScore', title: 'Superhero Score' },
        { id: 'invisibilityScore', title: 'Invisibility Score' },
        { id: 'status', title: 'Invisibility Status' },
        { id: 'name', title: 'Name' },
        { id: 'gender', title: 'Gender' },
        { id: 'age', title: 'Age' },
      ],
      append: fileExists,
    });

    const record = {
      invisibilityID,
      superheroScore: result.superheroScore,
      invisibilityScore: result.invisibilityScore,
      status: result.status,
      name: `${userData.name.first} ${userData.name.last}`,
      gender: userData.gender,
      age: userData.dob.age,
    };

    await csvWriter.writeRecords([record]);
    return invisibilityID;
  }

  async register(event: IRegisterEvent) {
    try {
      const body = JSON.parse(event.body);
      const userData = await this.fetchUserData();
      const result = await this.calculateInvisibilityScore(
        body.superheroScore,
        userData,
      );
      const invisibilityID = await this.saveToCsv(result, userData);

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invisibilityID, ...result }),
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: e.message }),
      };
    }
  }

  async get(event: IGetScoreEvent) {
    try {
      const invisibilityID =
        typeof event.pathParameters === 'string'
          ? event.pathParameters
          : event.pathParameters.ScoreID;

      const records = await this.readCsv();
      const record = records?.find(
        (r: any) => r.invisibilityID === invisibilityID,
      );

      if (record) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        };
      } else {
        throw new Error('Invisibility ID not found');
      }
    } catch (e) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: e.message }),
      };
    }
  }

  async update(event: IGetScoreEvent) {
    try {
      const invisibilityID =
        typeof event.pathParameters === 'string'
          ? event.pathParameters
          : event.pathParameters.ScoreID;

      const body = JSON.parse(event.body);
      const records = await this.readCsv();
      const recordIndex = records.findIndex(
        (r: any) => r.invisibilityID === invisibilityID,
      );
      const filePath = path.join(__dirname, '..', 'invisibility_scores.csv');

      if (recordIndex !== -1) {
        const userData = await this.fetchUserData();
        const updatedResult = await this.calculateInvisibilityScore(
          body.superheroScore,
          userData,
        );
        records[recordIndex] = {
          ...records[recordIndex],
          ...updatedResult,
        };

        const csvWriter = createObjectCsvWriter({
          // path: '/tmp/invisibility_scores.csv',
          path: filePath,
          header: [
            { id: 'invisibilityID', title: 'Invisibility ID' },
            { id: 'superheroScore', title: 'Superhero Score' },
            { id: 'invisibilityScore', title: 'Invisibility Score' },
            { id: 'status', title: 'Invisibility Status' },
            { id: 'name', title: 'Name' },
            { id: 'gender', title: 'Gender' },
            { id: 'age', title: 'Age' },
          ],
        });
        await csvWriter.writeRecords(records);

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(records[recordIndex]),
        };
      } else {
        throw new Error('Invisibility ID not found');
      }
    } catch (e) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: e.message }),
      };
    }
  }

  async readCsv(): Promise<any[]> {
    const records: any[] = [];
    const filePath = path.join(__dirname, '..', 'invisibility_scores.csv');

    return new Promise((resolve, reject) => {
      // fs.createReadStream('/tmp/invisibility_scores.csv')
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => records.push(data))
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));
    });
  }
}
