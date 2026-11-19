import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

export interface OfferItem {
  id: string;
  type: 'referral' | 'course_discount';
  title: string;
  code: string;
  targetCourse: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  referrerReward?: string;
  refereeReward?: string;
  shareUrl: string;
  expiryDate?: string;
  description?: string;
  status: 'Active' | 'Inactive';
  redemptionsCount: number;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_OFFERS: OfferItem[] = [
  {
    id: 'off-peer-01',
    type: 'referral',
    title: 'Engineering Peer Referral Program',
    code: 'RAMG8492',
    targetCourse: 'All Engineering Courses',
    discountType: 'flat',
    discountValue: 1500,
    referrerReward: 'Rs 1,500 Software Voucher Credit',
    refereeReward: 'Rs 1,500 Enrollment Fee Discount',
    shareUrl: 'https://rnd-cadd.vercel.app/enroll?ref=RAMG8492',
    expiryDate: '2026-12-31',
    description: 'Share your unique referral link with friends enrolling in Civil, Mechanical, or Electrical CADD. You both receive Rs 1,500 voucher credit.',
    status: 'Active',
    redemptionsCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'off-bim-20',
    type: 'course_discount',
    title: 'BIM Professional Early Bird 20% OFF',
    code: 'BIM20',
    targetCourse: 'Revit Architecture & BIM Specialist',
    discountType: 'percentage',
    discountValue: 20,
    referrerReward: '',
    refereeReward: '20% Tuition Fee Waiver',
    shareUrl: 'https://rnd-cadd.vercel.app/enroll?coupon=BIM20',
    expiryDate: '2026-12-31',
    description: 'Special seasonal scholarship discount for students registering for Revit Architecture and Navisworks BIM programs.',
    status: 'Active',
    redemptionsCount: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'off-cad-15',
    type: 'course_discount',
    title: 'Civil CADD Master Batch Scholarship',
    code: 'CIVIL15',
    targetCourse: 'Civil CADD & Master BIM',
    discountType: 'percentage',
    discountValue: 15,
    referrerReward: '',
    refereeReward: '15% Off Total Course Fee',
    shareUrl: 'https://rnd-cadd.vercel.app/enroll?coupon=CIVIL15',
    expiryDate: '2026-12-31',
    description: '15% instant reduction on Civil CADD & Master BIM 90-day comprehensive workstation lab program.',
    status: 'Active',
    redemptionsCount: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const TMP_FILE = path.join(os.tmpdir(), 'rnd_cadd_offers.json');
const SCRATCH_FILE = path.join(process.cwd(), 'scratch', 'offers_data.json');

function readPersistentOffers(): OfferItem[] {
  for (const filePath of [TMP_FILE, SCRATCH_FILE]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Continue
    }
  }
  return INITIAL_OFFERS;
}

function writePersistentOffers(offers: OfferItem[]): void {
  const data = JSON.stringify(offers, null, 2);
  for (const filePath of [TMP_FILE, SCRATCH_FILE]) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, data, 'utf-8');
    } catch {
      // ignore
    }
  }
}

let memoryOffers: OfferItem[] = readPersistentOffers();

