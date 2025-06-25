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

# Install runtime dependencies needed for the script AND for tilemaker to run.
RUN apt-get update && \
    apt-get install -y \
    wget \
    gdal-bin \
    python3-gdal \
    nodejs \    
    npm \
    ca-certificates \
    dos2unix \
    awscli \
    # Add runtime libraries for tilemaker
    liblua5.3-0 \
    zlib1g \
    libshp2 \
    libsqlite3-0 \
    libprotobuf23 \
    libboost-program-options1.74.0 \
    libboost-filesystem1.74.0 && \
    rm -rf /var/lib/apt/lists/*

# Set the default shell to bash for subsequent RUN commands.
# This ensures a more predictable environment for PATH variables.
SHELL ["/bin/bash", "-c"]

# Install PMTiles and Cloudflare Wrangler CLIs via npm.
RUN npm install -g pmtiles wrangler

# Explicitly add the standard global install location for npm packages to the system's PATH.
# This ensures that commands like 'pmtiles' and 'wrangler' can be found.
ENV PATH="/usr/local/bin:${PATH}"

# Copy the compiled tilemaker binary from the builder stage.
COPY --from=builder /usr/local/bin/tilemaker /usr/local/bin/tilemaker

# Set up the working directory.
WORKDIR /app

# Copy the build script into the image.
COPY data-pipeline/build_map.sh .

# Use dos2unix to ensure line endings are correct, then make the script executable.
RUN dos2unix ./build_map.sh && \
    chmod +x ./build_map.sh

# Set the entrypoint to explicitly use /bin/bash to run the script.
ENTRYPOINT ["/bin/bash", "./build_map.sh"]
