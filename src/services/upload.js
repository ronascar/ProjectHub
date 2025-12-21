// Upload Service for handling file uploads to Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Initialize Supabase client only if credentials are available
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
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
        throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }

    try {
        // Validate file
        if (!file) {
            throw new Error('No file provided');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'Failed to upload image');
    }
};

/**
 * Delete avatar image from Supabase Storage
 * @param {string} avatarUrl - The URL of the avatar to delete
 * @returns {Promise<void>}
 */
export const deleteAvatar = async (avatarUrl) => {
    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    try {
        if (!avatarUrl) return;

        // Extract file path from URL
        const urlParts = avatarUrl.split(`${BUCKET_NAME}/`);
        if (urlParts.length < 2) return;

        const filePath = urlParts[1];

        // Delete file from Supabase Storage
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Delete error:', error);
        throw new Error(error.message || 'Failed to delete image');
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
