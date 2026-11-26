# =================================================================
# FinePrint Production Dockerfile
# Optimized multi-stage container running FastAPI backend
# =================================================================

# Stage 1: Build dependencies & wheels
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Minimal runtime image
FROM python:3.11-slim AS runner
WORKDIR /app

# Copy installed user packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

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
