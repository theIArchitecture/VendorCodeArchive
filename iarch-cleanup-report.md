# VendorCodeArchive .iarch Cleanup Report

## Issues Found

### 1. DUPLICATE RULES (Should be removed - come from bundled defaults)

**Location**: `VendorCodeArchive/NVIDIA/.iarch/rules/architecture/`
- ❌ **ARCH-CIRCULAR-001.iarch** - Duplicates bundled default from `IArchitecture-DotNet/.iarch/rules/architecture/`
- ❌ **ARCH-LAYER-001.iarch** - Duplicates bundled default from `IArchitecture-DotNet/.iarch/rules/architecture/`

**Why this is wrong**:
- Generic architecture rules (circular dependencies, layer violations) are provided as bundled defaults
- Vendor repos should only contain vendor-specific rules
- IArchEngine automatically discovers bundled defaults if not present in vendor repo
- Duplicates cause confusion and maintenance overhead

**Recommendation**: DELETE these files - they will be inherited from bundled defaults

---

### 2. MISPLACED AWS RULES (Wrong directory structure)

**Current location**: `VendorCodeArchive/aws-sdk-net/.iarch/rules/` (root level)
- ⚠️ **AWS-CREDENTIALS-CONFIG-HARDCODED.iarch**
- ⚠️ **AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE.iarch**

**Should be**: `VendorCodeArchive/aws-sdk-net/.iarch/rules/security/`

**Why this matters**:
- Rules should be organized by category (security, performance, architecture, etc.)
- Keeps repository organized and maintainable
- Easier to find related rules

**Recommendation**: Move to `security/` subdirectory

---

## Correct Structure (After cleanup)

```
VendorCodeArchive/
├── aws-sdk-net/
│   └── .iarch/
│       └── rules/
│           └── security/
│               ├── AWS-CREDENTIALS-CONFIG-HARDCODED.iarch
│               ├── AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE.iarch
│               └── TEST-RULE-001.iarch (already correctly placed)
│
├── NVIDIA/
│   └── .iarch/
│       └── rules/
│           ├── NVIDIA-CUDA-ERROR-001.iarch ✅
│           └── NVIDIA-CUDA-MEMORY-002.iarch ✅
│           # REMOVED: architecture/ directory (duplicates)
│
├── React/
│   └── .iarch/
│       └── rules/
│           ├── REACT-COMPONENT-LIFECYCLE-001.iarch ✅
│           └── REACT-PROD-ERROR-CODES-001.iarch ✅
│
├── Tensorflow/
│   └── .iarch/
│       └── rules/
│           ├── TENSORFLOW-API-COMPATIBILITY-001.iarch ✅
│           ├── TENSORFLOW-CUDA-DEPENDENCY-004.iarch ✅
│           └── TENSORFLOW-PRINT-001.iarch ✅
│
└── VSCode/
    └── .iarch/
        └── rules/
            ├── VSCODE-DANGEROUS-ASSERTIONS-006.iarch ✅
            └── VSCODE-SERVICE-BRAND-005.iarch ✅
```

---

## Bundled Defaults (Don't duplicate these!)

These rules are provided by `IArchitecture-DotNet/.iarch/rules/` and should NOT be duplicated:

### Architecture (Generic)
- `ARCH-CIRCULAR-001.iarch` - Circular dependency detection
- `ARCH-LAYER-001.iarch` - Layer violation detection

### Infrastructure (AWS Generic)
- `AWS-ARCH-HA-001.iarch` - High availability patterns
- `AWS-ARCH-LB-001.iarch` - Load balancer patterns

### Meta-Architecture
- `IARCHITECTURE-SELF-GOVERNANCE.iarch` - Self-referential rules
- `META-VALIDATOR-001.iarch` - .iarch file validation

---

## Action Items

1. **Delete duplicate architecture rules**:
   ```
   rm VendorCodeArchive/NVIDIA/.iarch/rules/architecture/ARCH-CIRCULAR-001.iarch
   rm VendorCodeArchive/NVIDIA/.iarch/rules/architecture/ARCH-LAYER-001.iarch
   rmdir VendorCodeArchive/NVIDIA/.iarch/rules/architecture/
   ```

2. **Move misplaced AWS rules**:
   ```
   mv aws-sdk-net/.iarch/rules/AWS-CREDENTIALS-CONFIG-HARDCODED.iarch aws-sdk-net/.iarch/rules/security/
   mv aws-sdk-net/.iarch/rules/AWS-FIPS-CRYPTOGRAPHY-COMPLIANCE.iarch aws-sdk-net/.iarch/rules/security/
   ```

---

## Summary

- **Total .iarch files**: 17
- **Duplicates to remove**: 2
- **Files to reorganize**: 2
- **Correctly placed**: 13

After cleanup: **15 vendor-specific rules** properly organized
