/**
 * Test file for Semgrep console.log detection
 * This file contains intentional console.log violations to test Semgrep plugin
 */

function calculateTotal(items) {
// VIOLATION: CUSTOM-LOGGING-001 - Detects console.log statements that should not be in production code
// SEVERITY: WARNING
// ISSUES FOUND (5):
//   1. Line 7: Detects console.log statements that should not be in production code
//   2. Line 11: Detects console.log statements that should not be in production code
//   3. Line 15: Detects console.log statements that should not be in production code
//   4. Line 20: Detects console.log statements that should not be in production code
//   5. Line 25: Detects console.log statements that should not be in production code
// WHY_IT_MATTERS: Console.log statements expose internal implementation details and can impact performance in production
// QUICK_FIX: Replace with proper logging framework (e.g., Winston, Bunyan) or remove
// BUSINESS_IMPACT: Debug statements left in production code can leak sensitive information and degrade user experience
// DOCS: https://example.com/logging-best-practices

    console.log('Starting calculation');  // VIOLATION: console.log usage

    let total = 0;
    for (const item of items) {
        console.log('Processing item:', item);  // VIOLATION: console.log usage
        total += item.price;
    }

    console.log('Total calculated:', total);  // VIOLATION: console.log usage
    return total;
}

function processOrder(order) {
    console.log('Processing order:', order.id);  // VIOLATION: console.log usage

    const total = calculateTotal(order.items);

    if (total > 1000) {
        console.log('Large order detected');  // VIOLATION: console.log usage
    }

    return total;
}

// This should detect 5 console.log violations
module.exports = { calculateTotal, processOrder };
