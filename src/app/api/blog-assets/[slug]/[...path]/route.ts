import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; path: string[] }> }
) {
  const params = await context.params;
  try {
    const { slug, path: assetPath } = params;
    
    // 构建资源文件路径
    const assetsDir = path.join(process.cwd(), 'src/content/blogs', slug, 'assets');
    const filePath = path.join(assetsDir, ...assetPath);
    
    // 安全检查：确保文件路径在 assets 目录内
    const normalizedAssetsDir = path.normalize(assetsDir);
    const normalizedFilePath = path.normalize(filePath);
    
    if (!normalizedFilePath.startsWith(normalizedAssetsDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // 读取文件
    const fileBuffer = fs.readFileSync(filePath);
    
    // 根据文件扩展名设置 Content-Type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.ico':
        contentType = 'image/x-icon';
        break;
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving blog asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}