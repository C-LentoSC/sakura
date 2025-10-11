import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hasRole } from '@/app/lib/dal';

// Formidable configuration (for reference - we handle upload manually)
// const form = formidable({
//   uploadDir: path.join(process.cwd(), 'uploads/services'),
//   keepExtensions: true,
//   maxFileSize: 5 * 1024 * 1024, // 5MB limit
//   filter: ({ mimetype }) => {
//     // Only allow images
//     return mimetype?.startsWith('image/') || false;
//   },
// });

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const isAdmin = await hasRole('ADMIN');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'uploads/services');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convert NextRequest to Node.js IncomingMessage format
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const serviceName = formData.get('serviceName') as string;
    const oldImageUrl = formData.get('oldImageUrl') as string | undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate filename based on service name
    const extension = path.extname(file.name).toLowerCase();
    let filename = 'service-unknown';
    
    if (serviceName && serviceName.trim()) {
      // Convert service name to URL-friendly format
      const cleanName = serviceName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .substring(0, 50); // Limit length
      
      if (cleanName) {
        filename = `service-${cleanName}`;
      }
    }
    
    // Ensure filename is unique by adding timestamp if needed
    let finalFilename = `${filename}${extension}`;
    let counter = 1;
    
    while (fs.existsSync(path.join(uploadDir, finalFilename))) {
      finalFilename = `${filename}-${counter}${extension}`;
      counter++;
    }
    
    const filepath = path.join(uploadDir, finalFilename);

    // Save file (write/overwrite)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    // If an old image URL was provided and it's different from the new filename, delete the old file
    try {
      if (oldImageUrl && typeof oldImageUrl === 'string') {
        const oldFilename = path.basename(oldImageUrl);
        if (oldFilename && oldFilename !== finalFilename) {
          const oldFilepath = path.join(uploadDir, oldFilename);
          if (fs.existsSync(oldFilepath)) {
            try {
              fs.unlinkSync(oldFilepath);
            } catch (unlinkErr) {
              // Log and continue — deletion failure shouldn't block the response
              console.warn('Failed to delete old image:', oldFilepath, unlinkErr);
            }
          }
        }
      }
    } catch (e) {
      // Non-fatal: continue
      console.warn('Error handling old image deletion', e);
    }

    // Return the file path that can be used to access the image
    const imageUrl = `/api/uploads/services/${finalFilename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      filename: finalFilename,
      originalName: file.name,
      size: file.size,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
