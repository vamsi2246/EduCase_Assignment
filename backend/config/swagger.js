const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitGauge SaaS Analyzer API',
      version: '1.0.0',
      description: `
🚀 **Welcome to the GitGauge API Reference Manual & Sandbox!**

GitGauge is a high-performance, production-ready Full-Stack developer portfolio profiling system. It connects directly with the public GitHub REST API, processes candidate metrics, calculates weighted developer scores, ranks candidates into experience levels, and logs query metrics inside a local MySQL audit store.

### Key Backend Technical Capabilities:
- **Centralized MVC Architecture:** Standardized router mappings, data-driven model wrappers, and separated controllers.
- **Robust Client Gates:** Dual rate limit walls protecting external API tokens and internal server resources.
- **Regular Expression Gatekeepers:** High-fidelity username and query validation preventing invalid/malicious query injections.
- **Atomic MySQL Persistence:** Clean transaction-safe profile syncs and structured logs.
      `,
      contact: {
        name: 'Vamsi Krishna (Candidate)',
        email: 'vamsikrishna.edu@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Local Development Sandbox Server',
      },
    ],
    paths: {
      '/api/profile/{username}': {
        get: {
          summary: 'Trigger Live Profile Analysis & Cache',
          description: 'Fetches live profile metrics, repos, and activity events from the GitHub API. Processes weighted scoring, ranks candidate tiers, upserts MySQL profile caches, logs the attempt, and yields full evaluation results.',
          parameters: [
            {
              name: 'username',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$'
              },
              description: 'Valid GitHub username handle to sync and evaluate.',
              example: 'yyx990803'
            }
          ],
          responses: {
            200: {
              description: 'Profile sync and analysis successfully completed.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Profile analyzed and stored successfully.' },
                      data: { type: 'object' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Invalid username format or constraints violation.'
            },
            404: {
              description: 'GitHub handle does not exist.'
            },
            429: {
              description: 'API Rate limit exceeded (20 requests per 15 minutes).'
            },
            500: {
              description: 'Internal server error.'
            }
          }
        }
      },
      '/api/profiles': {
        get: {
          summary: 'Fetch Directory of Analyzed Profiles',
          description: 'Retrieve lists of candidate profiles synced inside the MySQL database, decorated with pagination parameters and complex filter sorting rules.',
          parameters: [
            {
              name: 'page',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 1 },
              description: 'Page index offset.'
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
              description: 'Number of items per page.'
            },
            {
              name: 'sortBy',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['profile_score', 'followers', 'public_repos', 'total_stars', 'created_at'],
                default: 'created_at'
              },
              description: 'Column target for ranking sequence.'
            },
            {
              name: 'order',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'desc'
              },
              description: 'Sort direction.'
            },
            {
              name: 'developer_level',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
              },
              description: 'Filter candidates by experience badges.'
            },
            {
              name: 'top_language',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Filter by dominant coding language.',
              example: 'TypeScript'
            }
          ],
          responses: {
            200: {
              description: 'Paginated candidate profiles successfully loaded.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Analyzed profiles retrieved successfully.' },
                      data: { type: 'array', items: { type: 'object' } },
                      meta: { type: 'object' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/profiles/{id}': {
        get: {
          summary: 'Fetch Single Cached Profile Details',
          description: 'Get deep cached analysis statistics, aggregated scores, location tags, and dynamic repositories list for a profile by database ID.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'Database unique identifier (Auto-increment ID).',
              example: 12
            }
          ],
          responses: {
            200: {
              description: 'Candidate profile details successfully loaded.'
            },
            404: {
              description: 'Profile ID not found.'
            }
          }
        }
      },
      '/api/history': {
        get: {
          summary: 'Fetch Search History Audit Logs',
          description: 'Retrieves chronological record database search events, logging client IP indicators, target handlers, execution statuses, and potential errors.',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 50, minimum: 1, maximum: 100 },
              description: 'Maximum audit records to retrieve.'
            }
          ],
          responses: {
            200: {
              description: 'Audit history successfully loaded.'
            }
          }
        }
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJsDoc(options);

const customOptions = {
  customSiteTitle: 'GitGauge API Docs - SaaS Profile Analyzer',
  customCss: `
    .swagger-ui .topbar { background-color: #0b0f19; border-bottom: 1px solid #1f2937; }
    .swagger-ui { background-color: #030712; color: #f3f4f6; font-family: Inter, system-ui, sans-serif; }
    .swagger-ui .info .title { color: #f3f4f6; }
    .swagger-ui .info p, .swagger-ui .info li { color: #9ca3af; }
    .swagger-ui .scheme-container { background-color: #0b0f19; box-shadow: none; border-bottom: 1px solid #1f2937; }
    .swagger-ui .opblock.opblock-get { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3); }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #10b981; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: rgba(16, 185, 129, 0.2); }
    .swagger-ui section.models { border-color: #1f2937; }
    .swagger-ui section.models .model-container { background-color: #0b0f19; }
    .swagger-ui input[type=text] { background-color: #1f2937; color: #f3f4f6; border: 1px solid #374151; }
  `
};

module.exports = {
  swaggerUi,
  swaggerSpec,
  customOptions
};
