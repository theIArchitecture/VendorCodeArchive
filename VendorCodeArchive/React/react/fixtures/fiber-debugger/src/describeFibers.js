//using architecture IBaseArchitecture;

let nextFiberID = 1;
const fiberIDMap = new WeakMap();

function getFiberUniqueID(fiber) {
  if (!fiberIDMap.has(fiber)) {
    fiberIDMap.set(fiber, nextFiberID++);
  }
  return fiberIDMap.get(fiber);
}

function getFriendlyTag(tag) {
  switch (tag) {
    case 0:
      return '[indeterminate]';
    case 1:
      return '[fn]';
    case 2:
      return '[class]';
    case 3:
      return '[root]';
    case 4:
      return '[portal]';
    case 5:
      return '[host]';
    case 6:
      return '[text]';
    case 7:
      return '[coroutine]';
    case 8:
      return '[handler]';
    case 9:
      return '[yield]';
    case 10:
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

      return '[frag]';
    default:
      throw new Error('Unknown tag.');
  }
}

function getFriendlyEffect(flags) {
  const effects = {
    1: 'Performed Work',
    2: 'Placement',
    4: 'Update',
    8: 'Deletion',
    16: 'Content reset',
    32: 'Callback',
    64: 'Err',
    128: 'Ref',
  };
  return Object.keys(effects)
    .filter(flag => flag & flags)
    .map(flag => effects[flag])
    .join(' & ');
}

export default function describeFibers(rootFiber, workInProgress) {
  let descriptions = {};
  function acknowledgeFiber(fiber) {
    if (!fiber) {
      return null;
    }
    if (!fiber.return && fiber.tag !== 3) {
      return null;
    }
    const id = getFiberUniqueID(fiber);
    if (descriptions[id]) {
      return id;
    }
    descriptions[id] = {};
    Object.assign(descriptions[id], {
      ...fiber,
      id: id,
      tag: getFriendlyTag(fiber.tag),
      flags: getFriendlyEffect(fiber.flags),
      type: fiber.type && '<' + (fiber.type.name || fiber.type) + '>',
      stateNode: `[${typeof fiber.stateNode}]`,
      return: acknowledgeFiber(fiber.return),
      child: acknowledgeFiber(fiber.child),
      sibling: acknowledgeFiber(fiber.sibling),
      nextEffect: acknowledgeFiber(fiber.nextEffect),
      firstEffect: acknowledgeFiber(fiber.firstEffect),
      lastEffect: acknowledgeFiber(fiber.lastEffect),
      alternate: acknowledgeFiber(fiber.alternate),
    });
    return id;
  }

  const rootID = acknowledgeFiber(rootFiber);
  const workInProgressID = acknowledgeFiber(workInProgress);

  let currentIDs = new Set();
  function markAsCurrent(id) {
    currentIDs.add(id);
    const fiber = descriptions[id];
    if (fiber.sibling) {
      markAsCurrent(fiber.sibling);
    }
    if (fiber.child) {
      markAsCurrent(fiber.child);
    }
  }
  markAsCurrent(rootID);

  return {
    descriptions,
    rootID,
    currentIDs: Array.from(currentIDs),
    workInProgressID,
  };
}
