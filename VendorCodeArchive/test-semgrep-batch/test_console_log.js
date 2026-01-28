/**
 * Test file for Semgrep console.log detection
 */

function calculateTotal(items) {
    console.log('Starting calculation');  // VIOLATION 1

    let total = 0;
    for (const item of items) {
        console.log('Processing item:', item);  // VIOLATION 2
        total += item.price;
    }

    console.log('Total calculated:', total);  // VIOLATION 3
    return total;
}

function processOrder(order) {
    console.log('Processing order:', order.id);  // VIOLATION 4

    const total = calculateTotal(order.items);

    if (total > 1000) {
        console.log('Large order detected');  // VIOLATION 5
    }

    return total;
}

module.exports = { calculateTotal, processOrder };