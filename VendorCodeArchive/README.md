# IArchitecture Vendor Code Archive

This repository contains snapshots of major open-source projects used for architectural analysis and rule discovery by the IArchitecture system.

## Purpose

This archive enables:
- **Pattern Discovery:** Automated analysis of real-world code to discover anti-patterns
- **Rule Generation:** Creation of architectural rules based on actual violations found in production codebases
- **Transparency:** Full access to all code being analyzed - nothing hidden
- **Monthly Updates:** Fresh snapshots to catch new violations in latest releases

## Included Projects

| Project | Files | Description |
|---------|-------|-------------|
| **aws-sdk-net** | ~151,000 | AWS SDK for .NET - Official AWS client library |
| **Tensorflow** | ~19,000 | Google's machine learning framework |
| **NVIDIA** | TBD | NVIDIA CUDA samples and tools |
| **VSCode** | TBD | Microsoft Visual Studio Code editor |
| **React** | TBD | Facebook's React JavaScript library |

## Usage

This repository is cloned by the IArchitecture Discovery Agent (Archie) during monthly scans:

1. Archie scans all source files for architectural anti-patterns
2. Patterns are filtered against existing IArchitecture rules
3. New patterns generate proposed .iarch rule files
4. JIRA tickets are created for architect review
5. Approved rules are added to the main rule repository

## Updates

Vendor code is updated monthly to analyze the latest releases and discover new violations.

## License

Each subdirectory maintains its original license from the source repository. See individual LICENSE files.

This archive is used for analysis purposes only under fair use for software quality research.

## Related Repositories

- **DemoRepo:** https://github.com/theIArchitecture/DemoRepo - Main demo and rule repository
- **IArchitecture:** https://github.com/theIArchitecture (private) - Core system implementation
