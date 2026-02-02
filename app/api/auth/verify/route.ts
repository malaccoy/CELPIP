import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });
      return NextResponse.json(
        { error: 'Token expirado. Por favor, cadastre-se novamente.' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (verificationToken.user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email já verificado. Você pode fazer login.',
        alreadyVerified: true,
      });
    }

    // Verify user
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Email verificado com sucesso! Você já pode fazer login.',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar email. Tente novamente.' },
      { status: 500 }
    );
  }
}
