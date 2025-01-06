# Changelog

All notable changes to this project are documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.0.1] - 2025-01-02

### Added
- Initial release of OrgaNizeAI.
- **Analyze and Suggest Structure**: Automatically generate a new logical folder structure based on the source directory, powered by OpenAI.
- **Flexible Preview and Confirmation**: Preview the proposed structure in the terminal, with options to accept, regenerate, or exit.
- **Apply New Structure**: Copy files from the source to the target directory in the newly organized structure.
- **Cross-Platform Compatibility**: Support for file paths on Linux, Windows, and macOS.
- **Customizable Paths**: Environment variables or command-line arguments to define source and target directories.

---

## [Unreleased]

### Planned
- **Ignore List for API Requests**: Option to exclude certain files/folders from the OpenAI suggestion process.
- **Ignore List for Destination**: Prevent specific files/folders from being copied to the new structure.
- **Extended Error Handling**: More robust logging and error reporting for file operations.
- **Additional CLI Options**: Command-line flags for skipping prompts and applying custom organization rules.