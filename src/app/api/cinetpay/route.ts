import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, email, nom, plan, description } = await request.json();

    const transactionId = `WOLO_${Date.now()}`;

    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID || '',
        transaction_id: transactionId,
        amount: amount,
        currency: 'XOF',
        description: description || `Abonnement WOLO ${plan}`,
        return_url: 'https://wolo.e-plazastore.com/abonnement?status=success',
        notify_url: 'https://wolo.e-plazastore.com/api/cinetpay/notify',
        cancel_url: 'https://wolo.e-plazastore.com/abonnement?status=cancelled',
        customer_name: nom || 'Client',
        customer_email: email,
        customer_phone_number: '',
        customer_address: 'Abidjan',
        customer_city: 'Abidjan',
        customer_country: 'CI',
        customer_state: 'CI',
        customer_zip_code: '00225',
        channels: 'ALL',
        metadata: plan,
      }),
    });

    const data = await response.json();

    if (data.code === '201') {
      return NextResponse.json({ 
        success: true, 
        paymentUrl: data.data.payment_url,
        transactionId 
      });
    }

    return NextResponse.json({ error: data.message || 'Erreur CinetPay' }, { status: 400 });
  } catch (err) {
    console.error('CinetPay error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
