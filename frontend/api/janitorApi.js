/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Provides janitor api integration and shared functionality for the Expo mobile application.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: frontend/api/client.js.
 * Imported or linked from: frontend/App/hooks/useJanitors.js, frontend/App/screens/Janitor/JanitorRegistrationScreen.jsx, frontend/App/screens/Janitor/JanitorStatusScreen.jsx, frontend/App/screens/JobStatusScreen.jsx, frontend/App/screens/NearbyJanitorsScreen.jsx.
 * Backend API routes: backend/app/routes/janitor_routes.py.
 */

/**
 * Janitor API Module.
 *
 * Endpoints:
 *   GET   /v1/janitors/nearby?lat=&lng=&service_type= — ranked list
 *   GET   /v1/janitors/:id                             — public profile
 *   PATCH /v1/janitors/me/availability?available=       — toggle online
 *
 * @module api/janitorApi
 */

import client from './client';

/**
 * Get ranked list of nearby available janitors.
 *
 * @param {number} lat - Job latitude
 * @param {number} lng - Job longitude
 * @param {string} serviceType - Requested service
 * @returns {Promise<{data: Array|null, error: string|null}>}
 */
export const getNearbyJanitors = (lat, lng, serviceType) =>
  client.get(
    `/janitors/nearby?lat=${lat}&lng=${lng}&service_type=${encodeURIComponent(serviceType)}`,
  );

/**
 * Get a janitor's public profile.
 * @param {string} id
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export const getJanitorProfile = (id) => client.get(`/janitors/${id}`);

/**
 * Toggle the current janitor's availability.
 * Optionally sends current GPS location for dispatch accuracy.
 *
 * @param {boolean} available
 * @param {number} [lat] - Current latitude
 * @param {number} [lng] - Current longitude
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export const updateAvailability = (available, lat = null, lng = null) => {
  let url = `/janitors/me/availability?available=${available}`;
  if (lat != null && lng != null) {
    url += `&lat=${lat}&lng=${lng}`;
  }
  return client.patch(url);
};

/**
 * Register the current user as a janitor.
 * @param {{ phone: string, address: string, service_types: string[], experience: string, bio: string }} data
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export const registerJanitor = (data) =>
  client.post('/janitors/register', data);
