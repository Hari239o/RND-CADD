import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { DEFAULT_SITE_CONTENT, SiteContent } from '@/lib/site-content';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CACHE_FILE_PATH = path.join(process.cwd(), '.site_content_cache.json');

const readCachedContent = (): SiteContent => {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const data = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return {
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
          programs: {
            ...DEFAULT_SITE_CONTENT.programs,
            ...parsed.programs,
            domains: Array.isArray(parsed.programs?.domains) && parsed.programs.domains.length > 0
              ? parsed.programs.domains
              : DEFAULT_SITE_CONTENT.programs.domains,
          },
          catalog: { ...DEFAULT_SITE_CONTENT.catalog, ...parsed.catalog },
          partners: {
            ...DEFAULT_SITE_CONTENT.partners,
            ...parsed.partners,
            partners: Array.isArray(parsed.partners?.partners) && parsed.partners.partners.length > 0
              ? parsed.partners.partners
              : DEFAULT_SITE_CONTENT.partners.partners,
          },
          enrollment: { ...DEFAULT_SITE_CONTENT.enrollment, ...parsed.enrollment },
          footer: {
            ...DEFAULT_SITE_CONTENT.footer,
            ...parsed.footer,
            accreditations: Array.isArray(parsed.footer?.accreditations) && parsed.footer.accreditations.length > 0
              ? parsed.footer.accreditations
              : DEFAULT_SITE_CONTENT.footer.accreditations,
          },
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch {}
  return DEFAULT_SITE_CONTENT;
};

const writeCachedContent = (content: SiteContent) => {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(content, null, 2), 'utf8');
  } catch {}
};

export async function GET() {
  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const doc = await db.collection('site_content').findOne({ key: 'landing_page' });
      if (doc && doc.content) {
        const merged: SiteContent = {
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...doc.content.hero },
          programs: {
            ...DEFAULT_SITE_CONTENT.programs,
            ...doc.content.programs,
            domains: Array.isArray(doc.content.programs?.domains) && doc.content.programs.domains.length > 0
              ? doc.content.programs.domains
              : DEFAULT_SITE_CONTENT.programs.domains,
          },
          catalog: { ...DEFAULT_SITE_CONTENT.catalog, ...doc.content.catalog },
          partners: {
            ...DEFAULT_SITE_CONTENT.partners,
            ...doc.content.partners,
            partners: Array.isArray(doc.content.partners?.partners) && doc.content.partners.partners.length > 0
              ? doc.content.partners.partners
              : DEFAULT_SITE_CONTENT.partners.partners,
          },
          enrollment: { ...DEFAULT_SITE_CONTENT.enrollment, ...doc.content.enrollment },
          footer: {
            ...DEFAULT_SITE_CONTENT.footer,
            ...doc.content.footer,
            accreditations: Array.isArray(doc.content.footer?.accreditations) && doc.content.footer.accreditations.length > 0
              ? doc.content.footer.accreditations
              : DEFAULT_SITE_CONTENT.footer.accreditations,
          },
          updatedAt: doc.content.updatedAt || doc.updatedAt || new Date().toISOString(),
        };
        writeCachedContent(merged);
        return NextResponse.json({ success: true, content: merged });
      }
    }

    const cached = readCachedContent();
    return NextResponse.json({ success: true, content: cached });
  } catch (error: any) {
    console.error('Error fetching site content:', error);
    const cached = readCachedContent();
    return NextResponse.json({ success: true, content: cached });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, section, data, hidden } = body;

    let current = readCachedContent();

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const doc = await db.collection('site_content').findOne({ key: 'landing_page' });
      if (doc && doc.content) {
        current = {
          ...current,
          ...doc.content,
        };
      }
    }

    if (action === 'reset_all') {
      current = {
        ...DEFAULT_SITE_CONTENT,
        updatedAt: new Date().toISOString(),
      };
    } else if (action === 'reset_section' && section) {
      if (section in DEFAULT_SITE_CONTENT) {
        (current as any)[section] = JSON.parse(JSON.stringify((DEFAULT_SITE_CONTENT as any)[section]));
        current.updatedAt = new Date().toISOString();
      }
    } else if (action === 'toggle_visibility' && section) {
      if (section in current) {
        const nextHidden = typeof hidden === 'boolean' ? hidden : !(current as any)[section].hidden;
        (current as any)[section].hidden = nextHidden;
        current.updatedAt = new Date().toISOString();
      }
    } else if (action === 'update_section' && section && data) {
      if (section in current) {
        (current as any)[section] = {
          ...(current as any)[section],
          ...data,
        };
        current.updatedAt = new Date().toISOString();
      }
    } else if (action === 'save_all' && data) {
      current = {
        ...current,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    // Persist to MongoDB
    if (isConnected && db) {
      await db.collection('site_content').updateOne(
        { key: 'landing_page' },
        {
          $set: {
            key: 'landing_page',
            content: current,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }

    // Persist to local cache file
    writeCachedContent(current);

    return NextResponse.json({
      success: true,
      message: 'Website content updated and published live successfully.',
      content: current,
    });
  } catch (error: any) {
    console.error('Error saving site content:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update website content.' },
      { status: 500 }
    );
  }
}
