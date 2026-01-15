# Tekton Studio API

FastAPI-based backend service for Tekton Studio's Curated Presets system, providing intelligent preset management and MCP-powered suggestions.

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 16+
- uv (Python package manager)

### Installation

```bash
# Install dependencies
uv sync

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup

```bash
# Run migrations
alembic upgrade head

# Verify migration
alembic current
```

### Development Server

```bash
# Start API server
uvicorn studio_api.main:app --reload --port 8000

# API documentation available at:
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)
```

### Running Tests

```bash
# Run all tests with coverage
pytest

# Run specific test file
pytest tests/test_api.py -v

# Generate HTML coverage report
pytest --cov-report=html
open htmlcov/index.html
```

---

## Architecture Overview

### System Design

Tekton Studio API follows a **Clean Architecture** pattern with clear separation of concerns:

```
src/studio_api/
├── api/              # API endpoints and routing
│   └── v2/          # API version 2 (Curated Presets)
├── core/            # Core configuration and utilities
├── models/          # SQLAlchemy database models
├── repositories/    # Data access layer (database operations)
├── schemas/         # Pydantic validation schemas
└── services/        # Business logic and external integrations
```

### Technology Stack

**Backend Framework**:
- **FastAPI 0.118.3+**: Modern async web framework with automatic OpenAPI documentation
- **Uvicorn**: ASGI server for high-performance async Python

**Database**:
- **PostgreSQL 16+**: Relational database with JSONB support for flexible metadata
- **SQLAlchemy 2.0**: Async ORM for database operations
- **Alembic 1.13+**: Database migration management

**Validation & Configuration**:
- **Pydantic 2.9+**: Runtime type validation and settings management
- **Python-dotenv**: Environment variable management

**Testing**:
- **pytest 8.0+**: Testing framework with async support
- **pytest-cov**: Coverage reporting (target: ≥85%)
- **httpx**: Async HTTP client for API testing
- **aiosqlite**: In-memory database for testing

**Code Quality**:
- **Ruff 0.8+**: Fast Python linter and formatter
- **Mypy 1.13+**: Static type checking

---

## API Reference

### Curated Presets API (v2)

#### List Presets

```http
GET /api/v2/presets?page=1&size=20&category=Brand&search=Tech&tags=startup
```

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `size` (integer, optional): Items per page (default: 20, max: 100)
- `category` (string, optional): Filter by category
- `search` (string, optional): Search in name and description
- `tags` (array, optional): Filter by tags

**Response**:
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Tech Startup Brand",
      "description": "Modern tech startup preset",
      "category": "Brand",
      "thumbnail_url": "https://example.com/image.png",
      "tags": ["startup", "tech", "modern"],
      "config": {"key": "value"},
      "is_active": true,
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-01-15T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "size": 20,
  "pages": 3
}
```

#### Get Preset by ID

```http
GET /api/v2/presets/{preset_id}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Tech Startup Brand",
  "description": "Detailed description...",
  "category": "Brand",
  "thumbnail_url": "https://example.com/image.png",
  "tags": ["startup", "tech", "modern"],
  "config": {
    "colorScheme": "vibrant",
    "fontFamily": "Inter",
    "style": "modern"
  },
  "is_active": true,
  "created_at": "2026-01-15T00:00:00Z",
  "updated_at": "2026-01-15T00:00:00Z"
}
```

#### Get Preset Categories

```http
GET /api/v2/presets/categories
```

**Response**:
```json
{
  "categories": [
    {"name": "Brand", "count": 25},
    {"name": "Product", "count": 15},
    {"name": "Campaign", "count": 10}
  ]
}
```

#### Get MCP Preset Suggestions

```http
GET /api/v2/presets/suggestions?context=tech_startup
```

**Query Parameters**:
- `context` (string, optional): User project context for intelligent suggestions

**Response**:
```json
{
  "presets": [
    {
      "id": "uuid",
      "name": "Tech Startup Brand",
      "confidence": 0.95
    }
  ],
  "fallback_mode": false,
  "source": "mcp"
}
```

---

## Database Schema

