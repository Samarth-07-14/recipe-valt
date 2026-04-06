'use client';

import React from 'react';
import { Recipe, CATEGORY_EMOJIS, DIFFICULTY_COLORS } from '@/types/recipe';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
    onFavorite: () => void;
    onDelete: () => void;
}

export default function RecipeCard({ recipe, onClick, onFavorite, onDelete }: RecipeCardProps) {
    const totalTime = recipe.prepTime + recipe.cookTime;

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavorite();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete "${recipe.title}"?`)) {
            onDelete();
        }
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className={styles.image} />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.categoryEmoji}>{CATEGORY_EMOJIS[recipe.category]}</span>
                    </div>
                )}
                <div className={styles.overlay} />
                <button
                    className={`${styles.favoriteBtn} ${recipe.isFavorite ? styles.favoriteBtnActive : ''}`}
                    onClick={handleFavorite}
                    aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {recipe.isFavorite ? '♥' : '♡'}
                </button>
                <div className={styles.categoryBadge}>
                    {CATEGORY_EMOJIS[recipe.category]} {recipe.category}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{recipe.title}</h3>
                <p className={styles.description}>{recipe.description}</p>

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>👨‍🍳</span>
                        <span className={styles.metaText}>{recipe.familyMember}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>⏱️</span>
                        <span className={styles.metaText}>{totalTime} min</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>👥</span>
                        <span className={styles.metaText}>{recipe.servings} servings</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <span
                        className={styles.difficulty}
                        style={{ color: DIFFICULTY_COLORS[recipe.difficulty] }}
                    >
                        ● {recipe.difficulty}
                    </span>
                    <div className={styles.actions}>
                        <button className={styles.deleteBtn} onClick={handleDelete} aria-label="Delete recipe">
                            🗑️
                        </button>
                    </div>
                </div>

                {recipe.tags.length > 0 && (
                    <div className={styles.tags}>
                        {recipe.tags.slice(0, 3).map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                        {recipe.tags.length > 3 && (
                            <span className={styles.tagMore}>+{recipe.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
