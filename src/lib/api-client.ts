import { supabase } from './supabase';

export class ApiClient {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
    };
  }

  private getToken(): string {
    // This would typically get the token from Supabase auth
    // For now, we'll assume it's handled by the auth system
    return '';
  }

  async createJournalEntry(content: string) {
    const response = await fetch('/api/journal', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getJournalEntries() {
    const response = await fetch('/api/journal', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createGoal(title: string, description: string, target: number, progress?: number) {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title, description, target, progress }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getGoals() {
    const response = await fetch('/api/goals', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async updateGoal(id: string, updates: { title?: string; description?: string; target?: number; progress?: number }) {
    const response = await fetch('/api/goals', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id, ...updates }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async addFriend(friendEmail: string) {
    const response = await fetch('/api/friends', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ friendEmail }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getFriends() {
    const response = await fetch('/api/friends', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createAffirmation(content: string) {
    const response = await fetch('/api/affirmations', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAffirmations() {
    const response = await fetch('/api/affirmations', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createMeditation(content: string, audioDataUri?: string) {
    const response = await fetch('/api/meditations', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content, audioDataUri }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getMeditations() {
    const response = await fetch('/api/meditations', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
