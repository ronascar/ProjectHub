// Upload Service for handling file uploads to Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Initialize Supabase client only if credentials are available
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false // Não precisamos de sessão para upload público
        }
    });
    console.log('✅ Supabase Storage configurado:', supabaseUrl);
} else {
    console.warn('⚠️ Supabase Storage não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
}

const BUCKET_NAME = 'avatars';

/**
 * Upload avatar image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID (used for file naming)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadAvatar = async (file, userId) => {
    if (!supabase) {
        console.error('❌ Supabase não configurado');
        throw new Error('Supabase Storage não está configurado. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
    }

    try {
        // Validate file
        if (!file) {
            throw new Error('Nenhum arquivo fornecido');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('O arquivo deve ser uma imagem');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('O tamanho do arquivo deve ser menor que 5MB');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('📤 Fazendo upload:', filePath);

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error('❌ Erro no upload:', error);
            throw error;
        }

        console.log('✅ Upload concluído:', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        console.log('🔗 URL pública:', publicUrl);

        return publicUrl;
    } catch (error) {
        console.error('❌ Erro no upload:', error);
        throw new Error(error.message || 'Falha ao fazer upload da imagem');
    }
};

/**
 * Delete avatar image from Supabase Storage
 * @param {string} avatarUrl - The URL of the avatar to delete
 * @returns {Promise<void>}
 */
export const deleteAvatar = async (avatarUrl) => {
    if (!supabase) {
        console.warn('⚠️ Supabase não configurado, pulando exclusão');
        return;
    }

    try {
        if (!avatarUrl) return;

        // Extract file path from URL
        const urlParts = avatarUrl.split(`${BUCKET_NAME}/`);
        if (urlParts.length < 2) {
            console.warn('⚠️ URL inválida, não foi possível extrair o caminho do arquivo');
            return;
        }

        const filePath = urlParts[1];

        console.log('🗑️ Deletando arquivo:', filePath);

        // Delete file from Supabase Storage
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('❌ Erro ao deletar:', error);
            throw error;
        }

        console.log('✅ Arquivo deletado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao deletar:', error);
        // Não lançar erro, apenas avisar
        console.warn('⚠️ Não foi possível deletar o arquivo antigo, mas isso não impede o upload do novo');
    }
};

/**
 * Convert file to base64 for preview
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default {
    uploadAvatar,
    deleteAvatar,
    fileToBase64
};
