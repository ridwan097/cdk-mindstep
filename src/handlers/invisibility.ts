import CalculateScore from '../lib/InvisibilityEvents';

async function handler(event: any) {
  try {
    let calculate = new CalculateScore();
    switch (event.httpMethod) {
      case 'POST':
        return await calculate.register(event);
      case 'GET':
        return await calculate.get(event);
      case 'PATCH':
        return await calculate.update(event);
      //   case 'DELETE':
      //     return await calculate.calculate(event);

      default:
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: 'Not Found',
        };
    }
  } catch (e) {
    console.error(e, 'handler errors');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: e,
    };
  }
}

export default handler;
