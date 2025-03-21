import { User, InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

class LocalStorage implements IStorage {
  private STORAGE_KEY = 'body-calculator-users';
  private currentId: number;

  constructor() {
    const users = this.getUsers();
    this.currentId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) + 1 
      : 1;
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  async getUser(id: number): Promise<User | undefined> {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = this.getUsers();
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    users.push(user);
    this.saveUsers(users);
    return user;
  }
}

export const storage = new LocalStorage(); 