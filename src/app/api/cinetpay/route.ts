import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, email, nom, plan } = await request.json();

    const accountKey = process.env.CINETPAY_API_KEY;
    const accountPassword = process.env.CINETPAY_PWD;

    // Etape 1 - Obtenir le token
    const authResponse = await fetch('https://api.cinetpay.net/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: accountKey,
        password: accountPassword,
      }),
    });

    const authData = await authResponse.json();

    if (!authData.data?.token) {
      return NextResponse.json({ error: 'Authentification CinetPay echouee: ' + JSON.stringify(authData) }, { status: 400 });
    }

    const token = authData.data.token;

    // Etape 2 - Initier le paiement
    const nomParts = (nom || 'Client WOLO').split(' ');
    const firstName = nomParts[0] || 'Client';
    const lastName = nomParts.slice(1).join(' ') || 'WOLO';

    const paymentResponse = await fetch('https://api.cinetpay.net/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currency: 'XOF',
        merchant_transaction_id: `WOLO_${Date.now()}`,
        amount: amount,
        lang: 'fr',
        designation: `Abonnement WOLO ${plan}`,
        client_email: email,
        client_first_name: firstName,
        client_last_name: lastName,
        success_url: 'https://wolo.e-plazastore.com/abonnement?status=success',
        failed_url: 'https://wolo.e-plazastore.com/abonnement?status=failed',
        notify_url: 'https://wolo.e-plazastore.com/api/cinetpay/notify',
        direct_pay: false,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.code === 200 && paymentData.payment_url) {
      return NextResponse.json({
        success: true,
        paymentUrl: paymentData.payment_url,
      });
    }

    return NextResponse.json({ error: paymentData.message || JSON.stringify(paymentData) }, { status: 400 });
  } catch (err) {
    console.error('CinetPay error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
