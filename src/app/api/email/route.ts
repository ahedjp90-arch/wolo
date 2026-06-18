import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_gTeA1G91_Eo4bqSY88WJXvGxqJZKKzzbZ');

export async function POST(request: Request) {
  const { type, email, data } = await request.json();

  let subject = '';
  let html = '';

  if (type === 'bienvenue') {
    subject = 'Bienvenue sur WOLO !';
    html = `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
      <h1 style="color: #F5A623;">WOLO</h1>
      <h2>Bienvenue ${data?.nom || ''} !</h2>
      <p style="color: #B8B8D0;">Votre compte WOLO est pret. Gerez vos clients, finances et taches depuis un seul endroit.</p>
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://wolo.e-plazastore.com" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">Acceder a WOLO</a>
      </div>
      <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">2026 WOLO By Prospera Vision Group</p>
    </div>`;
  }

  if (type === 'paiement') {
    subject = 'Paiement confirme - WOLO';
    html = `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
      <h1 style="color: #F5A623;">WOLO</h1>
      <h2 style="color: #4A9B8E;">Paiement confirme !</h2>
      <p style="color: #B8B8D0;">Votre abonnement <strong style="color: #F5A623;">${data?.plan || ''}</strong> est actif.</p>
      <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">2026 WOLO By Prospera Vision Group</p>
    </div>`;
  }

  if (type === 'facture') {
    subject = `Facture ${data?.numero || ''} - ${data?.entreprise || 'WOLO'}`;
    html = `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
      <h1 style="color: #F5A623;">WOLO</h1>
      <h2>Bonjour ${data?.client || ''}</h2>
      <p style="color: #B8B8D0;">Veuillez trouver votre facture <strong style="color: #F5A623;">${data?.numero || ''}</strong> d'un montant de <strong>${data?.totalTTC || ''} FCFA</strong>.</p>
      <div style="background: #111128; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <p style="color: #6B6B8A; margin: 0 0 8px;">Reference: <span style="color: #E8E8F0; font-weight: 600;">${data?.numero || ''}</span></p>
        <p style="color: #6B6B8A; margin: 0 0 8px;">Date: <span style="color: #E8E8F0;">${data?.date || ''}</span></p>
        ${data?.echeance ? `<p style="color: #6B6B8A; margin: 0 0 8px;">Echeance: <span style="color: #E85555;">${data.echeance}</span></p>` : ''}
        <p style="color: #E8E8F0; font-weight: 700; font-size: 16px; margin-top: 16px;">Total TTC: <span style="color: #F5A623;">${data?.totalTTC || ''} FCFA</span></p>
      </div>
      ${data?.notes ? `<p style="color: #6B6B8A; font-size: 13px;">Notes: ${data.notes}</p>` : ''}
      <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">2026 WOLO By Prospera Vision Group</p>
    </div>`;
  }

  if (type === 'nouveau_ticket') {
    subject = `Nouveau ticket support - ${data?.reference || ''} - ${data?.priorite || ''}`;
    html = `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
      <h1 style="color: #F5A623;">WOLO Admin</h1>
      <h2>Nouveau ticket support</h2>
      <div style="background: #111128; border-radius: 12px; padding: 24px; margin: 16px 0;">
        <p style="color: #6B6B8A; margin: 0 0 8px;">Reference: <span style="color: #F5A623; font-weight: 600;">${data?.reference || ''}</span></p>
        <p style="color: #6B6B8A; margin: 0 0 8px;">Sujet: <span style="color: #E8E8F0; font-weight: 600;">${data?.sujet || ''}</span></p>
        <p style="color: #6B6B8A; margin: 0 0 8px;">Priorite: <span style="color: #F5A623;">${data?.priorite || ''}</span></p>
        <p style="color: #6B6B8A; margin: 0 0 8px;">Raison: <span style="color: #E8E8F0;">${data?.raison || ''}</span></p>
        <p style="color: #6B6B8A; margin: 0 0 8px;">Client: <span style="color: #E8E8F0;">${data?.clientEmail || ''}</span></p>
        ${data?.message ? `<p style="color: #6B6B8A; margin-top: 12px;">Message:</p><p style="color: #E8E8F0; background: #0F0F1A; padding: 12px; border-radius: 8px;">${data.message}</p>` : ''}
      </div>
      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wolo.e-plazastore.com/wolo-admin" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">Voir dans l'admin</a>
      </div>
      <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">2026 WOLO By Prospera Vision Group</p>
    </div>`;
  }

  if (type === 'reponse_ticket') {
    subject = `Reponse a votre ticket ${data?.reference || ''} - WOLO Support`;
    html = `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
      <h1 style="color: #F5A623;">WOLO Support</h1>
      <h2>Reponse a votre ticket</h2>
      <div style="background: #111128; border-radius: 12px; padding: 24px; margin: 16px 0;">
        <p style="color: #6B6B8A; margin: 0 0 8px;">Reference: <span style="color: #F5A623;">${data?.reference || ''}</span></p>
        <p style="color: #6B6B8A; margin: 0 0 8px;">Sujet: <span style="color: #E8E8F0;">${data?.sujet || ''}</span></p>
        <p style="color: #6B6B8A; margin-top: 16px;">Reponse de l'equipe WOLO:</p>
        <p style="color: #E8E8F0; background: #0F0F1A; padding: 12px; border-radius: 8px; line-height: 1.6;">${data?.reponse || ''}</p>
      </div>
      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wolo.e-plazastore.com" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">Acceder a WOLO</a>
      </div>
      <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">2026 WOLO By Prospera Vision Group</p>
    </div>`;
  }

  if (type === 'facture_impayee') {
    subject = 'Facture impayee - Rappel WOLO';
    html = `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
      <h1 style="color: #F5A623;">WOLO</h1>
      <h2 style="color: #E85555;">Rappel de facture impayee</h2>
      <p style="color: #B8B8D0;">La transaction <strong style="color: #F5A623;">${data?.libelle || ''}</strong> de <strong>${data?.montant || ''} FCFA</strong> est toujours impayee.</p>
      <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">2026 WOLO By Prospera Vision Group</p>
    </div>`;
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
