# Stage 1: Builder
# This stage compiles the 'tilemaker' tool from source.
FROM ubuntu:22.04 AS builder

# Set a non-interactive frontend for package installations to avoid prompts.
ENV DEBIAN_FRONTEND=noninteractive

# Install all known build dependencies for tilemaker.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    build-essential \
    cmake \
    git \
    libboost-all-dev \
    zlib1g-dev \
    liblua5.3-dev \
    libprotobuf-dev \
    protobuf-compiler \
    rapidjson-dev \
    libshp-dev \
    libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Clone the tilemaker repository and build it.
WORKDIR /usr/src/tilemaker
RUN git clone https://github.com/systemed/tilemaker.git . && \
    mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc) && \
    make install

# -----------------------------------------------------------------------------

# Stage 2: Final Image
# This stage creates the final, lean image with only the necessary runtime tools.
FROM ubuntu:22.04

# Set a non-interactive frontend for package installations.
ENV DEBIAN_FRONTEND=noninteractive

# Install runtime dependencies needed for the script AND for the compiled tools to run.
# Added 'golang' to build pmtiles from source.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    gdal-bin \
    python3-gdal \
    curl \
    unzip \
    git \
    dos2unix \
    golang \
    # Add runtime libraries for tilemaker
    liblua5.3-0 \
    zlib1g \
    libshp2 \
    libsqlite3-0 \
    libprotobuf23 \
    libboost-program-options1.74.0 \
    libboost-filesystem1.74.0 \
    # Add build dependencies for Tippecanoe
    build-essential \
    pkg-config \
    libsqlite3-dev \
    zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# --- Install Tippecanoe from source ---
RUN git clone https://github.com/felt/tippecanoe.git /usr/src/tippecanoe && \
    cd /usr/src/tippecanoe && \
    make -j$(nproc) && \
    make install && \
    cd / && rm -rf /usr/src/tippecanoe

# --- Install PMTiles binary ---
# This is the new, official installation method using 'go install'.
# It is more reliable than downloading release assets directly.
RUN go install github.com/protomaps/pmtiles/cmd/pmtiles@latest

# --- Install Rclone for Cloudflare R2 uploads ---
RUN curl https://rclone.org/install.sh | bash

# Copy the compiled tilemaker binary from the builder stage.
COPY --from=builder /usr/local/bin/tilemaker /usr/local/bin/tilemaker

# Set up the working directory and copy the build script.
WORKDIR /app
COPY data-pipeline/build_map.sh .

# Fix Windows line endings and make the script executable.
RUN dos2unix ./build_map.sh && \
    chmod +x ./build_map.sh

# Go installs binaries to /root/go/bin by default. Add this to the PATH.
ENV PATH="/root/go/bin:${PATH}"

# Set the entrypoint to run the script.
ENTRYPOINT ["./build_map.sh"]