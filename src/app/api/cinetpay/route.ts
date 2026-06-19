import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, email, nom, plan } = await request.json();

    const accountKey = process.env.CINETPAY_API_KEY;
    const accountPassword = process.env.CINETPAY_PWD;

    const authRes = await fetch('https://api.cinetpay.net/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apikey: accountKey, password: accountPassword }),
    });

    const authData = await authRes.json();
    const token = authData?.data?.token;

    if (!token) {
      return NextResponse.json({ error: 'Auth echouee: ' + JSON.stringify(authData) }, { status: 400 });
    }

    const nomParts = (nom || 'Client WOLO').split(' ');
    const firstName = nomParts[0] || 'Client';
    const lastName = nomParts.slice(1).join(' ') || 'WOLO';
    const transactionId = ('WOLO' + Date.now()).slice(0, 30);

    const payRes = await fetch('https://api.cinetpay.net/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({
        currency: 'XOF',
        merchant_transaction_id: transactionId,
        amount: amount,
        lang: 'fr',
        designation: 'Abonnement WOLO ' + plan,
        client_email: email,
        client_first_name: firstName,
        client_last_name: lastName,
        success_url: 'https://wolo.e-plazastore.com/abonnement?status=success',
        failed_url: 'https://wolo.e-plazastore.com/abonnement?status=failed',
        notify_url: 'https://wolo.e-plazastore.com/api/cinetpay/notify',
        direct_pay: false,
      }),
    });

    const payData = await payRes.json();

    if (payData.payment_url) {
      return NextResponse.json({ success: true, paymentUrl: payData.payment_url });
    }

    return NextResponse.json({ error: JSON.stringify(payData) }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur: ' + err }, { status: 500 });
  }
}
