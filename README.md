# Tekken Tag Web

Browser frontend for MAME WebAssembly.

## Hosting
Upload the generated package contents to your web host and keep your own legally obtained ROM at:

roms/tekken-tag.zip

The frontend mounts that archive as /roms/tektagt.zip because the MAME driver name is tektagt.

The ROM is intentionally not stored in this public repository.

## Build
GitHub Actions builds a minimal MAME WebAssembly core using anomixer/MameWasm and the Namco System 12 source file.
