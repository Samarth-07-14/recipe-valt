import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all recipes for the logged-in user
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recipes = await prisma.recipe.findMany({
        where: { userId: session.user.id as string },
        orderBy: { createdAt: 'desc' },
    });

    const parsed = recipes.map((r: any) => ({
        ...r,
        ingredients: JSON.parse(r.ingredients) as any[],
        steps: JSON.parse(r.steps) as string[],
        tags: JSON.parse(r.tags) as string[],
        prepTime: r.prepTime,
        cookTime: r.cookTime,
        servings: r.servings,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
}

// POST create a new recipe
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        const recipe = await prisma.recipe.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                familyMember: body.familyMember,
                prepTime: Number(body.prepTime),
                cookTime: Number(body.cookTime),
                servings: Number(body.servings),
                difficulty: body.difficulty,
                ingredients: JSON.stringify(body.ingredients),
                steps: JSON.stringify(body.steps),
                tags: JSON.stringify(body.tags),
                image: body.image || null,
                isFavorite: body.isFavorite || false,
                notes: body.notes || null,
                userId: session.user.id,
            },
        });

        return NextResponse.json({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            steps: JSON.parse(recipe.steps),
            tags: JSON.parse(recipe.tags),
            createdAt: recipe.createdAt.toISOString(),
            updatedAt: recipe.updatedAt.toISOString(),
        }, { status: 201 });
    } catch (error) {
        console.error('Create recipe error:', error);
        return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }
}
