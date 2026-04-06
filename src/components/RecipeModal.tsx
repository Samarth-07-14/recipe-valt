'use client';

import React, { useEffect, useRef } from 'react';
import { Recipe, CATEGORY_EMOJIS, DIFFICULTY_COLORS } from '@/types/recipe';
import styles from './RecipeModal.module.css';

interface RecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    onEdit: () => void;
    onFavorite: () => void;
}

export default function RecipeModal({ recipe, onClose, onEdit, onFavorite }: RecipeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const totalTime = recipe.prepTime + recipe.cookTime;

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal} ref={modalRef} role="dialog" aria-modal="true" aria-label={recipe.title}>
                <div className={styles.hero}>
                    {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} className={styles.heroImage} />
                    ) : (
                        <div className={styles.heroPlaceholder}>
                            <span className={styles.heroEmoji}>{CATEGORY_EMOJIS[recipe.category]}</span>
                        </div>
                    )}
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <span className={styles.categorybadge}>
                            {CATEGORY_EMOJIS[recipe.category]} {recipe.category}
                        </span>
                        <h2 className={styles.heroTitle}>{recipe.title}</h2>
                        <p className={styles.heroAuthor}>👨‍👩‍👧‍👦 Shared by {recipe.familyMember}</p>
                    </div>
                    <div className={styles.heroActions}>
                        <button
                            className={`${styles.actionBtn} ${recipe.isFavorite ? styles.actionBtnActive : ''}`}
                            onClick={onFavorite}
                            aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            {recipe.isFavorite ? '♥' : '♡'}
                        </button>
                        <button className={styles.actionBtn} onClick={onEdit} aria-label="Edit recipe">✏️</button>
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">✕</button>
                    </div>
                </div>

                <div className={styles.body}>
                    <p className={styles.description}>{recipe.description}</p>

                    {recipe.notes && (
                        <div className={styles.notes}>
                            <span className={styles.notesIcon}>📝</span>
                            <p>{recipe.notes}</p>
                        </div>
                    )}

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{recipe.prepTime}</div>
                            <div className={styles.statLabel}>Prep (min)</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{recipe.cookTime}</div>
                            <div className={styles.statLabel}>Cook (min)</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{totalTime}</div>
                            <div className={styles.statLabel}>Total (min)</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{recipe.servings}</div>
                            <div className={styles.statLabel}>Servings</div>
                        </div>
                        <div className={styles.statCard}>
                            <div
                                className={styles.statValue}
                                style={{ color: DIFFICULTY_COLORS[recipe.difficulty], fontSize: '1rem' }}
                            >
                                {recipe.difficulty}
                            </div>
                            <div className={styles.statLabel}>Difficulty</div>
                        </div>
                    </div>

                    <div className={styles.sections}>
                        <div className={styles.ingredientsSection}>
                            <h3 className={styles.sectionTitle}>🥘 Ingredients</h3>
                            <ul className={styles.ingredientList}>
                                {recipe.ingredients.map((ing) => (
                                    <li key={ing.id} className={styles.ingredientItem}>
                                        <span className={styles.ingredientBullet} />
                                        <span className={styles.ingredientAmount}>
                                            {ing.amount} {ing.unit}
                                        </span>
                                        <span className={styles.ingredientName}>{ing.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.stepsSection}>
                            <h3 className={styles.sectionTitle}>📋 Instructions</h3>
                            <ol className={styles.stepList}>
                                {recipe.steps.map((step, i) => (
                                    <li key={i} className={styles.stepItem}>
                                        <div className={styles.stepNumber}>{i + 1}</div>
                                        <p className={styles.stepText}>{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {recipe.tags.length > 0 && (
                        <div className={styles.tagsSection}>
                            <h3 className={styles.sectionTitle}>🏷️ Tags</h3>
                            <div className={styles.tags}>
                                {recipe.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.dateInfo}>
                        <span>Added: {new Date(recipe.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
