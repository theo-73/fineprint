# =================================================================
# FinePrint Production Dockerfile
# Multi-stage container running FastAPI backend and Next.js frontend
# =================================================================

FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies for PDF parsing and compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project source files
COPY backend/ ./backend/
COPY mcp_servers/ ./mcp_servers/
COPY sample_invoices/ ./sample_invoices/
COPY pyproject.toml .

# Create storage directories
RUN mkdir -p uploaded_invoices generated_packets

ENV PYTHONPATH=/app
ENV HOST=0.0.0.0
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
