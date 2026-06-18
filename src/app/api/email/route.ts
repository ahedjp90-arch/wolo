import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_gTeA1G91_Eo4bqSY88WJXvGxqJZKKzzbZ');

export async function POST(request: Request) {
  const { type, email, data } = await request.json();

  let subject = '';
  let html = '';

  if (type === 'bienvenue') {
    subject = '🎉 Bienvenue sur WOLO !';
    html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
        <h1 style="color: #F5A623;">WOLO</h1>
        <h2>Bienvenue ${data?.nom || ''} ! 👋</h2>
        <p style="color: #B8B8D0;">Votre compte WOLO est prêt. Gérez vos clients, finances et tâches depuis un seul endroit.</p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://wolo.e-plazastore.com" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">Accéder à WOLO</a>
        </div>
        <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
      </div>
    `;
  }

  if (type === 'paiement') {
    subject = '✅ Paiement confirmé — WOLO';
    html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
        <h1 style="color: #F5A623;">WOLO</h1>
        <h2 style="color: #4A9B8E;">✅ Paiement confirmé !</h2>
        <p style="color: #B8B8D0;">Votre abonnement <strong style="color: #F5A623;">${data?.plan || ''}</strong> est actif.</p>
        <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
      </div>
    `;
  }

  if (type === 'facture') {
    subject = `Facture ${data?.numero || ''} — ${data?.entreprise || 'WOLO'}`;
    html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #F5A623; font-size: 32px; margin: 0;">WOLO</h1>
          <p style="color: #6B6B8A; margin-top: 8px;">Le cerveau de votre entreprise</p>
        </div>
        <h2 style="color: #E8E8F0;">Bonjour ${data?.client || ''} 👋</h2>
        <p style="color: #B8B8D0; line-height: 1.6;">Veuillez trouver ci-dessous votre facture <strong style="color: #F5A623;">${data?.numero || ''}</strong> d'un montant de <strong style="color: #F5A623;">${data?.totalTTC || ''} FCFA</strong>.</p>
        <div style="background: #111128; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6B6B8A;">N° Facture</span>
            <span style="color: #E8E8F0; font-weight: 600;">${data?.numero || ''}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6B6B8A;">Date</span>
            <span style="color: #E8E8F0;">${data?.date || ''}</span>
          </div>
          ${data?.echeance ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #6B6B8A;">Echéance</span><span style="color: #E85555;">${data.echeance}</span></div>` : ''}
          <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #1E1E38;">
            <span style="color: #E8E8F0; font-weight: 700; font-size: 16px;">Total TTC</span>
            <span style="color: #F5A623; font-weight: 700; font-size: 16px;">${data?.totalTTC || ''} FCFA</span>
          </div>
        </div>
        ${data?.notes ? `<p style="color: #6B6B8A; font-size: 13px;">Notes : ${data.notes}</p>` : ''}
        <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
      </div>
    `;
  }

  if (type === 'facture_impayee') {
    subject = `⚠️ Facture impayée — Rappel`;
    html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
        <h1 style="color: #F5A623;">WOLO</h1>
        <h2 style="color: #E85555;">⚠️ Rappel de facture impayée</h2>
        <p style="color: #B8B8D0;">La transaction <strong style="color: #F5A623;">${data?.libelle || ''}</strong> d'un montant de <strong>${data?.montant || ''} FCFA</strong> est toujours impayée.</p>
        <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
      </div>
    `;
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'WOLO <noreply@e-plazastore.com>',
      to: email,
      subject,
      html,
    });
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, id: emailData?.id });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 });
  }
}
