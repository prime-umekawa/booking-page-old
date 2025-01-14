import { db } from '@/lib/firebase/firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const querySnapshot = await db.collection('teaching-report').get();
    if (querySnapshot.empty) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // ドキュメントデータを取得
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(documents);
  } catch (error: any) {
    console.error('Failed to fetch documents:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
