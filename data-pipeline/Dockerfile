# Use a base Ubuntu image with common tools
FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install base dependencies and geospatial tools
# This is a comprehensive list including all libraries required by tilemaker
RUN apt-get update && apt-get install -y \
    # Core build tools
    build-essential \
    cmake \
    git \
    wget \
    unzip \
    # Libraries for Tilemaker compilation
    libboost-all-dev \
    libshp-dev \
    liblua5.3-dev \
    libexpat1-dev \
    # Libraries for GDAL and other tools
    libsqlite3-dev \
    zlib1g-dev \
    luajit \
    libluajit-5.1-dev \
    gdal-bin \
    python3-gdal \
    python3-pip \
    # Node.js and npm for pmtiles and wrangler
    nodejs \
    npm

# Install Tilemaker from source
RUN git clone https://github.com/systemed/tilemaker.git /usr/src/tilemaker
# Create a build directory and set it as the working directory
WORKDIR /usr/src/tilemaker
RUN mkdir build
WORKDIR /usr/src/tilemaker/build

# Run cmake from the build directory, pointing to the parent source directory
RUN cmake ..
# Now run make and make install
RUN make
RUN make install

# Reset working directory for subsequent commands
WORKDIR /

# Install PMTiles and Wrangler via npm
RUN npm install -g pmtiles wrangler

# Set up the final working directory for the map build script
WORKDIR /map_build

# Copy the build script into the container from the correct sub-directory
# This path is relative to the build context (the project root)
COPY data-pipeline/build_map.sh .
# Make the script executable
RUN chmod +x build_map.sh

# The command that will run when the container starts
ENTRYPOINT ["./build_map.sh"]
