/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides legal api integration and shared functionality for the Expo mobile application.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: frontend/api/client.js.
 * Imported or linked from: frontend/App/screens/LegalScreen.jsx.
 */

/**
 * Legal API Module.
 *
 * Fetches the current Terms & Conditions and Privacy Policy (Markdown) from
 * the public backend endpoints. No auth required.
 *
 *   GET /v1/legal/terms    — { doc_type, version, content_md }
 *   GET /v1/legal/privacy  — { doc_type, version, content_md }
 *
 * @module api/legalApi
 */

import client from './client';

/**
 * @param {'terms'|'privacy'} docType
 * @returns {Promise<{data: {doc_type, version, content_md}|null, error: string|null}>}
 */
export const getLegalDoc = (docType) => client.get(`/legal/${docType}`);
