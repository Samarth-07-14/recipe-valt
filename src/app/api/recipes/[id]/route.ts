import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH update recipe
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const { id } = await params;
    const body = await req.json();

    // Verify ownership
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.recipe.update({
        where: { id },
        data: {
            ...(body.title && { title: body.title }),
            ...(body.description !== undefined && { description: body.description }),
            ...(body.category && { category: body.category }),
            ...(body.familyMember !== undefined && { familyMember: body.familyMember }),
            ...(body.prepTime !== undefined && { prepTime: Number(body.prepTime) }),
            ...(body.cookTime !== undefined && { cookTime: Number(body.cookTime) }),
            ...(body.servings !== undefined && { servings: Number(body.servings) }),
            ...(body.difficulty && { difficulty: body.difficulty }),
            ...(body.ingredients && { ingredients: JSON.stringify(body.ingredients) }),
            ...(body.steps && { steps: JSON.stringify(body.steps) }),
            ...(body.tags && { tags: JSON.stringify(body.tags) }),
            ...(body.image !== undefined && { image: body.image }),
            ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
            ...(body.notes !== undefined && { notes: body.notes }),
        },
    });

    return NextResponse.json({
        ...updated,
        ingredients: JSON.parse(updated.ingredients) as any[],
        steps: JSON.parse(updated.steps) as string[],
        tags: JSON.parse(updated.tags) as string[],
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
    });
}

// DELETE recipe
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const { id } = await params;

    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.recipe.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
