const DEFAULT_FAST2SMS_KEY = '5dRD9qetgpHxIPhNBKMoTG1i62SFfr4OWbE3ZLjlXQz87CcAvaon1YdEkw3gCiXuhQltaWOsrR6q8BSL';

export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { numbers, message, apiKey } = req.body || {};

  if (!numbers || !numbers.length || !message) {
    return res.status(400).json({ error: 'Missing numbers or message payload' });
  }

  // Clean numbers to 10-digit Indian format
  const cleanNumbersList: string[] = numbers
    .map((num: string) => num.replace(/[^0-9]/g, '').slice(-10))
    .filter((num: string) => num.length === 10);

  if (!cleanNumbersList.length) {
    return res.status(400).json({ error: 'No valid 10-digit mobile numbers provided' });
  }

  const numbersString = cleanNumbersList.join(',');
  const fast2SmsKey = apiKey || process.env.FAST2SMS_API_KEY || DEFAULT_FAST2SMS_KEY;

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
      provider: 'Fast2SMS Live Telecom Gateway',
      raw: data,
      dispatchedNumbers: cleanNumbersList
    });
  } catch (error: any) {
    console.error('Fast2SMS Error:', error);
    return res.status(500).json({
      error: 'Failed to connect to Fast2SMS Gateway',
      details: error?.message
    });
  }
}
