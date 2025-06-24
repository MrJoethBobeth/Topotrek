# Stage 1: Builder
# This stage compiles the 'tilemaker' tool from source.
FROM ubuntu:22.04 AS builder

# Set a non-interactive frontend for package installations to avoid prompts.
ENV DEBIAN_FRONTEND=noninteractive

# Install all known build dependencies for tilemaker.
RUN apt-get update && \
    apt-get install -y \
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

# Clone the tilemaker repository.
RUN git clone https://github.com/systemed/tilemaker.git /usr/src/tilemaker

# Build tilemaker.
WORKDIR /usr/src/tilemaker
RUN mkdir build && cd build && \
    cmake .. && \
    make -j$(nproc) && \
    make install

# -----------------------------------------------------------------------------

# Stage 2: Final Image
# This stage creates the final, lean image with only the necessary runtime tools.
FROM ubuntu:22.04

# Set a non-interactive frontend for package installations.
ENV DEBIAN_FRONTEND=noninteractive

# Install runtime dependencies needed for the script.
# This includes Node.js for wrangler, GDAL for GIS operations, and wget.
RUN apt-get update && \
    apt-get install -y \
    wget \
    gdal-bin \
    python3-gdal \
    nodejs \
    npm \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install PMTiles and Cloudflare Wrangler CLIs via npm.
# This is more robust than using wget for a specific version.
RUN npm install -g pmtiles wrangler

# Copy the compiled tilemaker binary from the builder stage.
COPY --from=builder /usr/local/bin/tilemaker /usr/local/bin/tilemaker

# Set up the working directory.
WORKDIR /app

# Copy the build script into the image.
COPY ./data-pipeline/build_map.sh .

# Make the script executable.
RUN chmod +x ./build_map.sh

# Set the entrypoint to the build script.
ENTRYPOINT ["./build_map.sh"]