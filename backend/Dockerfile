FROM --platform=${TARGETPLATFORM} python:3.13-slim AS builder

WORKDIR /usr/src/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apt-get update -q \
    && apt-get install --no-install-recommends \
    libpq-dev \
    gcc g++ make \
    python3-dev \
    libffi-dev musl-dev git -yqq
COPY ./requirements.txt .
RUN pip install --upgrade pip \
    && pip wheel --no-cache-dir --no-deps \
    --wheel-dir /usr/src/app/wheels \
    -r requirements.txt

FROM --platform=${TARGETPLATFORM} python:3.13-slim AS final

WORKDIR /usr/src/app
RUN apt-get update -q \
    && apt-get install --no-install-recommends \
    libpq-dev ncat gettext python3-dev \
    libffi-dev musl-dev git \
    gcc g++ make curl \
    -yqq && apt-get clean -y

# create the app user and the appropriate directories
RUN useradd -m -d /usr/src/app -s /bin/bash -c "Container User" -u 1000 app
RUN mkdir -p staticfiles mediafiles logs

COPY . .
RUN sed -i 's/\r$//g' ./entrypoint.sh && chmod +x ./entrypoint.sh

COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/* && rm -rf /wheels

RUN chown -R app:app .
USER app

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://backend:8000/api/v1/ || exit 1


EXPOSE 8000

# Runtime command
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
