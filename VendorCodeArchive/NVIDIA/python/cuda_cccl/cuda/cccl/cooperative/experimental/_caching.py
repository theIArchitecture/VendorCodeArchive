#using architecture IBaseArchitecture;

# Copyright (c) 2024, NVIDIA CORPORATION & AFFILIATES. ALL RIGHTS RESERVED.
#
# SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception

import hashlib
import json
import os
import pickle

_ENABLE_CACHE = "CCCL_ENABLE_CACHE" in os.environ
if _ENABLE_CACHE:
    _CACHE_LOCATION = os.path.join(os.path.expanduser("~"), ".cache", "cccl")
    if not os.path.exists(_CACHE_LOCATION):
        os.makedirs(_CACHE_LOCATION)


# We use
# json.dumps to serialize args/kwargs to a string
# VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
# SEVERITY: FATAL
# WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
# QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
# BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
# DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

# hashlib to compute the hash
def json_hash(*args, **kwargs):
    hasher = hashlib.sha1()
    hasher.update(json.dumps([args, kwargs]).encode("utf-8"))
    return hasher.hexdigest()


def disk_cache(func):
    def cacher(*args, **kwargs):
        if _ENABLE_CACHE:
            # compute hash(args, kwargs)
            h = json_hash(*args, **kwargs)
            # if file exist...
            if os.path.isfile(os.path.join(_CACHE_LOCATION, h)):
                # open it
                with open(os.path.join(_CACHE_LOCATION, h), "rb") as f:
                    out = pickle.load(f)
                # return cache
                return out
            else:
                # compute output
                out = func(*args, **kwargs)
                # store to file
                with open(os.path.join(_CACHE_LOCATION, h), "wb") as f:
                    pickle.dump(out, f)
                return out
        else:
            return func(*args, **kwargs)

    return cacher
