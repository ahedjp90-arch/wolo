import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const resend = new Resend('re_gTeA1G91_Eo4bqSY88WJXvGxqJZKKzzbZ');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, email, nom } = await request.json();
    const token = crypto.randomBytes(32).toString('hex');

    const { error: dbError } = await supabase
      .from('confirmations')
      .insert([{ user_id: userId, token }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    const confirmUrl = `https://wolo.e-plazastore.com/confirm?token=${token}`;

    const { error: emailError } = await resend.emails.send({
      from: 'WOLO <noreply@e-plazastore.com>',
      to: email,
      subject: 'Confirmez votre email — WOLO',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0F1A; color: #E8E8F0; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #F5A623; font-size: 32px; margin: 0;">WOLO</h1>
            <p style="color: #6B6B8A; margin-top: 8px;">Le cerveau de votre entreprise</p>
          </div>
          <h2 style="color: #E8E8F0;">Bonjour ${nom || ''} 👋</h2>
          <p style="color: #B8B8D0; line-height: 1.6;">Merci de vous être inscrit sur WOLO. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${confirmUrl}" style="background: linear-gradient(135deg, #F5A623, #E8830A); color: #0F0F1A; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">Confirmer mon email</a>
          </div>
          <p style="color: #6B6B8A; font-size: 13px;">Ce lien expire dans 24 heures.</p>
          <p style="color: #4A4A6A; font-size: 12px; text-align: center; margin-top: 32px;">© 2026 WOLO By Prospera Vision Group</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Email Error:', emailError);
      return NextResponse.json({ error: emailError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) return NextResponse.json({ error: 'Token manquant' }, { status: 400 });

    const { data, error } = await supabase
      .from('confirmations')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
    if (data.confirmed) return NextResponse.json({ already: true, userId: data.user_id });

    await supabase.from('confirmations').update({ confirmed: true }).eq('token', token);

    return NextResponse.json({ success: true, userId: data.user_id });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
