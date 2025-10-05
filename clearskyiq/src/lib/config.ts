/**
 * Configuration for the Harmony API
 */

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_HARMONY_API_URL || 'http://localhost:8000',
  apiToken: process.env.NEXT_PUBLIC_HARMONY_API_TOKEN || 'bumbumbakudan',
} as const;

export const apiEndpoints = {
  health: `${config.apiUrl}/health`,
  visualize: `${config.apiUrl}/tempo/visualize`,
  visualizeAll: `${config.apiUrl}/tempo/visualize/all`,
  visualizeParallel: `${config.apiUrl}/tempo/visualize/parallel`,
  visualizeStatus: (jobId: string) => `${config.apiUrl}/tempo/visualize/status/${jobId}`,
  visualizeResults: (jobId: string) => `${config.apiUrl}/tempo/visualize/results/${jobId}`,
  cacheStatus: `${config.apiUrl}/cache/status`,
} as const;

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${config.apiToken}`,
} as const;