// GET: Retrieve all offers & discounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('offers');
        const count = await collection.countDocuments();
        if (count === 0) {
          await collection.insertMany(INITIAL_OFFERS.map((o) => ({ ...o })));
        }
        const dbDocs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
        if (dbDocs.length > 0) {
          memoryOffers = dbDocs.map((d: any) => ({
            id: d.id || d._id?.toString(),
            type: d.type || 'course_discount',
            title: d.title || 'Special Offer',
            code: d.code || 'CADPRO',
            targetCourse: d.targetCourse || 'All Engineering Courses',
            discountType: d.discountType || 'percentage',
            discountValue: Number(d.discountValue) || 10,
            referrerReward: d.referrerReward || '',
            refereeReward: d.refereeReward || '',
            shareUrl: d.shareUrl || `https://rnd-cadd.vercel.app/enroll?coupon=${d.code || 'CADPRO'}`,
            expiryDate: d.expiryDate || '2026-12-31',
            description: d.description || '',
            status: d.status || 'Active',
            redemptionsCount: Number(d.redemptionsCount) || 0,
            createdAt: d.createdAt || new Date().toISOString(),
            updatedAt: d.updatedAt || new Date().toISOString(),
          }));
          writePersistentOffers(memoryOffers);
        }
      }
    } catch (dbErr) {
      console.warn('[Offers API] DB fallback, using disk cache:', dbErr);
    }

    memoryOffers = readPersistentOffers();
    let result = [...memoryOffers];
    if (type && type !== 'all') {
      result = result.filter((o) => o.type === type);
    }
    if (status && status !== 'all') {
      result = result.filter((o) => o.status === status);
    }

    return NextResponse.json({
      success: true,
      offers: result,
      totalCount: result.length,
      activeCount: result.filter((o) => o.status === 'Active').length,
    });
  } catch (error: any) {
    console.error('[Offers GET Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Create or Update an Offer / Referral Program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      type,
      title,
      code,
      targetCourse,
      discountType,
      discountValue,
      referrerReward,
      refereeReward,
      expiryDate,
      description,
      status,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: 'Offer title is required.' }, { status: 400 });
    }
    if (!code || !code.trim()) {
      return NextResponse.json({ success: false, message: 'Promo/Referral code is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const offerType: 'referral' | 'course_discount' = type === 'referral' ? 'referral' : 'course_discount';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rnd-cadd.vercel.app';
    const shareUrl = offerType === 'referral'
      ? `${baseUrl}/enroll?ref=${cleanCode}`
      : `${baseUrl}/enroll?coupon=${cleanCode}`;

    const newOffer: OfferItem = {
      id: id || `off-${Date.now()}`,
      type: offerType,
      title: title.trim(),
      code: cleanCode,
      targetCourse: targetCourse?.trim() || 'All Engineering Courses',
      discountType: discountType === 'flat' ? 'flat' : 'percentage',
      discountValue: Number(discountValue) || 10,
      referrerReward: referrerReward?.trim() || (offerType === 'referral' ? 'Rs 1,500 Voucher' : ''),
      refereeReward: refereeReward?.trim() || (offerType === 'referral' ? 'Rs 1,500 Discount' : `${discountValue}% Fee Waiver`),
      shareUrl,
      expiryDate: expiryDate?.trim() || '2026-12-31',
      description: description?.trim() || '',
      status: status === 'Inactive' ? 'Inactive' : 'Active',
      redemptionsCount: Number(body.redemptionsCount) || 0,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryOffers = readPersistentOffers();
    const existingIndex = memoryOffers.findIndex((o) => o.id === newOffer.id);
    if (existingIndex !== -1) {
      memoryOffers[existingIndex] = newOffer;
    } else {
      memoryOffers.unshift(newOffer);
    }
    writePersistentOffers(memoryOffers);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('offers');
        await collection.updateOne(
          { $or: [{ id: newOffer.id }, { code: newOffer.code }] },
          { $set: { ...newOffer } },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn('[Offers API] DB persist fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Offer created and referral link generated successfully!',
      offer: newOffer,
      offers: memoryOffers,
    });
  } catch (error: any) {
    console.error('[Offers POST Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Toggle Status or Redemptions
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, incrementRedemption } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Offer ID is required.' }, { status: 400 });
    }

    memoryOffers = readPersistentOffers();
    const offer = memoryOffers.find((o) => o.id === id);
    if (!offer) {
      return NextResponse.json({ success: false, message: 'Offer not found.' }, { status: 404 });
    }

    if (status) {
      offer.status = status;
    }
    if (incrementRedemption) {
      offer.redemptionsCount = (offer.redemptionsCount || 0) + 1;
    }
    offer.updatedAt = new Date().toISOString();

    writePersistentOffers(memoryOffers);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('offers');
        await collection.updateOne(
          { $or: [{ id }, { _id: id }] },
          { $set: { status: offer.status, redemptionsCount: offer.redemptionsCount, updatedAt: offer.updatedAt } }
        );
      }
    } catch (dbErr) {
      console.warn('[Offers API] DB patch fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Offer updated successfully.',
      offer,
      offers: memoryOffers,
    });
  } catch (error: any) {
    console.error('[Offers PATCH Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Delete an Offer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Offer ID is required.' }, { status: 400 });
    }

    memoryOffers = readPersistentOffers().filter((o) => o.id !== id);
    writePersistentOffers(memoryOffers);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('offers');
        await collection.deleteOne({ $or: [{ id }, { _id: id }] });
      }
    } catch (dbErr) {
      console.warn('[Offers API] DB delete fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully.',
      offers: memoryOffers,
    });
  } catch (error: any) {
    console.error('[Offers DELETE Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
