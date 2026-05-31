# Technical Interview Preparation Guide: GitGauge SaaS

This document provides a highly structured breakdown of advanced system-level questions and expert-grade answers regarding the design decisions, patterns, algorithms, and architectural models applied in this GitGauge Full-Stack monorepo. Use this as a guide to master your backend and full-stack technical rounds!

---

## 1. System Architecture & Express Bootstrapping

### Q: Why did you decide to decouple your React.js client and Express.js backend instead of serving them as a unified server, and how is it organized?
**Expert Answer:**
"Decoupling the frontend and backend is an industry-standard architectural best practice for production SaaS applications:
1. **Separation of Concerns:** The Express backend remains a purely stateless JSON API focusing exclusively on computation, metrics calculations, database transactions, and rate limiting. The React client acts as a high-fidelity visual render, compiled and served separately by Vite's bundler.
2. **Decoupled Scaling:** In production, the backend is highly CPU-intensive due to calculations and external API fetches, while the frontend is static asset delivery. We can deploy the React client to a Global CDN (like Vercel or Cloudflare Pages) for near-instant rendering worldwide, while deploying the Node/MySQL backend to horizontal container instances (like Railway or AWS ECS) to scale with database loads.
3. **Monorepo Structure:** We organize the files inside `/frontend` and `/backend` subfolders under a single workspace. This enables unified git tracking, simple local setups, and clean environment parameters matching the exact project structure."

### Q: Express v5 was used. What routing or path matching bugs does it introduce, and how did you resolve them?
**Expert Answer:**
"Express 5 upgraded its underlying path compiler library `path-to-regexp`. In Express 4, standard route catching and fallback middleware utilized the raw wildcard string `app.all('*')`.
In Express 5, this syntax is deprecated and throws a fatal routing exception (`TypeError: Missing parameter name at index 1: *`).
To solve this in a robust, future-proof manner that works across both Express 4 and 5, we migrated the catch-all layer from `app.all('*')` to a global path-agnostic middleware binder `app.use((req, res, next) => { ... })`. Registering the catch-all middleware without an explicit route string intercepts all unmatched HTTP methods safely."

---

## 2. Database Design & Upsert Operations

### Q: How did you implement duplicate username prevention, and why did you choose MySQL's upsert over sequential SELECT/INSERT commands?
**Expert Answer:**
"To enforce data integrity and prevent duplicate developer records, we applied a multi-tier design:
1. **Unique Index:** We defined a `UNIQUE` index constraint on the `username` column in our `profiles` schema.
2. **Atomic SQL Upsert (`INSERT ... ON DUPLICATE KEY UPDATE`):** If we executed a `SELECT` query in Node to check if a username existed followed by an `INSERT` or `UPDATE` in separate database roundtrips, we would introduce a **Race Condition** known as *Time-of-Check to Time-of-Use (TOCTOU)*. Under high concurrent spams, two parallel requests might check for the same handle, verify it doesn't exist, and attempt to write it simultaneously, throwing database constraint violations.
Using a single atomic SQL statement guarantees that the database handles duplication checks internally. If the username exists, it updates the cached columns and increments the `updated_at` timestamp. This reduces database network roundtrips to exactly `1` and ensures 100% database integrity."

---

## 3. High-Fidelity Custom React Vector Graphics

### Q: The React frontend uses custom SVG elements for charts instead of importing charting libraries. What is the rationale behind this, and how does it work?
**Expert Answer:**
"We built custom animated SVG components (like the Donut Language Chart and the Stars Comparison Bar Chart) to demonstrate a high degree of vector engineering capability and optimize bundle performance:
1. **Zero External Dependencies:** Standard React charting libraries (such as Recharts or Chart.js) add heavy chunks to the final bundle, frequently suffer from canvas sizing issues on mobile, and are prone to npm peer-dependency version conflicts.
2. **Performance:** SVG elements are native vector graphics tracked inside the React DOM tree. This means they are infinitely scalable, responsive out of the box, and render with zero initialization lag.
3. **SVG Arc Math:** In [LanguageChart.jsx](file:///Users/apple/Desktop/EduCase_Assignment/frontend/src/components/Charts/LanguageChart.jsx), we map language percentages to circular segments by computing path stroke dasharrays (`strokeDasharray={strokeLength circumference}`). We rotate segments programmatically using the formula `rotate(angle)` where `angle` is computed from the accumulated language percentages. Hovering triggers React state hooks that dynamically change stroke weights and apply high-contrast SVG dropshadow filters."
