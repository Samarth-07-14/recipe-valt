'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './auth.module.css';

import { Suspense } from 'react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid email or password. Please try again.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Background orbs */}
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />

            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>🍽️</div>
                    <div>
                        <div className={styles.logoTitle}>Family Recipe Vault</div>
                        <div className={styles.logoSub}>Culinary Heritage Preserved</div>
                    </div>
                </div>

                <div className={styles.heading}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to access your family recipes</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email address</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>✉️</span>
                            <input
                                id="email"
                                type="email"
                                className={styles.input}
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🔒</span>
                            <input
                                id="password"
                                type="password"
                                className={styles.input}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error} role="alert">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        id="login-btn"
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.btnSpinner} />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <span className={styles.btnArrow}>→</span>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>Don&apos;t have an account?</span>
                </div>

                <Link href="/register" className={styles.switchLink} id="go-register">
                    Create a free account
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
