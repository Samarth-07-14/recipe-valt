'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed.');
                return;
            }

            // Auto sign-in after registration
            const signInRes = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (signInRes?.error) {
                router.push('/login');
            } else {
                router.push('/');
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
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />

            <div className={styles.card}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>🍽️</div>
                    <div>
                        <div className={styles.logoTitle}>Family Recipe Vault</div>
                        <div className={styles.logoSub}>Culinary Heritage Preserved</div>
                    </div>
                </div>

                <div className={styles.heading}>
                    <h1 className={styles.title}>Create your account</h1>
                    <p className={styles.subtitle}>Start preserving your family&apos;s culinary legacy</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="name">Full Name</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>👤</span>
                            <input
                                id="name"
                                type="text"
                                className={styles.input}
                                placeholder="Your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                autoComplete="name"
                            />
                        </div>
                    </div>

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
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="confirm">Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🔑</span>
                            <input
                                id="confirm"
                                type="password"
                                className={styles.input}
                                placeholder="Repeat your password"
                                value={form.confirm}
                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error} role="alert">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        id="register-btn"
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.btnSpinner} />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <span className={styles.btnArrow}>→</span>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>Already have an account?</span>
                </div>

                <Link href="/login" className={styles.switchLink} id="go-login">
                    Sign in instead
                </Link>
            </div>
        </div>
    );
}
