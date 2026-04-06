'use client';

import React, { useState, useCallback } from 'react';
import { Recipe, CATEGORIES, RecipeCategory, Ingredient } from '@/types/recipe';
import styles from './RecipeForm.module.css';

interface RecipeFormProps {
    initialRecipe?: Partial<Recipe>;
    onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

const defaultRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '',
    description: '',
    category: 'Dinner',
    familyMember: '',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [{ id: generateId(), name: '', amount: '', unit: '' }],
    steps: [''],
    tags: [],
    image: '',
    isFavorite: false,
    notes: '',
};

export default function RecipeForm({ initialRecipe, onSubmit, onCancel, isEditing }: RecipeFormProps) {
    const [form, setForm] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>({
        ...defaultRecipe,
        ...initialRecipe,
        ingredients: initialRecipe?.ingredients?.length
            ? initialRecipe.ingredients
            : defaultRecipe.ingredients,
        steps: initialRecipe?.steps?.length ? initialRecipe.steps : defaultRecipe.steps,
        tags: initialRecipe?.tags || [],
    });
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState(initialRecipe?.image || '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = useCallback(<K extends keyof typeof form>(
        key: K,
        value: typeof form[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: '' }));
    }, []);

    // Ingredients
    const addIngredient = () => {
        setForm(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { id: generateId(), name: '', amount: '', unit: '' }],
        }));
    };

    const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.map(ing =>
                ing.id === id ? { ...ing, [field]: value } : ing
            ),
        }));
    };

    const removeIngredient = (id: string) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter(ing => ing.id !== id),
        }));
    };

    // Steps
    const addStep = () => {
        setForm(prev => ({ ...prev, steps: [...prev.steps, ''] }));
    };

    const updateStep = (index: number, value: string) => {
        setForm(prev => {
            const steps = [...prev.steps];
            steps[index] = value;
            return { ...prev, steps };
        });
    };

    const removeStep = (index: number) => {
        setForm(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
    };

    // Tags
    const addTag = () => {
        const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
        if (tag && !form.tags.includes(tag)) {
            setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    // Image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                setImagePreview(result);
                setForm(prev => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrl = (url: string) => {
        setImagePreview(url);
        setForm(prev => ({ ...prev, image: url }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = 'Recipe name is required';
        if (!form.familyMember.trim()) newErrors.familyMember = 'Family member name is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        if (form.ingredients.every(i => !i.name.trim())) newErrors.ingredients = 'Add at least one ingredient';
        if (form.steps.every(s => !s.trim())) newErrors.steps = 'Add at least one step';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const cleanForm = {
            ...form,
            ingredients: form.ingredients.filter(i => i.name.trim()),
            steps: form.steps.filter(s => s.trim()),
        };
        onSubmit(cleanForm);
    };

    return (
        <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onCancel()}>
            <div className={styles.modal} role="dialog" aria-modal="true">
                <div className={styles.header}>
                    <h2 className={styles.title}>{isEditing ? '✏️ Edit Recipe' : '✨ Add New Recipe'}</h2>
                    <button className={styles.closeBtn} onClick={onCancel} aria-label="Close form">✕</button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>📝 Basic Information</h3>
                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Recipe Name *</label>
                                <input
                                    id="recipe-title"
                                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                                    value={form.title}
                                    onChange={e => updateField('title', e.target.value)}
                                    placeholder="e.g. Grandma's Apple Pie"
                                />
                                {errors.title && <span className={styles.error}>{errors.title}</span>}
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Family Member *</label>
                                <input
                                    id="recipe-family-member"
                                    className={`${styles.input} ${errors.familyMember ? styles.inputError : ''}`}
                                    value={form.familyMember}
                                    onChange={e => updateField('familyMember', e.target.value)}
                                    placeholder="e.g. Grandma Rose"
                                />
                                {errors.familyMember && <span className={styles.error}>{errors.familyMember}</span>}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Description *</label>
                            <textarea
                                id="recipe-description"
                                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                                value={form.description}
                                onChange={e => updateField('description', e.target.value)}
                                placeholder="A short description of the recipe and its story..."
                                rows={3}
                            />
                            {errors.description && <span className={styles.error}>{errors.description}</span>}
                        </div>

                        <div className={styles.fieldGrid3}>
                            <div className={styles.field}>
                                <label className={styles.label}>Category</label>
                                <select
                                    id="recipe-category"
                                    className={styles.select}
                                    value={form.category}
                                    onChange={e => updateField('category', e.target.value as RecipeCategory)}
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Difficulty</label>
                                <select
                                    id="recipe-difficulty"
                                    className={styles.select}
                                    value={form.difficulty}
                                    onChange={e => updateField('difficulty', e.target.value as Recipe['difficulty'])}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Servings</label>
                                <input
                                    id="recipe-servings"
                                    className={styles.input}
                                    type="number"
                                    min={1}
                                    value={form.servings}
                                    onChange={e => updateField('servings', Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Prep Time (minutes)</label>
                                <input
                                    id="recipe-prep-time"
                                    className={styles.input}
                                    type="number"
                                    min={0}
                                    value={form.prepTime}
                                    onChange={e => updateField('prepTime', Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Cook Time (minutes)</label>
                                <input
                                    id="recipe-cook-time"
                                    className={styles.input}
                                    type="number"
                                    min={0}
                                    value={form.cookTime}
                                    onChange={e => updateField('cookTime', Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>📸 Recipe Photo</h3>
                        {imagePreview && (
                            <div className={styles.imagePreview}>
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    className={styles.removeImageBtn}
                                    onClick={() => { setImagePreview(''); setForm(prev => ({ ...prev, image: '' })); }}
                                >✕</button>
                            </div>
                        )}
                        <div className={styles.imageOptions}>
                            <label className={styles.uploadLabel}>
                                📁 Upload Photo
                                <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} />
                            </label>
                            <div className={styles.urlField}>
                                <input
                                    id="recipe-image-url"
                                    className={styles.input}
                                    placeholder="Or paste image URL..."
                                    onBlur={e => handleImageUrl(e.target.value)}
                                    defaultValue={form.image?.startsWith('http') ? form.image : ''}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🥘 Ingredients</h3>
                        {errors.ingredients && <p className={styles.error}>{errors.ingredients}</p>}
                        <div className={styles.ingredientList}>
                            {form.ingredients.map((ing, i) => (
                                <div key={ing.id} className={styles.ingredientRow}>
                                    <input
                                        className={`${styles.input} ${styles.ingAmount}`}
                                        placeholder="Amount"
                                        value={ing.amount}
                                        onChange={e => updateIngredient(ing.id, 'amount', e.target.value)}
                                    />
                                    <input
                                        className={`${styles.input} ${styles.ingUnit}`}
                                        placeholder="Unit"
                                        value={ing.unit}
                                        onChange={e => updateIngredient(ing.id, 'unit', e.target.value)}
                                    />
                                    <input
                                        className={`${styles.input} ${styles.ingName}`}
                                        placeholder="Ingredient name"
                                        value={ing.name}
                                        onChange={e => updateIngredient(ing.id, 'name', e.target.value)}
                                    />
                                    {form.ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            className={styles.removeBtn}
                                            onClick={() => removeIngredient(ing.id)}
                                        >✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className={styles.addBtn} onClick={addIngredient}>
                            + Add Ingredient
                        </button>
                    </div>

                    {/* Steps */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>📋 Instructions</h3>
                        {errors.steps && <p className={styles.error}>{errors.steps}</p>}
                        <div className={styles.stepList}>
                            {form.steps.map((step, i) => (
                                <div key={i} className={styles.stepRow}>
                                    <div className={styles.stepNum}>{i + 1}</div>
                                    <textarea
                                        className={`${styles.textarea} ${styles.stepInput}`}
                                        placeholder={`Step ${i + 1}...`}
                                        value={step}
                                        rows={2}
                                        onChange={e => updateStep(i, e.target.value)}
                                    />
                                    {form.steps.length > 1 && (
                                        <button
                                            type="button"
                                            className={styles.removeBtn}
                                            onClick={() => removeStep(i)}
                                        >✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className={styles.addBtn} onClick={addStep}>
                            + Add Step
                        </button>
                    </div>

                    {/* Tags */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🏷️ Tags</h3>
                        <div className={styles.tagInputRow}>
                            <input
                                id="recipe-tag-input"
                                className={styles.input}
                                placeholder="Add a tag and press Enter..."
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                            />
                            <button type="button" className={styles.addTagBtn} onClick={addTag}>Add</button>
                        </div>
                        <div className={styles.tagList}>
                            {form.tags.map(tag => (
                                <span key={tag} className={styles.tag}>
                                    #{tag}
                                    <button type="button" onClick={() => removeTag(tag)} className={styles.removeTag}>✕</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>💡 Family Notes</h3>
                        <textarea
                            id="recipe-notes"
                            className={styles.textarea}
                            placeholder="Any secrets, tips, or family stories about this recipe..."
                            value={form.notes}
                            rows={3}
                            onChange={e => updateField('notes', e.target.value)}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} id="recipe-form-submit">
                            {isEditing ? '💾 Save Changes' : '✨ Add Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