### Curated Presets Table

```sql
CREATE TABLE curated_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    thumbnail_url VARCHAR(500),
    tags TEXT[],
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_curated_presets_category ON curated_presets(category);
CREATE INDEX idx_curated_presets_name ON curated_presets(name);
CREATE INDEX idx_curated_presets_is_active ON curated_presets(is_active);
CREATE INDEX idx_curated_presets_tags ON curated_presets USING GIN(tags);
```

### Migration Management

```bash
# Create new migration
alembic revision --autogenerate -m "Description of change"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history --verbose
```

---

## Development Guide

### Project Structure

```
packages/studio-api/
├── src/
│   └── studio_api/
│       ├── api/              # API endpoints
│       │   └── v2/
│       │       └── presets.py
│       ├── core/             # Core configuration
│       │   ├── config.py
│       │   └── database.py
│       ├── models/           # SQLAlchemy models
│       │   └── curated_preset.py
│       ├── repositories/     # Data access layer
│       │   └── curated_preset.py
│       ├── schemas/          # Pydantic schemas
│       │   └── curated_preset.py
│       ├── services/         # Business logic
│       │   └── mcp_client.py
│       └── main.py           # FastAPI application
├── tests/
│   ├── conftest.py           # Test fixtures
│   ├── test_api.py           # API endpoint tests
│   ├── test_models.py        # Database model tests
│   ├── test_repository_coverage.py
│   └── test_mcp_integration.py
├── alembic/                  # Database migrations
│   ├── versions/
│   └── env.py
├── pyproject.toml            # Project configuration
├── alembic.ini               # Alembic configuration
└── README.md                 # This file
```

### Coding Standards

