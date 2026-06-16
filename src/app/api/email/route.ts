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
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #F5A623; font-size: 32px; margin: 0;">WOLO</h1>
          <p style="color: #6B6B8A; margin-top: 8px;">Le cerveau de votre entreprise</p>
        </div>
        <h2 style="color: #E8E8F0;">Bienvenue ${data?.nom || ''} ! 👋</h2>
        <p style="color: #B8B8D0; line-height: 1.6;">Votre compte WOLO est prêt. Vous pouvez maintenant gérer vos clients, finances, tâches et documents depuis un seul endroit.</p>
        <div style="background: #111128; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #F5A623; margin-top: 0;">Ce que vous pouvez faire :</h3>
          <ul style="color: #B8B8D0; line-height: 2;">
            <li>👥 Gérer vos clients avec le CRM</li>
            <li>💰 Suivre vos finances en temps réel</li>
            <li>✅ Organiser vos tâches en Kanban</li>
            <li>📚 Centraliser vos procédures dans le Wiki</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://wolo.e-plazastore.com" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">Accéder à WOLO</a>
        </div>
        <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
      </div>
    `;
  }

  if (type === 'paiement') {
    subject = '✅ Paiement confirmé — WOLO';
    html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #F5A623; font-size: 32px; margin: 0;">WOLO</h1>
        </div>
        <h2 style="color: #4A9B8E;">✅ Paiement confirmé !</h2>
        <p style="color: #B8B8D0; line-height: 1.6;">Votre abonnement <strong style="color: #F5A623;">${data?.plan || ''}</strong> est maintenant actif.</p>
        <div style="background: #111128; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #6B6B8A; margin: 0 0 8px;">Référence de paiement</p>
          <p style="color: #E8E8F0; font-weight: 700; margin: 0;">${data?.reference || ''}</p>
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://wolo.e-plazastore.com" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">Accéder à WOLO</a>
        </div>
        <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
      </div>
    `;
  }

  if (type === 'facture_impayee') {
    subject = '⚠️ Facture impayée — Rappel WOLO';
    html = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #F5A623; font-size: 32px; margin: 0;">WOLO</h1>
        </div>
        <h2 style="color: #E85555;">⚠️ Rappel de facture impayée</h2>
        <p style="color: #B8B8D0; line-height: 1.6;">La transaction <strong style="color: #F5A623;">${data?.libelle || ''}</strong> d'un montant de <strong>${data?.montant || ''} FCFA</strong> est toujours impayée.</p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://wolo.e-plazastore.com" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">Voir les finances</a>
        </div>
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
