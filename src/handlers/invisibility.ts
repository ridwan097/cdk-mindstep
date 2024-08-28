import CalculateScore from '../lib/InvisibilityEvents';

async function handler(event: any) {
  try {
    const calculate = new CalculateScore();

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
          body: JSON.stringify({ message: 'Method not found' }),
        };
    }
  } catch (e) {
    console.error(e, 'handler errors');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: e.toString(),
    };
  }
}

export default handler;
