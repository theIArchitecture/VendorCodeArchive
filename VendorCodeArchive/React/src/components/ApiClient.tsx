import React from 'react';

export class ApiClient {
    private apiKey = "sk_live_1234567890abcdef"; // VIOLATION: SECURITY-HARDCODED-SECRETS-001

    async fetchData(endpoint: string): Promise<any> {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
        return response.json();
    }
}
