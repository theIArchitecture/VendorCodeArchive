/**
 * Test file for Semgrep console.log detection
 * This file contains intentional console.log violations to test Semgrep plugin
 */

function calculateTotal(items) {
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
