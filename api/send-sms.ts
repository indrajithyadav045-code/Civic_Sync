export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { numbers, message, apiKey } = req.body || {};

  if (!numbers || !numbers.length || !message) {
    return res.status(400).json({ error: 'Missing numbers or message payload' });
  }

  // Clean numbers to 10-digit Indian format
  const cleanNumbersList = numbers
    .map((num: string) => num.replace(/[^0-9]/g, '').slice(-10))
    .filter((num: string) => num.length === 10);

  if (!cleanNumbersList.length) {
    return res.status(400).json({ error: 'No valid 10-digit mobile numbers provided' });
  }

  const numbersString = cleanNumbersList.join(',');
  const fast2SmsKey = apiKey || process.env.FAST2SMS_API_KEY;

  if (!fast2SmsKey) {
    return res.status(200).json({
      success: true,
      mode: 'SIMULATED_GATEWAY',
      message: 'Simulated dispatch successful. To send real SMS to mobile carriers, add your Fast2SMS API Key.',
      dispatchedNumbers: cleanNumbersList,
      payload: message
    });
  }

  try {
    const fast2SmsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': fast2SmsKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: message.slice(0, 150),
        language: 'english',
        flash: 0,
        numbers: numbersString
      })
    });

    const data = await fast2SmsResponse.json();
    return res.status(200).json({
      success: data.return === true,
      provider: 'Fast2SMS',
      raw: data,
      dispatchedNumbers: cleanNumbersList
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to connect to SMS Gateway',
      details: error?.message
    });
  }
}