**Style Guide**:
- Follow [PEP 8](https://peps.python.org/pep-0008/) Python style guide
- Use Ruff for linting and formatting
- 100 characters line length
- Type hints required for all functions

**Code Quality**:
```bash
# Run linter
ruff check src/ tests/

# Auto-fix issues
ruff check --fix src/ tests/

# Type checking
mypy src/
```

**Testing Requirements**:
- Minimum 85% code coverage (TRUST 5 Framework)
- All new features must include tests
- Test naming: `test_<function>_<scenario>`

### Adding New Endpoints

```python
# 1. Create Pydantic schema (schemas/new_feature.py)
from pydantic import BaseModel

class NewFeatureCreate(BaseModel):
    name: str
    description: str | None = None

# 2. Create SQLAlchemy model (models/new_feature.py)
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

class NewFeature(Base):
    __tablename__ = "new_features"
    id = Column(UUID, primary_key=True)
    name = Column(String(255), nullable=False)

# 3. Create repository (repositories/new_feature.py)
class NewFeatureRepository:
    async def create(self, db: AsyncSession, data: NewFeatureCreate):
        # Implementation

# 4. Create API endpoint (api/v2/new_feature.py)
from fastapi import APIRouter

router = APIRouter(prefix="/new-features", tags=["new-features"])

@router.post("/")
async def create_feature(data: NewFeatureCreate):
    # Implementation

# 5. Add tests (tests/test_new_feature.py)
@pytest.mark.asyncio
async def test_create_feature(async_client):
    response = await async_client.post("/api/v2/new-features", json={})
    assert response.status_code == 201
```

---

## MCP Integration

### Studio MCP Client

The API integrates with the `studio-mcp` server for intelligent preset suggestions.

**Configuration**:
```python
# core/config.py
class Settings(BaseSettings):
    MCP_SERVER_URL: str = "http://localhost:3000"
    MCP_TIMEOUT: int = 5  # seconds
```

**Usage**:
```python
from studio_api.services.mcp_client import MCPClient

client = MCPClient()
suggestions = await client.get_preset_suggestions(context="tech_startup")
```

**Fallback Mechanism**:
- If MCP server unavailable, returns default preset list
- Circuit breaker pattern prevents cascading failures
- Logs errors for monitoring and alerting

---

## Deployment

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/studio_api

# API Configuration
API_V2_PREFIX=/api/v2
DEBUG=false

# MCP Integration
MCP_SERVER_URL=http://localhost:3000
MCP_TIMEOUT=5

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=["localhost", "studio.example.com"]
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install uv
RUN uv sync --frozen

CMD ["uvicorn", "studio_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t studio-api .
docker run -p 8000:8000 studio-api
```

---

## Testing

### Test Structure

```python
# tests/conftest.py - Shared fixtures
@pytest.fixture
async def db_session():
    """Provide async database session for tests"""
    # Implementation

@pytest.fixture
async def async_client(db_session):
    """Provide async HTTP client for API tests"""
    # Implementation

# tests/test_api.py - API endpoint tests
@pytest.mark.asyncio
async def test_list_presets(async_client):
    response = await async_client.get("/api/v2/presets")
    assert response.status_code == 200
    assert "items" in response.json()
```

### Running Tests

```bash
# All tests
pytest

# Specific test file
pytest tests/test_api.py

# Specific test function
pytest tests/test_api.py::test_list_presets

# With coverage report
pytest --cov=studio_api --cov-report=term-missing

# Verbose output
pytest -v -s
```

### Test Coverage Report

Current coverage: **85.23%** (237 statements, 35 missed)

```bash
# Generate HTML coverage report
pytest --cov-report=html
open htmlcov/index.html
```

---

## Performance

### API Response Time Targets

- **P50**: <100ms
- **P95**: <200ms
- **P99**: <500ms

### Optimization Strategies

**Database Query Optimization**:
- Indexes on frequently queried columns (category, name, tags)
- JSONB indexing for metadata queries
- Connection pooling for efficient database connections

**Caching Strategy**:
- Repository-level caching for frequently accessed presets
- Category list caching (low change frequency)
- MCP suggestion caching with TTL

**Async Processing**:
- SQLAlchemy 2.0 async engine for non-blocking I/O
- FastAPI async endpoints for concurrent request handling
- Async HTTP client for MCP integration

---

## Troubleshooting

### Common Issues

**Database Connection Errors**:
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
alembic current

# Verify PostgreSQL service
pg_isready -h localhost -p 5432
```

**Migration Conflicts**:
```bash
# Reset database (development only)
alembic downgrade base
alembic upgrade head

# View migration status
alembic history
alembic current
```

**Test Failures**:
```bash
# Run tests with verbose output
pytest -v -s

# Check test database
pytest --log-cli-level=DEBUG

# Clear test cache
pytest --cache-clear
```

---

## Contributing

### Development Workflow

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/SPEC-XXX-description
   ```

2. **Implement Feature**:
   - Write tests first (TDD approach)
   - Implement feature with type hints
   - Update documentation

3. **Run Quality Checks**:
   ```bash
   ruff check src/ tests/
   mypy src/
   pytest --cov=studio_api
   ```

4. **Commit with Traceability**:
   ```bash
   git commit -m "feat(api): [SPEC-STUDIO-002] Add preset filtering"
   ```

5. **Create Pull Request**:
   - Link to SPEC document
   - Include test coverage report
   - Update CHANGELOG.md

### Code Review Checklist

- [ ] All tests passing (≥85% coverage)
- [ ] Type hints added for new functions
- [ ] API documentation updated (docstrings)
- [ ] Migration scripts tested
- [ ] Error handling implemented
- [ ] Logging added for debugging
- [ ] Security considerations reviewed

---

## License

Copyright © 2026 Tekton Studio. All rights reserved.

---

## Related Documentation

- [SPEC-STUDIO-002](../../.moai/specs/SPEC-STUDIO-002/spec.md) - Architecture specification
- [Implementation Status](../../.moai/specs/SPEC-STUDIO-002/implementation-status.md) - Implementation details
- [Acceptance Criteria](../../.moai/specs/SPEC-STUDIO-002/acceptance.md) - Test scenarios
- [MCP Integration Guide](../../docs/architecture/mcp-integration.md) - MCP setup

---

**Version**: 0.1.0
**Last Updated**: 2026-01-15
**Status**: Production Ready
**Maintained by**: Tekton Studio Team
