require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        const email = 'admin@nexuspm.com';
        const newPassword = 'admin123'; // Nova senha

        console.log('🔄 Resetando senha do admin...');

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Atualizar senha
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        console.log('✅ Senha resetada com sucesso!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Nova senha: ${newPassword}`);
        console.log('\n⚠️  IMPORTANTE: Mude esta senha após fazer login!');

    } catch (error) {
        console.error('❌ Erro ao resetar senha:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
