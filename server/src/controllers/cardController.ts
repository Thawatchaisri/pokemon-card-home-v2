import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCards = async (req: express.Request, res: express.Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category as string;
    const language = req.query.language as any;
    
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && category !== 'All') where.category = category;
    if (language) where.language = language;

    // Fetch cards sorted by Manual Price DESC
    const cards = await prisma.card.findMany({
      where,
      skip,
      take: limit,
      orderBy: { manualPrice: 'desc' },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    });

    const total = await prisma.card.count({ where });

    // Map to match frontend interface
    const formattedCards = cards.map(c => ({
      ...c,
      // Ensure compatibility if frontend still checks imageUrl
      imageUrl: c.images.length > 0 ? c.images[0].url : '',
    }));

    res.json({
      data: formattedCards,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching cards' });
  }
};

export const getCardById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const card = await prisma.card.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    });
    
    if (!card) return res.status(404).json({ error: 'Card not found' });

    res.json({
        ...card,
        imageUrl: card.images.length > 0 ? card.images[0].url : '',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching card' });
  }
};

export const createCard = async (req: express.Request, res: express.Response) => {
  try {
    const { name, language, setName, year, condition, manualPrice, category, images } = req.body;

    const newCard = await prisma.card.create({
      data: {
        name,
        language,
        setName,
        year: Number(year),
        condition,
        manualPrice: Number(manualPrice),
        category,
        images: {
            create: (images || []).map((img: any) => ({
                url: img.url,
                sortOrder: img.sortOrder
            }))
        }
      },
      include: { images: true }
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating card' });
  }
};

export const updateCard = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { name, language, setName, year, condition, manualPrice, category, images } = req.body;

    // Transaction to update details and replace images
    const updatedCard = await prisma.$transaction(async (tx) => {
        await tx.card.update({
            where: { id },
            data: {
                name, language, setName, 
                year: Number(year), 
                condition, 
                manualPrice: Number(manualPrice), 
                category
            }
        });

        // Delete old images and insert new ones (simplified logic)
        await tx.cardImage.deleteMany({ where: { cardId: id } });
        
        // Re-insert
        if (images && images.length > 0) {
            await tx.cardImage.createMany({
                data: images.map((img: any) => ({
                    cardId: id,
                    url: img.url,
                    sortOrder: img.sortOrder
                }))
            });
        }
        
        return tx.card.findUnique({ 
            where: { id },
            include: { images: { orderBy: { sortOrder: 'asc' } } }
        });
    });

    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: 'Error updating card' });
  }
};

export const deleteCard = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await prisma.card.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting card' });
  }
};

export const getPriceHistory = async (req: express.Request, res: express.Response) => {
  // Mocking logic for now, or fetch from DB PriceHistory model
  const history = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
          date: d.toLocaleDateString(),
          price: 100 + Math.random() * 50
      };
  });
  res.json(history);
};