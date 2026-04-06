'use client';

import React, { useState, useMemo } from 'react';
import { Recipe, RecipeCategory, CATEGORIES, CATEGORY_EMOJIS } from '@/types/recipe';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import RecipeForm from '@/components/RecipeForm';
import styles from './page.module.css';
import { useSession, signOut } from 'next-auth/react';

type SortOption = 'newest' | 'oldest' | 'az' | 'za' | 'favorites';

export default function Home() {
  const { recipes, isLoaded, addRecipe, updateRecipe, deleteRecipe, toggleFavorite } = useRecipes();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'All' | 'Favorites'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const filtered = useMemo(() => {
    let result = [...recipes];

    if (selectedCategory === 'Favorites') {
      result = result.filter(r => r.isFavorite);
    } else if (selectedCategory !== 'All') {
      result = result.filter(r => r.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.familyMember.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some(t => t.includes(q)) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'newest': result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case 'oldest': result.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
      case 'az': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'za': result.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'favorites': result.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)); break;
    }

    return result;
  }, [recipes, selectedCategory, searchQuery, sortBy]);

  const stats = useMemo(() => ({
    total: recipes.length,
    favorites: recipes.filter(r => r.isFavorite).length,
    categories: new Set(recipes.map(r => r.category)).size,
    members: new Set(recipes.map(r => r.familyMember)).size,
  }), [recipes]);

  const handleAdd = (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    addRecipe(data);
    setShowAddForm(false);
  };

  const handleEdit = (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id, data);
      setEditingRecipe(null);
      setSelectedRecipe(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteRecipe(id);
    setSelectedRecipe(null);
  };

  const handleOpenEdit = () => {
    if (selectedRecipe) {
      setEditingRecipe(selectedRecipe);
      setSelectedRecipe(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading your family vault...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🍽️</div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Family Recipe Vault</span>
              <span className={styles.logoSub}>Culinary Heritage Preserved</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              className={`${styles.navBtn} ${selectedCategory === 'All' ? styles.navBtnActive : ''}`}
              onClick={() => setSelectedCategory('All')}
            >All Recipes</button>
            <button
              className={`${styles.navBtn} ${selectedCategory === 'Favorites' ? styles.navBtnActive : ''}`}
              onClick={() => setSelectedCategory('Favorites')}
            >❤️ Favorites</button>
          </nav>

          <div className={styles.headerRight}>
            <button
              className={styles.addBtn}
              onClick={() => setShowAddForm(true)}
              id="add-recipe-btn"
            >
              <span className={styles.addBtnIcon}>+</span>
              <span>Add Recipe</span>
            </button>

            {/* User menu */}
            <div className={styles.userMenu}>
              <button
                className={styles.userAvatar}
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-menu-btn"
                aria-label="User menu"
              >
                {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?'}
              </button>
              {showUserMenu && (
                <div className={styles.userDropdown}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{session?.user?.name || 'User'}</span>
                    <span className={styles.userEmail}>{session?.user?.email}</span>
                  </div>
                  <button
                    className={styles.logoutBtn}
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    id="logout-btn"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Your Family's<br />
            <span className={styles.heroTitleAccent}>Culinary Legacy</span>
          </h1>
          <p className={styles.heroSub}>
            Every recipe has a story. Preserve the flavors, memories, and love
            of your family's kitchen for generations to come.
          </p>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>Recipes</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.favorites}</span>
              <span className={styles.statLabel}>Favorites</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.categories}</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.members}</span>
              <span className={styles.statLabel}>Family Members</span>
            </div>
          </div>
        </div>

        {/* Floating recipe cards decoration */}
        <div className={styles.heroDecoration} aria-hidden="true">
          {['🍰', '🍝', '🥧', '🍲', '🥞'].map((emoji, i) => (
            <div key={i} className={`${styles.floatingCard} ${styles[`floatingCard${i}`]}`}>
              {emoji}
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <section className={styles.controls}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            id="recipe-search"
            className={styles.searchInput}
            type="search"
            placeholder="Search recipes, ingredients, family members..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>

        <div className={styles.filterRow}>
          <div className={styles.categoryFilters}>
            <button
              className={`${styles.catBtn} ${selectedCategory === 'All' ? styles.catBtnActive : ''}`}
              onClick={() => setSelectedCategory('All')}
              id="filter-all"
            >All</button>
            <button
              className={`${styles.catBtn} ${selectedCategory === 'Favorites' ? styles.catBtnActive : ''}`}
              onClick={() => setSelectedCategory('Favorites')}
              id="filter-favorites"
            >❤️ Favorites</button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.catBtn} ${selectedCategory === cat ? styles.catBtnActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {CATEGORY_EMOJIS[cat]} {cat}
              </button>
            ))}
          </div>

          <select
            id="recipe-sort"
            className={styles.sortSelect}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="favorites">Favorites First</option>
          </select>
        </div>
      </section>

      {/* Recipe Grid */}
      <main className={styles.main}>
        {filtered.length > 0 ? (
          <>
            <div className={styles.resultsInfo}>
              <span className={styles.resultsCount}>
                {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}
                {selectedCategory !== 'All' && ` · ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            </div>
            <div className={styles.grid} id="recipe-grid">
              {filtered.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavorite={() => toggleFavorite(recipe.id)}
                  onDelete={() => handleDelete(recipe.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {searchQuery ? '🔍' : selectedCategory === 'Favorites' ? '❤️' : '📖'}
            </div>
            <h2 className={styles.emptyTitle}>
              {searchQuery
                ? `No recipes found for "${searchQuery}"`
                : selectedCategory === 'Favorites'
                  ? 'No favorites yet'
                  : `No ${selectedCategory} recipes yet`}
            </h2>
            <p className={styles.emptyText}>
              {searchQuery
                ? 'Try searching with different keywords, or add a new recipe!'
                : 'Start building your family recipe vault by adding your first recipe.'}
            </p>
            {!searchQuery && (
              <button
                className={styles.emptyAddBtn}
                onClick={() => setShowAddForm(true)}
                id="empty-add-recipe-btn"
              >
                + Add Your First Recipe
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>🍽️ Family Recipe Vault</div>
          <p className={styles.footerText}>
            Made with ❤️ to preserve culinary heritage for generations.
          </p>
          <p className={styles.footerNote}>Your recipes are safely stored in the cloud database.</p>
        </div>
      </footer>

      {/* Floating Add Button (mobile) */}
      <button
        className={styles.fab}
        onClick={() => setShowAddForm(true)}
        aria-label="Add new recipe"
        id="fab-add-recipe"
      >+</button>

      {/* Modals */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={handleOpenEdit}
          onFavorite={() => toggleFavorite(selectedRecipe.id)}
        />
      )}

      {showAddForm && (
        <RecipeForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingRecipe && (
        <RecipeForm
          initialRecipe={editingRecipe}
          onSubmit={handleEdit}
          onCancel={() => setEditingRecipe(null)}
          isEditing
        />
      )}
    </div>
  );
}
