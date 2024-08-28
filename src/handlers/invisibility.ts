async function handler(event: any) {
  try {
    let invisible = {} as any;
    switch (event.httpMethod) {
      case 'POST':
        return await invisible.calculate(event);
      case 'GET':
        return await invisible.calculate(event);
      case 'PATCH':
        return await invisible.calculate(event);
      //   case 'DELETE':
      //     return await invisible.calculate(event);

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
