// @ts-ignore - Supabase package resolution issue
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { env } from '~/env.js';

// Initialize Supabase client using environment variables from env.js
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // // Verify user is authenticated
  // let userId: string;
  // try {
  //   const token = await getToken({ 
  //     req: {
  //       headers: req.headers as Record<string, string>
  //     }, 
  //     secret: env.AUTH_SECRET 
  //   });
    
  //   // Log token info for debugging
  //   console.log('Auth token:', token ? 'Token exists' : 'No token');
    
  //   if (!token || !token.sub) {
  //     // For now, use the userId from the request body if token auth fails
  //     const bodyUserId = req.body.userId;
  //     if (bodyUserId) {
  //       console.log('Using userId from request body:', bodyUserId);
  //       userId = bodyUserId;
  //     } else {
  //       return res.status(401).json({ 
  //         error: 'Unauthorized', 
  //         details: 'No valid authentication token found and no userId in request'
  //       });
  //     }
  //   } else {
  //     userId = token.sub;
  //   }
  // } catch (authError) {
  //   console.error('Auth error:', authError);
    
  //   // For now, use the userId from the request body if token auth fails
  //   const bodyUserId = req.body.userId;
  //   if (bodyUserId) {
  //     console.log('Using userId from request body after auth error:', bodyUserId);
  //     userId = bodyUserId;
  //   } else {
  //     return res.status(401).json({ 
  //       error: 'Unauthorized', 
  //       details: authError instanceof Error ? (authError as Error).message : 'Authentication error'
  //     });
  //   }
  // }

  try {
    const { filename, data, userId } = req.body;
    
    if (!filename || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert data to JSON string
    const jsonData = JSON.stringify(data);
    
    // Convert string to Buffer for storage
    const buffer = Buffer.from(jsonData, 'utf-8');
    
    // Upload to Supabase Storage
    const bucketName = 'tweets';
    
    // Check if bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: { name: string }) => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
      });
    }
    
    // Upload file to a path based on user ID
    const filePath = `${userId}/${filename}`;
    
    // Upload file
    const { data: uploadData, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: 'application/json',
        upsert: true, // Overwrite if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload: ${error.message}`);
    }

    // Get public URL for the file (optional, if you want to access it later)
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return res.status(200).json({ 
      success: true, 
      path: uploadData?.path || filePath,
      publicUrl: publicUrl
    });
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? (error as Error).message : 'Failed to upload file' 
    });
  }
}
