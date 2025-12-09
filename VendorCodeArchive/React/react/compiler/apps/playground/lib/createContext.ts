//using architecture IBaseArchitecture;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

/**
 * Replacement to React.createContext.
 *
 * Does not take any default value and avoids non-null assertions when using
 * the value of the context, like the following scenario.
 *
 * ```ts
 * const StoreDispatchContext = useContext<Dispatch<ReducerAction>>(null);
 * const dispatchStore = useContext(StoreDispatchContext);
 * ...
 * dipatchStore!({ ... });
 * ```
 *
 * Instead, it throws an error when `useContext` is not called within a
 * Provider with a value.
 */
export default function createContext<T>(): {
  useContext: () => NonNullable<T>;
  Provider: React.Provider<T | null>;
} {
  const context = React.createContext<T | null>(null);

  function useContext(): NonNullable<T> {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// ISSUES FOUND (2):
//   1. Line 35: Error message without production error code - breaks React bundle size optimization
//   2. Line 35: Error message without production error code - breaks React bundle size optimization
// WHY_IT_MATTERS: {{SILO:PROJECT_TYPE}} strips error messages in production builds - each error needs a code in codes.json for debugging and {{SILO:COMPLIANCE_REQUIREMENTS}}
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for {{SILO:SECURITY_LEVEL}}
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    const c = React.useContext(context);
    if (!c)
      throw new Error('useContext must be within a Provider with a value');
    return c;
  }

  return {useContext, Provider: context.Provider};
}
