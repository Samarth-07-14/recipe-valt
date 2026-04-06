'use client';

import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types/recipe';

export function useRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load recipes from the database API
    useEffect(() => {
        fetch('/api/recipes')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to fetch');
                return r.json();
            })
            .then((data: Recipe[]) => {
                setRecipes(data);
            })
            .catch(() => {
                setRecipes([]);
            })
            .finally(() => {
                setIsLoaded(true);
            });
    }, []);

    const addRecipe = useCallback(async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
        const res = await fetch('/api/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe),
        });
        if (!res.ok) throw new Error('Failed to add recipe');
        const newRecipe: Recipe = await res.json();
        setRecipes((prev) => [newRecipe, ...prev]);
        return newRecipe;
    }, []);

    const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>) => {
        const res = await fetch(`/api/recipes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update recipe');
        const updated: Recipe = await res.json();
        setRecipes((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }, []);

    const deleteRecipe = useCallback(async (id: string) => {
        const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete recipe');
        setRecipes((prev) => prev.filter((r) => r.id !== id));
    }, []);

    const toggleFavorite = useCallback(async (id: string) => {
        const recipe = recipes.find((r) => r.id === id);
        if (!recipe) return;
        await updateRecipe(id, { isFavorite: !recipe.isFavorite });
    }, [recipes, updateRecipe]);

    return {
        recipes,
        isLoaded,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        // kept for backward compat
        saveRecipes: (_: Recipe[]) => { },
    };
}
